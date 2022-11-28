import { Response, Request } from 'express'
import { IUser } from '../Interfaces'
import { User, Plant } from '../Models'
const mongodb = require('mongodb')
const { ObjectId } = mongodb
import * as dotenv from 'dotenv'
dotenv.config()
import bcrypt from 'bcrypt'
import crypto from 'crypto'
const saltRounds = 10
import jwt from 'jsonwebtoken'
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL

// template for new signups & resending verification email
const EMAIL_VERIFICATION_TEMPLATE_ID = process.env.SENDGRID_EMAIL_VERIFICATION_TEMPLATE_ID

// template for when email has changed
const NEW_EMAIL_VERIFICATION_TEMPLATE_ID = process.env.SENDGRID_NEW_EMAIL_VERIFICATION_TEMPLATE_ID

// (CREATE/POST) ADDS A NEW USER
export const createUser = async (req: Request, res: Response) => {
  try {
    const hashedPwd = await bcrypt.hash(req.body.password, saltRounds)
    const existingEmail = await User.findOne({
      email: { $regex: new RegExp(`^${req.body.email}$`, 'i') },
    })
    const existingUsername = await User.findOne({
      username: { $regex: new RegExp(`^${req.body.username}$`, 'i') },
    })

    if (existingEmail) {
      return res.status(409).json({ message: 'That email is already in use' })
    } else if (existingUsername) {
      return res.status(409).json({ message: 'That username is taken' })
    } else {
      const code = crypto.randomBytes(20).toString('hex')

      const user: IUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password: hashedPwd,
        verificationCode: code,
      })
      const newUser: IUser = await user.save()

      const message = {
        personalizations: [
          {
            to: {
              email: req.body.email,
              name: `${req.body.firstName} ${req.body.lastName}`,
            },
            dynamic_template_data: {
              first_name: req.body.firstName,
              verification_link: `https://www.plantgeek.co/verify-email/${code}`,
            },
          },
        ],
        from: { email: ADMIN_EMAIL, name: 'plantgeek' },
        template_id: EMAIL_VERIFICATION_TEMPLATE_ID,
      }

      await sgMail.send(message).catch(err => console.error(err.response?.body?.errors))

      return res.status(201).json({
        data: user,
        token: jwt.sign({ userId: newUser._id }, process.env.TOKEN_SECRET, {
          expiresIn: '7d',
        }),
      })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const resendVerificationEmail = async (req: Request, res: Response) => {
  const { userId } = req.params

  try {
    const code = crypto.randomBytes(20).toString('hex')

    await User.updateOne({ _id: ObjectId(userId) }, { $set: { verificationCode: code } })

    const message = {
      personalizations: [
        {
          to: {
            email: req.body.email,
            name: `${req.body.firstName} ${req.body.lastName}`,
          },
          dynamic_template_data: {
            first_name: req.body.firstName,
            verification_link: `https://www.plantgeek.co/verify-email/${code}`,
          },
        },
      ],
      from: { email: ADMIN_EMAIL, name: 'plantgeek' },
      template_id: EMAIL_VERIFICATION_TEMPLATE_ID,
    }

    await sgMail.send(message).catch(err => console.error(err))

    return res.status(200).json({ message: 'Email sent' })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

// (READ/POST) AUTHENTICATES USER WHEN LOGGING IN
export const authenticateUser = async (req: Request, res: Response) => {
  try {
    const user: IUser | null = await User.findOne(
      // find by username or email
      {
        $or: [
          { username: { $regex: new RegExp(`^${req.body.username}$`, 'i') } },
          { email: { $regex: new RegExp(`^${req.body.username}$`, 'i') } },
        ],
      }
    )
    if (user) {
      const isValid = await bcrypt.compare(req.body.password, user.password)
      if (isValid) {
        return res.status(200).json({
          token: jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: '7d' }),
          data: user,
        })
      } else {
        return res.status(403).json({ message: 'Incorrect password' })
      }
    } else {
      return res.status(404).json({ message: 'User not found' })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

// (READ/POST) VERIFIES JWT TOKEN
export const verifyToken = async (req: Request, res: Response) => {
  try {
    const verifiedToken = jwt.verify(req.body.token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return false
      } else {
        return decoded.userId
      }
    })
    if (verifiedToken) {
      try {
        const user: IUser | null = await User.findOne({
          _id: ObjectId(verifiedToken),
        })
        if (user) {
          return res.status(200).json({ user: user })
        } else {
          return res.status(404).json({ message: 'User not found' })
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.stack)
          return res.status(500).json({ message: 'Internal server error' })
        }
      }
    } else {
      return res.status(400).json({ message: `Token couldn't be verified` })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const verifyEmail = async (req: Request, res: Response) => {
  const { code } = req.params
  const { userId } = req.body

  try {
    const user: IUser | null = await User.findOne({
      _id: ObjectId(userId),
    })

    if (user) {
      if (user.verificationCode === code) {
        await User.updateOne(
          { _id: ObjectId(userId) },
          { $set: { emailVerified: true, verificationCode: null } }
        )
        return res.status(200).json({ message: 'Email verified' })
      } else {
        return res.status(400).json({ message: 'Invalid verification link' })
      }
    } else {
      return res.status(404).json({ message: 'User not found' })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const sendPasswordResetCode = async (req: Request, res: Response) => {
  const { email } = req.body

  try {
    const user: IUser | null = await User.findOne({ email })

    if (user) {
      const code = Math.floor(100000 + Math.random() * 900000)
      const hashedCode = await bcrypt.hash(code.toString(), saltRounds)
      await User.updateOne({ email }, { $set: { passwordResetCode: hashedCode } })

      const msg = {
        to: email,
        from: ADMIN_EMAIL,
        subject: 'Password reset',
        text: `Use this code to reset your password on plantgeek: ${code}`,
        html: `Use this code to reset your password on plantgeek: <strong>${code}</strong>`,
      }

      sgMail
        .send(msg)
        .then(() => {
          return res.status(200).json({ message: 'Code sent' })
        })
        .catch(error => {
          console.error(error)
        })
    } else {
      return res.status(404).json({ message: 'Email not found' })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      return res.status(500).send('Internal server error')
    }
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body
  try {
    const user: IUser | null = await User.findOne({ email })
    if (user) {
      const isValid = await bcrypt.compare(code.toString(), user.passwordResetCode)
      if (isValid) {
        const hashedPwd = await bcrypt.hash(newPassword, saltRounds)
        await User.updateOne({ email }, { $set: { password: hashedPwd, passwordResetCode: null } })
        return res.status(200).json({ message: 'Password changed' })
      } else {
        return res.status(403).json({ message: 'Code is incorrect' })
      }
    } else {
      return res.status(404).json({ message: 'Email not found' })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find().lean()
    if (users) {
      return res.status(200).json({ data: users })
    } else {
      return res.status(404).json({ message: 'No users found' })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const getUser = async (req: Request, res: Response) => {
  try {
    const user: IUser | null = await User.findOne({ _id: ObjectId(req.params.id) }).lean()
    if (user) {
      // include number of approved contributions
      const contributions: number = await Plant.countDocuments({
        contributorId: ObjectId(req.params.id),
        review: 'approved',
      })
      const data = {
        ...user,
        contributions,
      }
      return res.status(200).json({ user: data })
    } else {
      return res.status(404).json({ message: 'User not found' })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const getWishlist = async (req: Request, res: Response) => {
  const { userId } = req.params
  try {
    // get user's plantWishlist and include plant data
    const user: IUser = await User.findOne({ _id: ObjectId(userId) })
      .populate('plantWishlist')
      .lean()

    return res.status(200).json({ wishlist: user.plantWishlist })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const getCollection = async (req: Request, res: Response) => {
  const { userId } = req.params
  try {
    // get user's plantCollection and include plant data
    const user: IUser = await User.findOne({ _id: ObjectId(userId) })
      .populate('plantCollection')
      .lean()

    return res.status(200).json({ collection: user.plantCollection })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const userId = ObjectId(req.params.id)
  const { email, username, currentPassword, newPassword } = req.body

  try {
    const filter = { _id: userId }
    const user: IUser | null = await User.findOne(filter)

    let updates = {}

    if (newPassword) {
      const passwordValid = await bcrypt.compare(currentPassword, user?.password)
      if (!passwordValid) {
        return res.status(400).json({ message: 'Incorrect password' })
      } else {
        const hashedPwd = await bcrypt.hash(newPassword, saltRounds)
        updates = { password: hashedPwd }
      }
    } else {
      updates = req.body
    }

    const existingEmail: IUser | null = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') },
    })
    const existingUsername: IUser | null = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') },
    })

    if (existingEmail && !existingEmail._id.equals(userId)) {
      return res.status(400).json({ message: 'That email is already in use' })
    } else if (existingUsername && !existingUsername._id.equals(userId)) {
      return res.status(400).json({ message: 'That username is taken' })
    } else {
      // check if email is being updated, if so set emailVerified to false and send new verification email
      if (email && email !== user?.email) {
        const code = crypto.randomBytes(20).toString('hex')
        updates = { ...updates, emailVerified: false, emailVerificationCode: code }

        const message = {
          personalizations: [
            {
              to: {
                email: req.body.email,
                name: `${req.body.firstName} ${req.body.lastName}`,
              },
              dynamic_template_data: {
                first_name: req.body.firstName,
                verification_link: `https://www.plantgeek.co/verify-email/${code}`,
              },
            },
          ],
          from: { email: ADMIN_EMAIL, name: 'plantgeek' },
          template_id: NEW_EMAIL_VERIFICATION_TEMPLATE_ID,
        }

        await sgMail.send(message).catch(err => console.error(err))
      }

      const update = {
        $set: updates,
      }
      const result = await User.updateOne(filter, update)
      return res.status(200).json({ data: result })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const updateLists = async (req: Request, res: Response) => {
  const { userId } = req.params
  const { plantId, hearts, owned, wanted, plantCollection, plantWishlist } = req.body

  try {
    // update user's collection and wishlist (lists of plantIds)
    const userUpdate = await User.updateOne(
      { _id: ObjectId(userId) },
      {
        $set: {
          plantCollection,
          plantWishlist,
        },
      }
    )

    // update lists of userIds in hearts, owned, and wanted on plant to be able to sort by most liked/owned/wanted and show totals on profile
    const plantUpdate = await Plant.updateOne(
      { _id: ObjectId(plantId) },
      {
        $set: {
          hearts,
          owned,
          wanted,
        },
      }
    )

    return res.status(200).json({ data: { userUpdate, plantUpdate } })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const result = await User.deleteOne({ _id: ObjectId(id) })
    await Plant.updateMany(
      {},
      {
        $pull: {
          hearts: ObjectId(id),
          owned: ObjectId(id),
          wanted: ObjectId(id),
        },
      }
    )
    return res.status(200).json({ data: result })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

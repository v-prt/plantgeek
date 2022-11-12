import { Response, Request } from 'express'
const mongodb = require('mongodb')
const { MongoClient, ObjectId } = mongodb
import assert from 'assert'
import * as dotenv from 'dotenv'
dotenv.config()
const MONGO_URI = process.env.MONGO_URI
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

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

// (CREATE/POST) ADDS A NEW USER
export const createUser = async (req: Request, res: Response) => {
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')

  try {
    const hashedPwd = await bcrypt.hash(req.body.password, saltRounds)
    const existingEmail = await db.collection('users').findOne({
      email: { $regex: new RegExp(`^${req.body.email}$`, 'i') },
    })
    const existingUsername = await db.collection('users').findOne({
      username: { $regex: new RegExp(`^${req.body.username}$`, 'i') },
    })

    if (existingEmail) {
      res.status(409).json({ status: 409, message: 'That email is already in use' })
    } else if (existingUsername) {
      res.status(409).json({ status: 409, message: 'That username is taken' })
    } else {
      const code = crypto.randomBytes(20).toString('hex')

      const user = await db.collection('users').insertOne({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password: hashedPwd,
        joined: new Date(),
        friends: [],
        collection: [],
        wishlist: [],
        verificationCode: code,
      })
      assert.strictEqual(1, user.insertedCount)

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

      res.status(201).json({
        status: 201,
        data: user,
        token: jwt.sign({ userId: user.insertedId }, process.env.TOKEN_SECRET, {
          expiresIn: '7d',
        }),
      })
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ status: 500, data: req.body, message: err.message })
      console.error(err.stack)
    }
  }
  client.close()
}

export const resendVerificationEmail = async (req: Request, res: Response) => {
  const { userId } = req.params
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')

  try {
    const code = crypto.randomBytes(20).toString('hex')

    await db
      .collection('users')
      .updateOne({ _id: ObjectId(userId) }, { $set: { verificationCode: code } })

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

    res.status(200).json({ status: 200, message: 'Email sent' })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      return res.status(500).send('Internal server error')
    }
  }
  client.close()
}

// (READ/POST) AUTHENTICATES USER WHEN LOGGING IN
export const authenticateUser = async (req: Request, res: Response) => {
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  try {
    const db = client.db('plantgeekdb')
    const user = await db.collection('users').findOne(
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
        // FIXME: remove "returns" and put 1 client.close() at end of function
        client.close()
        return res.status(200).json({
          // TODO: look into how "expiresIn" works, remove from local storage if expired
          token: jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: '7d' }),
          data: user,
        })
      } else {
        client.close()
        return res.status(403).json({ message: 'Incorrect password' })
      }
    } else {
      client.close()
      // FIXME: 404
      return res.status(401).json({ message: 'User not found' })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      return res.status(500).send('Internal server error')
    }
  }
}

// (READ/POST) VERIFIES JWT TOKEN
export const verifyToken = async (req: Request, res: Response) => {
  const client = await MongoClient(MONGO_URI, options)
  try {
    await client.connect()
    const db = client.db('plantgeekdb')
    const verifiedToken = jwt.verify(req.body.token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return false
      } else {
        return decoded.userId
      }
    })
    if (verifiedToken) {
      try {
        const user = await db.collection('users').findOne({
          _id: ObjectId(verifiedToken),
        })
        if (user) {
          res.status(200).json({ status: 200, user: user })
        } else {
          res.status(404).json({ status: 404, message: 'User not found' })
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.stack)
          res.status(500).json({ status: 500, message: err.message })
        }
      }
    } else {
      res.status(400).json({ status: 400, message: `Token couldn't be verified` })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      res.status(500).json({ status: 500, message: err.message })
    }
  }
  client.close()
}

export const verifyEmail = async (req: Request, res: Response) => {
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')
  const { code } = req.params
  const { userId } = req.body

  try {
    const user = await db.collection('users').findOne({
      _id: ObjectId(userId),
    })

    if (user) {
      if (user.verificationCode === code) {
        await db
          .collection('users')
          .updateOne(
            { _id: ObjectId(userId) },
            { $set: { emailVerified: true, verificationCode: null } }
          )
        res.status(200).json({ status: 200, message: 'Email verified' })
      } else {
        res.status(400).json({ status: 400, message: 'Invalid verification link' })
      }
    } else {
      res.status(404).json({ status: 404, message: 'User not found' })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      res.status(500).json({ status: 500, message: err.message })
    }
  }
  client.close()
}

export const sendPasswordResetCode = async (req: Request, res: Response) => {
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')
  const { email } = req.body
  try {
    const user = await db.collection('users').findOne({ email })
    if (user) {
      const code = Math.floor(100000 + Math.random() * 900000)
      const hashedCode = await bcrypt.hash(code.toString(), saltRounds)

      await db.collection('users').updateOne({ email }, { $set: { passwordResetCode: hashedCode } })

      const msg = {
        to: email,
        from: ADMIN_EMAIL,
        subject: 'Recover password on plantgeek',
        text: `Your password reset code is: ${code}`,
        html: `Your password reset code is: <strong>${code}</strong>`,
      }

      sgMail
        .send(msg)
        .then(() => {
          res.status(200).json({ message: 'Code sent' })
        })
        .catch(error => {
          console.error(error)
        })
    } else {
      res.status(404).json({ message: 'Email not found' })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      return res.status(500).send('Internal server error')
    }
  }
  client.close()
}

// RESET PASSWORD WITH CODE
export const resetPassword = async (req: Request, res: Response) => {
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')

  const { email, code, newPassword } = req.body

  try {
    const user = await db.collection('users').findOne({ email })
    if (user) {
      const isValid = await bcrypt.compare(code.toString(), user.passwordResetCode)
      if (isValid) {
        const hashedPwd = await bcrypt.hash(newPassword, saltRounds)
        await db
          .collection('users')
          .updateOne({ email }, { $set: { password: hashedPwd, passwordResetCode: null } })
        res.status(200).json({ message: 'Password changed' })
      } else {
        res.status(403).json({ message: 'Incorrect code' })
      }
    } else {
      res.status(404).json({ message: 'Email not found' })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      return res.status(500).send('Internal server error')
    }
  }

  client.close()
}

// (READ/GET) GETS ALL USERS
export const getUsers = async (req: Request, res: Response) => {
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')
  try {
    const users = await db.collection('users').find().toArray()
    if (users) {
      res.status(200).json({ status: 200, data: users })
    } else {
      res.status(404).json({ status: 404, message: 'No users found' })
    }
  } catch (err) {
    console.error(err)
  }
  client.close()
}

// (READ/GET) GETS USER BY ID
export const getUser = async (req: Request, res: Response) => {
  if (req.params.id === 'undefined') {
    return null
  } else {
    const client = await MongoClient(MONGO_URI, options)
    await client.connect()
    const db = client.db('plantgeekdb')
    try {
      const user = await db.collection('users').findOne({ _id: ObjectId(req.params.id) })
      if (user) {
        res.status(200).json({ status: 200, user: user })
      } else {
        res.status(404).json({ status: 404, message: 'User not found' })
      }
    } catch (err) {
      console.error('Error getting user', err)
    }
    client.close()
  }
}

export const getWishlist = async (req: Request, res: Response) => {
  const { userId } = req.params
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')
  try {
    const user = await db.collection('users').findOne({ _id: ObjectId(userId) })
    // convert ids in user.wishlist to objectids
    const ids = user.wishlist?.map(id => ObjectId(id))

    const wishlist = await db
      .collection('plants')
      .find({ _id: { $in: ids } })
      .toArray()

    res.status(200).json({ status: 200, wishlist })
  } catch (err) {
    console.error('Error getting wishlist', err)
    res.status(500).json({ status: 500, message: 'Internal server error' })
  }
  client.close()
}

export const getCollection = async (req: Request, res: Response) => {
  const { userId } = req.params
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')
  try {
    const user = await db.collection('users').findOne({ _id: ObjectId(userId) })
    // convert ids in user.wishlist to objectids
    const ids = user.collection?.map(id => ObjectId(id))

    const collection = await db
      .collection('plants')
      .find({ _id: { $in: ids } })
      .toArray()

    res.status(200).json({ status: 200, collection })
  } catch (err) {
    console.error('Error getting collection', err)
    res.status(500).json({ status: 500, message: 'Internal server error' })
  }
  client.close()
}

export const updateUser = async (req: Request, res: Response) => {
  const userId = ObjectId(req.params.id)
  const { email, username, currentPassword, newPassword } = req.body
  const client = await MongoClient(MONGO_URI, options)

  try {
    await client.connect()
    const db = client.db('plantgeekdb')
    const filter = { _id: userId }
    const user = await db.collection('users').findOne({ _id: userId })

    let updates = {}

    if (newPassword) {
      const hashedPwd = await bcrypt.hash(newPassword, user.password)
      const passwordValid = await bcrypt.compare(currentPassword, user.password)
      if (!passwordValid) {
        return res.status(400).json({ message: 'Incorrect password' })
      } else {
        updates = { password: hashedPwd }
      }
    } else {
      updates = req.body
    }

    const existingEmail = await db.collection('users').findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') },
    })
    const existingUsername = await db.collection('users').findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') },
    })

    if (existingEmail && !existingEmail._id.equals(userId)) {
      return res.status(400).json({ message: 'That email is already in use' })
    } else if (existingUsername && !existingUsername._id.equals(userId)) {
      return res.status(400).json({ message: 'That username is taken' })
    } else {
      // check if email is being updated, if so set emailVerified to false and send new verification email
      if (email !== user.email) {
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
      const result = await db.collection('users').updateOne(filter, update)
      res.status(200).json({ status: 200, data: result })
    }
  } catch (err) {
    console.error(err)
    return res.status(400).json(err)
  }

  client.close()
}

export const updateLists = async (req: Request, res: Response) => {
  const { userId } = req.params
  const { plantId, hearts, owned, wanted, collection, wishlist } = req.body

  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')

  try {
    // update user's collection and wishlist (lists of plantIds)
    const userUpdate = await db.collection('users').updateOne(
      { _id: ObjectId(userId) },
      {
        $set: {
          collection,
          wishlist,
        },
      }
    )

    // update lists of userIds in hearts, owned, and wanted on plant to be able to sort by most liked/owned/wanted and show totals on profile
    const plantUpdate = await db.collection('plants').updateOne(
      { _id: ObjectId(plantId) },
      {
        $set: {
          hearts,
          owned,
          wanted,
        },
      }
    )

    res.status(200).json({ status: 200, data: { userUpdate, plantUpdate } })
  } catch (err) {
    console.error(err)
    return res.status(400).json(err)
  }
}

// (DELETE) REMOVE A USER
// TODO: remove from other users' friends
export const deleteUser = async (req: Request, res: Response) => {
  const client = await MongoClient(MONGO_URI, options)
  const { id } = req.params
  await client.connect()
  const db = client.db('plantgeekdb')
  try {
    const filter = { _id: ObjectId(id) }
    const result = await db.collection('users').deleteOne(filter)
    // find and remove user's id from plants' hearts
    await db.collection('plants').updateMany(
      {},
      {
        $pull: {
          hearts: id,
          owned: id,
          wanted: id,
        },
      }
    )
    res.status(200).json({ status: 200, data: result })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      res.status(500).json({ status: 500, data: req.body, message: err.message })
    }
  }
  client.close()
}

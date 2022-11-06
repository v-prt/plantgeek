const { MongoClient, ObjectId } = require('mongodb')
const assert = require('assert')
require('dotenv').config()
const MONGO_URI = process.env.MONGO_URI
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

// (CREATE/POST) ADDS A NEW USER
const createUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  try {
    await client.connect()
    const db = client.db('plantgeekdb')
    const hashedPwd = await bcrypt.hash(req.body.password, saltRounds)
    const existingEmail = await db.collection('users').findOne({
      email: { $regex: new RegExp(`^${req.body.email}$`, 'i') },
    })
    const existingUsername = await db.collection('users').findOne({
      username: { $regex: new RegExp(`^${req.body.username}$`, 'i') },
    })
    if (existingEmail) {
      res.status(409).json({ status: 409, message: 'Email already registered' })
    } else if (existingUsername) {
      res.status(409).json({ status: 409, message: 'Username taken' })
    } else {
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
      })
      assert.strictEqual(1, user.insertedCount)
      res.status(201).json({
        status: 201,
        data: user,
        token: jwt.sign({ userId: user.insertedId }, process.env.TOKEN_SECRET, { expiresIn: '7d' }),
      })
    }
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message })
    console.error(err.stack)
  }
  client.close()
}

// (READ/POST) AUTHENTICATES USER WHEN LOGGING IN
const authenticateUser = async (req, res) => {
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
    console.error(err.stack)
    return res.status(500).send('Internal server error')
  }
}

// (READ/POST) VERIFIES JWT TOKEN
const verifyToken = async (req, res) => {
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
        console.error(err.stack)
        res.status(500).json({ status: 500, message: err.message })
      }
    } else {
      res.status(400).json({ status: 400, message: `Token couldn't be verified` })
    }
  } catch (err) {
    console.error(err.stack)
    res.status(500).json({ status: 500, message: err.message })
  }
  client.close()
}

const sendPasswordResetCode = async (req, res) => {
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
        subject: 'Plantgeek Password Recovery',
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
    console.error(err.stack)
    return res.status(500).send('Internal server error')
  }
  client.close()
}

// RESET PASSWORD WITH CODE
const resetPassword = async (req, res) => {
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
    console.error(err.stack)
    return res.status(500).send('Internal server error')
  }

  client.close()
}

// (READ/GET) GETS ALL USERS
const getUsers = async (req, res) => {
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
const getUser = async (req, res) => {
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

const getWishlist = async (req, res) => {
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

const getCollection = async (req, res) => {
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

const updateUser = async (req, res) => {
  const userId = ObjectId(req.params.id)
  const { firstName, lastName, email, username, currentPassword, newPassword } = req.body
  const client = await MongoClient(MONGO_URI, options)
  try {
    await client.connect()
    const db = client.db('plantgeekdb')
    const filter = { _id: userId }
    const user = await db.collection('users').findOne({ _id: userId })
    // FIXME: can probably make this simpler
    let update = {}
    if (newPassword) {
      const hashedPwd = await bcrypt.hash(newPassword, user.password)
      const passwordValid = await bcrypt.compare(currentPassword, user.password)
      if (!passwordValid) {
        res.status(400).json({ code: 'incorrect_password', msg: 'Password is incorrect' })
      } else {
        update = {
          $set: {
            password: hashedPwd,
          },
        }
      }
    } else
      update = {
        $set: {
          firstName,
          lastName,
          email,
          username,
        },
      }
    const existingEmail = await db.collection('users').findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') },
    })
    const existingUsername = await db.collection('users').findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') },
    })
    if (existingEmail && !existingEmail._id.equals(userId)) {
      res.status(400).json({ code: 'email_taken', msg: 'Email already in use' })
    } else if (existingUsername && !existingUsername._id.equals(userId)) {
      res.status(400).json({ code: 'username_taken', msg: 'Username already in use' })
    } else {
      const result = await db.collection('users').updateOne(filter, update)
      res.status(200).json({ status: 200, data: result })
    }
  } catch (err) {
    console.error(err)
    return res.status(400).json(err)
  }
  client.close()
}

const updateLists = async (req, res) => {
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

    // update lists of userIds in hearts, owned, and wanted on plant to be able to sort by most liked/owned/wanted
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
const deleteUser = async (req, res) => {
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
    console.error(err)
    res.status(500).json({ status: 500, data: req.body, message: err.message })
  }
  client.close()
}

module.exports = {
  createUser,
  authenticateUser,
  verifyToken,
  sendPasswordResetCode,
  resetPassword,
  getUsers,
  getUser,
  getWishlist,
  getCollection,
  updateUser,
  updateLists,
  deleteUser,
}

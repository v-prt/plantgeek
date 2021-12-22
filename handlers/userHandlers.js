const { MongoClient, ObjectId } = require('mongodb')
const assert = require('assert')
require('dotenv').config()
const MONGO_URI = process.env.MONGO_URI
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

// (CREATE/POST) ADD A NEW USER TO DATABASE
const createUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  try {
    await client.connect()
    const db = client.db('plantgeekdb')
    const hashedPwd = await bcrypt.hash(req.body.password, saltRounds)
    const existingEmail = await db.collection('users').findOne({
      email: req.body.email,
    })
    const existingUsername = await db.collection('users').findOne({
      lowerCaseUsername: req.body.username.toLowerCase(),
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
        lowerCaseUsername: req.body.username.toLowerCase(),
        password: hashedPwd,
        joined: new Date(),
        friends: [],
        collection: [],
        favorites: [],
        wishlist: [],
      })
      assert.strictEqual(1, user.insertedCount)
      res.status(201).json({ status: 201, data: user })
    }
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message })
    console.log(err.stack)
  }
  client.close()
}

// (READ/POST) LOGIN - AUTHENTICATE USER
const authenticateUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  try {
    await client.connect()
    const db = client.db('plantgeekdb')
    const user = await db
      .collection('users')
      .findOne({ lowerCaseUsername: req.body.username.toLowerCase() })
    if (user) {
      const isValid = await bcrypt.compare(req.body.password, user.password)
      if (isValid) {
        res.status(200).json({
          status: 200,
          // TODO: look into how "expiresIn" works, remove from local storage if expired
          token: jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: '7d' }),
          data: user,
        })
      } else {
        res.status(403).json({ status: 403, message: 'Incorrect password' })
      }
    } else {
      res.status(401).json({ status: 401, message: 'Username not found' })
    }
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal server error')
  }
  client.close()
}

// (READ/POST) VERIFY USER BY JWT TOKEN
const verifyUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')
  const verifiedUserId = jwt.verify(
    req.body.token,
    process.env.TOKEN_SECRET,
    function (err, decoded) {
      if (err) {
        return err
      } else {
        return decoded.userId
      }
    }
  )
  if (verifiedUserId) {
    const user = await db.collection('users').findOne({
      _id: ObjectId(verifiedUserId),
    })
    if (user) {
      res.status(200).json({ status: 200, data: user })
    } else {
      res.status(404).json({ status: 404, message: 'User not found' })
    }
  } else {
    console.log("User ID couldn't be verified")
  }
  client.close()
}

// (READ/GET) GETS USER BY USERNAME
const getUserByUsername = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')
  const user = await db.collection('users').findOne({
    username: req.params.username,
  })
  if (user) {
    res.status(200).json({ status: 200, data: user })
  } else {
    res.status(404).json({ status: 404, message: 'User not found' })
  }
  client.close()
}

// (READ/GET) GETS ALL USERS IN DATABASE
const getUsers = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')
  const users = await db.collection('users').find().toArray()
  if (users) {
    res.status(200).json({ status: 200, data: users })
  } else {
    res.status(404).json({ status: 404, message: 'Oops, nothing here!' })
  }
  client.close()
}

// (UPDATE/PUT) ADD A PLANT, FRIEND, OR IMAGE TO USER'S PROFILE
const addToUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  const username = req.params.username
  try {
    await client.connect()
    const db = client.db('plantgeekdb')
    const users = db.collection('users')
    const filter = { username: username }
    let update = undefined
    if (req.body.collection) {
      update = {
        $push: {
          collection: req.body.collection,
        },
      }
    } else if (req.body.favorites) {
      update = {
        $push: {
          favorites: req.body.favorites,
        },
      }
    } else if (req.body.wishlist) {
      update = {
        $push: {
          wishlist: req.body.wishlist,
        },
      }
    } else if (req.body.friends) {
      update = {
        $push: {
          friends: req.body.friends,
        },
      }
    } else if (req.body.image) {
      update = {
        $push: {
          image: req.body.image,
        },
      }
    }
    const result = await users.updateOne(filter, update)
    res.status(200).json({
      status: 200,
      message: `${result.matchedCount} user(s) matched the filter, updated ${result.modifiedCount} user(s)`,
    })
    console.log(
      `${result.matchedCount} user(s) matched the filter, updated ${result.modifiedCount} user(s)`
    )
  } catch (err) {
    res.status(404).json({ status: 404, message: err.message })
  }
  client.close()
}

// (UPDATE/PUT) REMOVE A PLANT, FRIEND, OR IMAGE FROM USER'S PROFILE
const removeFromUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  const username = req.params.username
  try {
    await client.connect()
    const db = client.db('plantgeekdb')
    const users = db.collection('users')
    const filter = { username: username }
    let update = undefined
    if (req.body.collection) {
      update = {
        $pull: {
          collection: req.body.collection,
        },
      }
    } else if (req.body.favorites) {
      update = {
        $pull: {
          favorites: req.body.favorites,
        },
      }
    } else if (req.body.wishlist) {
      update = {
        $pull: {
          wishlist: req.body.wishlist,
        },
      }
    } else if (req.body.friends) {
      update = {
        $pull: {
          friends: req.body.friends,
        },
      }
    } else if (req.body.image) {
      update = {
        $pull: {
          image: req.body.image,
        },
      }
    }
    const result = await users.updateOne(filter, update)
    res.status(200).json({
      status: 200,
      message: `${result.matchedCount} user(s) matched the filter, updated ${result.modifiedCount} user(s)`,
    })
    console.log(
      `${result.matchedCount} user(s) matched the filter, updated ${result.modifiedCount} user(s)`
    )
  } catch (err) {
    res.status(404).json({ status: 404, message: err.message })
  }
  client.close()
}

// TODO: (DELETE) REMOVE A USER FROM DB

module.exports = {
  createUser,
  authenticateUser,
  verifyUser,
  getUserByUsername,
  getUsers,
  addToUser,
  removeFromUser,
}

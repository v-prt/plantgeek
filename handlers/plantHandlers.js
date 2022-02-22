const { MongoClient, ObjectId } = require('mongodb')
const assert = require('assert')
require('dotenv').config()
const MONGO_URI = process.env.MONGO_URI

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

// (CREATE/POST) ADDS A NEW PLANT
const createPlant = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  try {
    await client.connect()
    const db = client.db('plantgeekdb')
    const plant = await db.collection('plants').insertOne(req.body)
    assert.strictEqual(1, plant.insertedCount)
    res.status(201).json({ status: 201, data: plant })
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message })
    console.error(err.stack)
  }
  client.close()
}

// (READ/GET) GETS ALL PLANTS
const getPlants = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')
  const plants = await db.collection('plants').find().toArray()
  if (plants) {
    res.status(200).json({ status: 200, data: plants })
  } else {
    res.status(404).json({ status: 404, message: 'No plants found' })
  }
  client.close()
}

// (READ/GET) GETS PLANT BY ID
const getPlant = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  const _id = req.params._id
  await client.connect()
  const db = client.db('plantgeekdb')
  const plant = await db.collection('plants').findOne({ _id: ObjectId(_id) })
  if (plant) {
    res.status(200).json({ status: 200, data: plant })
  } else {
    res.status(404).json({ status: 404, message: 'Plant not found' })
  }
  client.close()
}

// (UPDATE/PUT) ADDS COMMENT TO A PLANT BY ID
const addComment = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  const _id = req.params._id
  try {
    await client.connect()
    const db = client.db('plantgeekdb')
    const plants = db.collection('plants')
    const filter = { _id: ObjectId(_id) }
    let update = undefined
    if (req.body.comments) {
      update = {
        $push: {
          comments: req.body.comments,
        },
      }
    }
    const result = await plants.updateOne(filter, update)
    res.status(200).json({
      status: 200,
      message: `${result.matchedCount} plant(s) matched the filter, updated ${result.modifiedCount} plant(s)`,
    })
  } catch (err) {
    res.status(404).json({ status: 404, message: err.message })
    console.error(err.stack)
  }
  client.close()
}

const updatePlant = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  const _id = req.params._id
  try {
    await client.connect()
    const db = client.db('plantgeekdb')
    const filter = { _id: ObjectId(_id) }
    const update = {
      $set: {
        primaryName: req.body.primaryName,
        secondaryName: req.body.secondaryName,
        light: req.body.light,
        water: req.body.water,
        temperature: req.body.temperature,
        humidity: req.body.humidity,
        toxic: req.body.toxic,
        imageUrl: req.body.imageUrl,
        sourceUrl: req.body.sourceUrl,
      },
    }
    const result = await db.collection('plants').updateOne(filter, update)
    res.status(200).json({ status: 200, data: result })
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message })
    console.error(err)
  }
}

// TODO: will need to remove from users' lists or add a check in case plant data is missing
const deletePlant = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  const _id = req.params._id
  try {
    await client.connect()
    const db = client.db('plantgeekdb')
    const filter = { _id: ObjectId(_id) }
    const result = await db.collection('plants').deleteOne(filter)
    res.status(200).json({ status: 200, data: result })
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message })
    console.error(err)
  }
}

module.exports = { createPlant, getPlants, getPlant, addComment, updatePlant, deletePlant }

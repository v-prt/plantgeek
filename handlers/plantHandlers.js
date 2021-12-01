const { MongoClient, ObjectId } = require('mongodb')
const assert = require('assert')
require('dotenv').config()
const MONGO_URI = process.env.MONGO_URI

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

// (CREATE/POST) ADD A NEW PLANT TO DB
// TODO: make sure this works
const createPlant = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  try {
    await client.connect()
    const db = client.db('plantgeekdb')
    const plant = await db.collection('plants').insertOne({
      species: req.body.species,
      genus: req.body.genus,
      light: req.body.light,
      water: req.body.water,
      temperature: req.body.temperature,
      humidity: req.body.humidity,
      toxic: req.body.toxic,
      imageUrl: req.body.imageUrl,
      sourceUrl: req.body.sourceUrl,
    })
    assert.strictEqual(1, plant.insertedCount)
    res.status(201).json({ status: 201, data: plant })
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message })
    console.log(err.stack)
  }
  client.close()
}

// GETS ALL PLANTS IN DATABASE
const getPlants = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')
  const plants = await db.collection('plants').find().toArray()
  if (plants) {
    res.status(200).json({ status: 200, data: plants })
  } else {
    res.status(404).json({ status: 404, message: 'Oops, nothing here!' })
  }
  client.close()
}

// GETS PLANT BY ID FROM DATABASE
const getPlant = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  const _id = req.params._id
  await client.connect()
  const db = client.db('plantgeekdb')
  const plant = await db.collection('plants').findOne({ _id: ObjectId(_id) })
  if (plant) {
    res.status(200).json({ status: 200, data: plant })
  } else {
    res.status(404).json({ status: 404, message: 'Oops, nothing here!' })
  }
  client.close()
}

// GETS PLANT BY ID & POSTS NEW COMMENT
const postComment = async (req, res) => {
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
    console.log(
      `${result.matchedCount} plant(s) matched the filter, updated ${result.modifiedCount} plant(s)`
    )
  } catch (err) {
    res.status(404).json({ status: 404, message: err.message })
  }
  client.close()
}

module.exports = { createPlant, getPlants, getPlant, postComment }

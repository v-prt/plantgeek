import mongodb from 'mongodb'
const { MongoClient, ObjectId } = mongodb
import * as dotenv from 'dotenv'
dotenv.config()
const MONGO_URI = process.env.MONGO_URI

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

export const createSuggestion = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')
  const { suggestion, sourceUrl, userId } = req.body
  const plantId = req.params.plantId

  const data = {
    plantId,
    userId,
    suggestion,
    sourceUrl,
    dateSubmitted: new Date(),
    status: 'pending',
  }

  try {
    const result = await db.collection('suggestions').insertOne(data)
    res.status(201).json({ status: 201, data: result })
  } catch (err) {
    console.error(err)
    res.status(500).json({ status: 500, data: req.body, message: err.message })
  }
  client.close()
}

export const getSuggestions = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')

  try {
    const suggestions = await db.collection('suggestions').find().toArray()

    const result = await Promise.all(
      suggestions.map(async suggestion => {
        const plant = await db.collection('plants').findOne({ _id: ObjectId(suggestion.plantId) })
        const user = await db.collection('users').findOne({ _id: ObjectId(suggestion.userId) })
        return { ...suggestion, plant, user }
      })
    )
    res.status(200).json({ status: 200, suggestions: result })
  } catch (err) {
    console.error(err)
    res.status(500).json({ status: 500, data: req.body, message: err.message })
  }
  client.close()
}

export const getSuggestionsBySlug = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')
  const { slug } = req.params

  try {
    const plant = await db.collection('plants').findOne({ slug })
    const plantSuggestions = await db
      .collection('suggestions')
      .find({ plantId: plant._id.toString() })
      .toArray()
    // find user by userId in each suggestion and include in response
    const result = await Promise.all(
      plantSuggestions.map(async suggestion => {
        const user = await db.collection('users').findOne({ _id: ObjectId(suggestion.userId) })
        return { ...suggestion, user }
      })
    )
    res.status(200).json({ status: 200, suggestions: result })
  } catch (err) {
    console.error(err)
    res.status(500).json({ status: 500, data: req.body, message: err.message })
  }
  client.close()
}

export const updateSuggestion = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')
  const id = req.params.id
  try {
    const filter = { _id: ObjectId(id) }
    const update = {
      $set: req.body,
    }
    const result = await db.collection('suggestions').updateOne(filter, update)
    console.log(result)
    res.status(200).json({ status: 200, data: result })
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message })
    console.error(err)
  }
  client.close()
}

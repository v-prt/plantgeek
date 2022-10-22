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
    const regex = new RegExp(req.body.primaryName, 'i') // "i" for case insensitive
    const existingPlant = await db.collection('plants').findOne({ primaryName: { $regex: regex } })
    if (existingPlant) {
      res.status(409).json({ status: 409, message: 'Plant already exists' })
    } else {
      const plant = await db.collection('plants').insertOne(req.body)
      res.status(201).json({ status: 201, plant: plant.ops[0] })
    }
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message })
    console.error(err.stack)
  }
  client.close()
}

// (READ/GET) GETS ALL PLANTS
const getPlants = async (req, res) => {
  const { toxic, review, search, sort } = req.query
  // dont'include any plants which are pending review or rejected
  let filters = { review: { $ne: 'pending' }, review: { $ne: 'rejected' } }

  if (toxic === 'true') {
    filters = { ...filters, toxic: true }
  } else if (toxic === 'false') {
    filters = { ...filters, toxic: false }
  }
  if (search) {
    const regex = new RegExp(search, 'i') // "i" for case insensitive
    filters = {
      ...filters,
      $or: [{ primaryName: { $regex: regex } }, { secondaryName: { $regex: regex } }],
    }
  }
  if (review) {
    filters = {
      ...filters,
      review: 'pending',
    }
  }
  let order
  if (sort) {
    if (sort === 'name-asc') {
      order = { primaryName: 1 }
    } else if (sort === 'name-desc') {
      order = { primaryName: -1 }
    }
  }
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')
  try {
    // pagination
    const page = req.params.page ? parseInt(req.params.page) : 1
    const resultsPerPage = 24

    const plants = await db
      .collection('plants')
      .find(filters)
      .sort(order)
      .collation({ locale: 'en' })
      .skip(resultsPerPage * (page - 1))
      .limit(resultsPerPage)
      .toArray()

    const totalResults = await db.collection('plants').countDocuments(filters)

    if (plants) {
      res.status(200).json({
        plants: plants,
        page: page,
        totalResults,
        nextCursor: totalResults > 24 * page ? page + 1 : null,
      })
    } else {
      res.status(404).json({ status: 404, message: 'No plants found' })
    }
  } catch (err) {
    console.error(err)
  }

  client.close()
}

const getPlantsToReview = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')
  try {
    const plants = await db.collection('plants').find({ review: 'pending' }).toArray()
    if (plants) {
      res.status(200).json({ status: 200, plants: plants })
    } else {
      res.status(404).json({ status: 404, message: 'No plants found' })
    }
  } catch (err) {
    console.error(err)
  }
}

// (READ/GET) GETS PLANT BY ID
const getPlant = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  const _id = req.params._id
  await client.connect()
  const db = client.db('plantgeekdb')
  try {
    const plant = await db.collection('plants').findOne({ _id: ObjectId(_id) })
    if (plant) {
      res.status(200).json({ status: 200, plant: plant })
    } else {
      res.status(404).json({ status: 404, message: 'Plant not found' })
    }
  } catch (err) {
    console.error(err)
  }
  client.close()
}

const getRandomPlants = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')
  try {
    const plants = await db
      .collection('plants')
      .aggregate([{ $sample: { size: 12 } }])
      .toArray()
    if (plants) {
      res.status(200).json({ status: 200, plants: plants })
    } else {
      res.status(404).json({ status: 404, message: 'No plants found' })
    }
  } catch (err) {
    console.error(err)
  }
  client.close()
}

const getUserPlants = async (req, res) => {
  const { ids } = req.query
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')
  try {
    if (ids && ids.length > 0) {
      const objectIds = ids.map(id => ObjectId(id))
      const plants = await db
        .collection('plants')
        .find({ _id: { $in: objectIds } })
        .toArray()
      if (plants) {
        res.status(200).json({ status: 200, plants: plants })
      } else {
        res.status(404).json({ status: 404, message: 'No plants found' })
      }
    } else {
      console.log('no ids')
      res.status(404).json({ status: 404, message: 'No plants in list' })
    }
  } catch (err) {
    console.error(err)
  }
  client.close()
}

const getUserContributions = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')
  try {
    const contributions = await db
      .collection('plants')
      .find({ contributorId: req.params.userId })
      .toArray()
    if (contributions) {
      res.status(200).json({ status: 200, contributions: contributions })
    } else {
      res.status(404).json({ status: 404, message: 'No contributions found' })
    }
  } catch (err) {
    console.error(err)
  }
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
      $set: req.body,
    }
    const result = await db.collection('plants').updateOne(filter, update)
    res.status(200).json({ status: 200, data: result })
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message })
    console.error(err)
  }
  client.close()
}

// TODO: will need to remove from users' lists or add a check in case plant data is missing
const deletePlant = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  const _id = req.params._id
  await client.connect()
  const db = client.db('plantgeekdb')
  try {
    const filter = { _id: ObjectId(_id) }
    const result = await db.collection('plants').deleteOne(filter)
    res.status(200).json({ status: 200, data: result })
  } catch (err) {
    console.error(err)
    res.status(500).json({ status: 500, data: req.body, message: err.message })
  }
  client.close()
}

// taking all plants and saving images to cloudinary, then updating the plant with the cloudinary image url
const uploadToCloudinary = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('plantgeekdb')

  try {
    const plants = await db.collection('plants').find().toArray()

    if (plants) {
      const cloudinary = require('cloudinary').v2
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
      })

      const promises = plants.map(async plant => {
        // skipping plants where images are broken
        if (plant.imageUrl.includes('broken')) return
        try {
          const url = `${plant.imageUrl}`
          const result = await cloudinary.uploader.upload(url, {
            // moving to different folder
            folder: 'plantgeek-plants',
          })
          // updating plant with new image url
          const filter = { _id: ObjectId(plant._id) }
          const update = {
            $set: {
              imageUrl: result.secure_url,
            },
          }
          const result2 = await db.collection('plants').updateOne(filter, update)
          console.log(result2)
        } catch (err) {
          console.error(err)
        }
      })
      await Promise.all(promises)
      res.status(200).json({ status: 200, message: 'done' })
    } else {
      res.status(404).json({ status: 404, message: 'No plants found' })
    }
  } catch (err) {
    console.error(err)
  }
  client.close()
}

module.exports = {
  createPlant,
  getPlants,
  getPlantsToReview,
  getPlant,
  getRandomPlants,
  getUserPlants,
  getUserContributions,
  addComment,
  updatePlant,
  uploadToCloudinary,
  deletePlant,
}

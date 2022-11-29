import { Response, Request } from 'express'
import { IPlant } from '../Interfaces'
import { Plant, User } from '../Models'
const mongodb = require('mongodb')
const { MongoClient, ObjectId } = mongodb
import * as dotenv from 'dotenv'
dotenv.config()
const MONGO_URI = process.env.MONGO_URI

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

// (CREATE/POST) ADDS A NEW PLANT
export const createPlant = async (req: Request, res: Response) => {
  try {
    const { primaryName } = req.body

    const nameTaken = await Plant.findOne({
      primaryName: {
        // exact match, case insensitive
        $regex: new RegExp(`^${primaryName}$`, 'i'),
      },
    })

    if (nameTaken) {
      return res.status(400).json({ message: 'A plant already exists with this name' })
    } else {
      const plant: IPlant = new Plant(req.body)
      const newPlant: IPlant = await plant.save()
      return res.status(201).json({ message: 'Plant submitted', plant: newPlant })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

// (READ/GET) GETS ALL PLANTS
export const getPlants = async (req: Request, res: Response) => {
  const { search, sort, light, water, temperature, humidity, toxicity, climate, rarity, review } =
    req.query
  let filters = {}

  if (search && Array.isArray(search)) {
    const regex = search.map(str => new RegExp(str, 'i'))
    filters = {
      ...filters,
      $or: [{ primaryName: { $in: regex } }, { secondaryName: { $in: regex } }],
    }
  }

  if (light) {
    if (light === 'unknown') {
      filters = { ...filters, $or: [{ light: null }, { light: { $exists: false } }] }
    } else {
      filters = {
        ...filters,
        light,
      }
    }
  }

  if (water) {
    if (water === 'unknown') {
      filters = { ...filters, $or: [{ water: null }, { water: { $exists: false } }] }
    } else {
      filters = {
        ...filters,
        water,
      }
    }
  }

  if (temperature) {
    if (temperature === 'unknown') {
      filters = { ...filters, $or: [{ temperature: null }, { temperature: { $exists: false } }] }
    } else {
      filters = {
        ...filters,
        temperature,
      }
    }
  }

  if (humidity) {
    if (humidity === 'unknown') {
      filters = {
        ...filters,
        $or: [{ humidity: null }, { humidity: { $exists: false } }],
      }
    } else {
      filters = {
        ...filters,
        humidity,
      }
    }
  }

  if (toxicity === 'toxic') {
    filters = { ...filters, toxic: true }
  } else if (toxicity === 'nontoxic') {
    filters = { ...filters, toxic: false }
  } else if (toxicity === 'unknown') {
    filters = {
      ...filters,
      $or: [{ toxic: null }, { toxic: { $exists: false } }],
    }
  }

  if (climate) {
    if (climate === 'unknown') {
      filters = { ...filters, $or: [{ climate: null }, { climate: { $exists: false } }] }
    } else {
      filters = {
        ...filters,
        climate,
      }
    }
  }

  if (rarity) {
    if (rarity === 'unknown') {
      filters = { ...filters, $or: [{ rarity: null }, { rarity: { $exists: false } }] }
    } else {
      filters = {
        ...filters,
        rarity,
      }
    }
  }

  if (review) {
    filters = {
      ...filters,
      review,
    }
  } else {
    filters = {
      ...filters,
      $and: [{ review: { $ne: 'pending' } }, { review: { $ne: 'rejected' } }],
    }
  }

  let order
  if (sort) {
    if (sort === 'name-asc') {
      order = { primaryName: 1 }
    } else if (sort === 'name-desc') {
      order = { primaryName: -1 }
    } else if (sort === 'most-hearts') {
      order = {
        hearts: -1,
      }
    } else if (sort === 'most-owned') {
      order = {
        owned: -1,
      }
    } else if (sort === 'most-wanted') {
      order = {
        wanted: -1,
      }
    }
  }

  try {
    // pagination
    const page = req.params.page ? parseInt(req.params.page) : 1
    const resultsPerPage = 24

    const plants: IPlant[] = await Plant.find(filters)
      .sort(order)
      .collation({ locale: 'en' })
      .skip(resultsPerPage * (page - 1))
      .limit(resultsPerPage)
      .lean()

    const totalResults: number = await Plant.countDocuments(filters)

    if (plants) {
      return res.status(200).json({
        plants,
        page,
        totalResults,
        nextCursor: totalResults > resultsPerPage * page ? page + 1 : null,
      })
    } else {
      return res.status(404).json({ message: 'No plants found' })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const getPlantsToReview = async (req: Request, res: Response) => {
  try {
    const plants: IPlant[] = await Plant.find({ review: 'pending' }).lean()
    if (plants) {
      return res.status(200).json({ status: 200, plants: plants })
    } else {
      return res.status(404).json({ status: 404, message: 'No plants found' })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const countPendingPlants = async (req: Request, res: Response) => {
  try {
    const count: number = await Plant.countDocuments({ review: 'pending' })
    return res.status(200).json({ count })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const getPlant = async (req: Request, res: Response) => {
  const { slug } = req.params
  try {
    const plant: IPlant | null = await Plant.findOne({
      slug,
    })
    if (plant) {
      return res.status(200).json({ plant })
    } else {
      return res.status(404).json({ message: 'Plant not found' })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const getSimilarPlants = async (req: Request, res: Response) => {
  const { slug } = req.params

  try {
    const plant: IPlant | null = await Plant.findOne({
      slug,
    })

    if (plant) {
      const regex = plant.primaryName
        // take words from plant's primary name
        .split(' ')
        // remove special characters
        .map(word => word.replace(/[^a-zA-Z ]/g, ''))
        // create case insensitive regex with word boundaries
        .map(word => new RegExp(`\\b${word}\\b`, 'i'))

      let filters = {
        // not this plant
        _id: { $ne: ObjectId(plant._id) },
        primaryName: { $in: regex },
        // not pending or rejected
        $and: [{ review: { $ne: 'pending' } }, { review: { $ne: 'rejected' } }],
      }

      const similarPlants: IPlant[] = await Plant.find(filters).limit(6).lean()

      return res.status(200).json({ similarPlants: similarPlants })
    } else {
      return res.status(404).json({ message: 'Plant not found' })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const getRandomPlants = async (req: Request, res: Response) => {
  try {
    const plants: IPlant[] = await Plant.aggregate([
      { $match: { $and: [{ review: { $ne: 'pending' } }, { review: { $ne: 'rejected' } }] } },
      { $sample: { size: 6 } },
    ])
    if (plants) {
      return res.status(200).json({ plants })
    } else {
      return res.status(404).json({ message: 'No plants found' })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const getContributions = async (req: Request, res: Response) => {
  try {
    const page = req.params.page ? parseInt(req.params.page) : 1
    const resultsPerPage = 10

    const contributions: IPlant[] = await Plant.find({
      contributorId: req.params.userId,
      review: req.query.review,
    })
      .skip(resultsPerPage * (page - 1))
      .limit(resultsPerPage)
      .lean()

    const totalResults: number = await Plant.countDocuments({
      contributorId: req.params.userId,
      review: req.query.review,
    })

    if (contributions) {
      return res.status(200).json({
        contributions,
        page,
        totalResults,
        nextCursor: totalResults > resultsPerPage * page ? page + 1 : null,
      })
    } else {
      return res.status(404).json({ message: 'No contributions found' })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const updatePlant = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    // prevent updating primaryName if already taken (should be unique)
    const { primaryName } = req.body

    if (primaryName) {
      const nameTaken: IPlant | null = await Plant.findOne({
        primaryName: {
          // exact match, case insensitive
          $regex: new RegExp(`^${primaryName}$`, 'i'),
        },
        _id: { $ne: ObjectId(id) },
      })
      if (nameTaken) {
        return res.status(400).json({ message: 'A plant already exists with this name' })
      }
    }

    const filter = { _id: ObjectId(id) }
    const update = {
      $set: req.body,
    }

    await Plant.updateOne(filter, update)
    return res.status(200).json({ message: 'Plant updated' })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const deletePlant = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const result = await Plant.deleteOne({ _id: ObjectId(id) })
    // find and remove plant id from users' collections and wishlists
    await User.updateMany(
      {},
      {
        $pull: {
          plantCollection: ObjectId(id),
          plantWishlist: ObjectId(id),
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

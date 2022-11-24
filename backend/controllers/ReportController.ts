import { Response, Request } from 'express'
import { IReport, IPlant, IUser } from '../Interfaces'
import { Report, Plant, User } from '../Models'
const mongodb = require('mongodb')
const { MongoClient, ObjectId } = mongodb
import * as dotenv from 'dotenv'
dotenv.config()
const MONGO_URI = process.env.MONGO_URI

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

export const createReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Pick<IReport, 'userId' | 'plantId' | 'message' | 'sourceUrl'>

    const report: IReport = new Report({
      userId: body.userId,
      plantId: body.plantId,
      message: body.message,
      sourceUrl: body.sourceUrl,
      status: 'pending',
    })

    const newReport: IReport = await report.save()
    res.status(201).json({ message: 'Report added', data: newReport })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const getReports = async (req: Request, res: Response): Promise<void> => {
  try {
    const reports: IReport[] = await Report.find().lean() // use lean() to get a plain JS object instead of a Mongoose document

    // include plant and user info with report by ids
    const result = await Promise.all(
      reports.map(async report => {
        const plant: IPlant | null = await Plant.findOne({ _id: ObjectId(report.plantId) })
        const user: IUser | null = await User.findOne({ _id: ObjectId(report.userId) })
        return { ...report, plant, user }
      })
    )

    res.status(200).json({ reports: result })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const getPlantReports = async (req: Request, res: Response): Promise<void> => {
  const { plantId } = req.params

  try {
    // get reports by plantId, include user and plant info
    const reports: IReport[] = await Report.find({ plantId }).lean()

    // include plant and user info with report by ids
    const result = await Promise.all(
      reports.map(async report => {
        const plant: IPlant | null = await Plant.findOne({ _id: ObjectId(report.plantId) })
        const user: IUser | null = await User.findOne({ _id: ObjectId(report.userId) })
        return { ...report, plant, user }
      })
    )

    res.status(200).json({ reports: result })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const countPendingReports = async (req: Request, res: Response): Promise<void> => {
  try {
    const count = await Report.countDocuments({ status: 'pending' })
    res.status(200).json({ count })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const updateReportStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reportId } = req.params
    const body = req.body as Pick<IReport, 'status'>

    const updatedReport: IReport | null = await Report.findByIdAndUpdate({ _id: reportId }, body)
    res.status(200).json({ message: 'Report updated', data: updatedReport })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

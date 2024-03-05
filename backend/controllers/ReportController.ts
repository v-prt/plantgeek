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

export const createReport = async (req: Request, res: Response) => {
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
    return res.status(201).json({ message: 'Report added', data: newReport })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const getReports = async (req: Request, res: Response) => {
  try {
    const { sort, status, plantId } = req.query
    const page = req.params.page ? parseInt(req.params.page) : 1
    const resultsPerPage = 10

    let filters = {}
    if (status) {
      filters = { status }
    }
    if (plantId) {
      filters = { ...filters, plantId }
    }

    let order
    if (sort) {
      if (sort === 'date-desc') {
        order = { createdAt: -1 }
      } else if (sort === 'date-asc') {
        order = { createdAt: 1 }
      }
    }

    const reports: IReport[] = await Report.find(filters)
      .sort(order)
      .skip(resultsPerPage * (page - 1))
      .limit(resultsPerPage)
      .lean()

    const totalResults: number = await Report.countDocuments(filters)

    if (reports) {
      // include plant and user info with report by ids
      const result = await Promise.all(
        reports.map(async report => {
          const plant: IPlant | null = await Plant.findOne({ _id: new ObjectId(report.plantId) })
          const user: IUser | null = await User.findOne({ _id: new ObjectId(report.userId) })
          return { ...report, plant, user }
        })
      )

      return res.status(200).json({
        reports: result,
        page,
        totalResults,
        nextCursor: totalResults > resultsPerPage * page ? page + 1 : null,
      })
    } else {
      return res.status(404).json({ message: 'No reports found' })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const countPendingReports = async (req: Request, res: Response) => {
  try {
    const count = await Report.countDocuments({ status: 'pending' })
    return res.status(200).json({ count })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const updateReportStatus = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params
    const body = req.body as Pick<IReport, 'status'>

    const updatedReport: IReport | null = await Report.findByIdAndUpdate({ _id: reportId }, body)
    return res.status(200).json({ message: 'Report updated', data: updatedReport })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

import { Response, Request } from 'express'
import { IReminder } from '../Interfaces'
import { Reminder } from '../Models'

export const createReminder = async (req: Request, res: Response) => {
  const { userId, plantId, dateDue, type } = req.body

  try {
    const reminder: IReminder = await Reminder.create({
      userId,
      plantId,
      dateDue,
      type,
    })

    res.status(201).json({ reminder })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const getPlantReminders = async (req: Request, res: Response) => {
  const { plantId, userId } = req.params

  try {
    const reminders: IReminder[] = await Reminder.find({
      userId,
      plantId,
    }).lean()

    if (reminders) {
      return res.status(200).json({ reminders })
    } else {
      return res.status(404).json({ message: 'No reminders found' })
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const getAllReminders = async (req: Request, res: Response) => {
  const { userId } = req.params

  try {
    const filters = req.query.completed
      ? { userId, dateCompleted: { $ne: null } }
      : { userId, dateCompleted: null }
    const page = req.params.page ? parseInt(req.params.page) : 1
    const resultsPerPage = 24

    const reminders: IReminder[] = await Reminder.find(filters)
      .sort({ dateDue: 1 })
      .skip((page - 1) * resultsPerPage)
      .limit(resultsPerPage)
      .lean()

    const totalResults: number = await Reminder.countDocuments(filters)

    return res.status(200).json({
      reminders,
      page,
      totalResults,
      nextCursor: totalResults > resultsPerPage * page ? page + 1 : null,
    })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

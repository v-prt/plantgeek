import { Response, Request } from 'express'
import { IReminder } from '../Interfaces'
import { Reminder } from '../Models'
const mongodb = require('mongodb')
const { ObjectId } = mongodb

export const createReminder = async (req: Request, res: Response) => {
  const { userId, plantId, dateDue, type, frequencyNumber, frequencyUnit } = req.body

  try {
    const reminder: IReminder = await Reminder.create({
      userId,
      plantId,
      dateDue,
      type,
      frequencyNumber,
      frequencyUnit,
    })

    res.status(201).json({ reminder })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const updateReminder = async (req: Request, res: Response) => {
  const { reminderId } = req.params

  try {
    const updatedReminder = await Reminder.updateOne(
      { _id: new ObjectId(reminderId) },
      {
        $set: req.body,
      }
    )

    res.status(201).json({ updatedReminder })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const completeReminder = async (req: Request, res: Response) => {
  const { reminderId } = req.params

  try {
    const originalReminder = await Reminder.findOne({ _id: new ObjectId(reminderId) })

    if (originalReminder) {
      const currentDate = new Date()
      const timeToAdd = originalReminder.frequencyNumber
      const unit = originalReminder.frequencyUnit

      // set next date based on frequencyNumber and frequencyUnit - which could be Days, Weeks, Months, or Years
      const nextDate = new Date(currentDate)
      if (unit === 'Days') {
        nextDate.setDate(nextDate.getDate() + timeToAdd)
      } else if (unit === 'Weeks') {
        nextDate.setDate(nextDate.getDate() + timeToAdd * 7)
      } else if (unit === 'Months') {
        nextDate.setMonth(nextDate.getMonth() + timeToAdd)
      } else if (unit === 'Years') {
        nextDate.setFullYear(nextDate.getFullYear() + timeToAdd)
      }

      await Reminder.updateOne(
        { _id: new ObjectId(originalReminder._id) },
        {
          $set: {
            dateCompleted: currentDate,
          },
        }
      )

      const newReminder = await Reminder.create({
        userId: originalReminder.userId,
        plantId: originalReminder.plantId,
        frequencyNumber: originalReminder.frequencyNumber,
        frequencyUnit: originalReminder.frequencyUnit,
        dateDue: nextDate,
        type: originalReminder.type,
      })

      res.status(201).json({ originalReminder, newReminder })
    }
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
      dateCompleted: null,
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
      // include required plant data by referencing plantId
      .populate('plantId', 'primaryName secondaryName imageUrl water')
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

export const deleteReminder = async (req: Request, res: Response) => {
  const { reminderId } = req.params

  try {
    const deletedReminder = await Reminder.deleteOne({ _id: new ObjectId(reminderId) })

    res.status(201).json({ deletedReminder })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const countDueReminders = async (req: Request, res: Response) => {
  const { userId } = req.params

  try {
    // count all reminders past due and due today
    const numDue = await Reminder.countDocuments({
      userId,
      dateDue: { $lte: new Date() },
      dateCompleted: null,
    })

    return res.status(200).json({ numDue })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

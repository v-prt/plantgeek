// we start by importing the interfaces and some utilities from mongoose. The latter helps to define the schemas and also pass in the interface as a type to the model before exporting it.

import { IReport } from './Interfaces'
import { model, Schema } from 'mongoose'
const ObjectId = Schema.Types.ObjectId

const reportSchema: Schema = new Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
    },
    plantId: {
      type: ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sourceUrl: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

// TODO: plant schema, user schema

export const Report = model<IReport>('Report', reportSchema)

// we start by importing the interfaces and some utilities from mongoose. The latter helps to define the schemas and also pass in the interface as a type to the model before exporting it.

import { IPlant, IReport } from './Interfaces'
import { model, Schema } from 'mongoose'
const ObjectId = Schema.Types.ObjectId

const plantSchema: Schema = new Schema({
  primaryName: {
    type: String,
    required: true,
  },
  secondaryName: {
    type: String,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  light: {
    type: String,
    required: true,
  },
  water: {
    type: String,
    required: true,
  },
  temperature: {
    type: String,
    required: true,
  },
  humidity: {
    type: String,
    required: true,
  },
  toxic: {
    type: Boolean,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  hearts: {
    type: Array,
    default: [],
  },
  owned: {
    type: Array,
    default: [],
  },
  wanted: {
    type: Array,
    default: [],
  },
  contributorId: {
    type: ObjectId,
  },
  review: {
    type: String,
  },
})

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

export const Plant = model<IPlant>('Plant', plantSchema)
export const Report = model<IReport>('Report', reportSchema)

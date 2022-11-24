import { IUser, IPlant, IReport } from './Interfaces'
import { model, Schema } from 'mongoose'
const ObjectId = Schema.Types.ObjectId

const userSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  joined: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: 'user',
  },
  imageUrl: {
    type: String,
  },
  plantCollection: {
    type: [ObjectId],
    ref: 'Plant',
    default: [],
  },
  plantWishlist: {
    type: [ObjectId],
    ref: 'Plant',
    default: [],
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
  },
  passwordResetCode: {
    type: String,
  },
})

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

export const User = model<IUser>('User', userSchema)
export const Plant = model<IPlant>('Plant', plantSchema)
export const Report = model<IReport>('Report', reportSchema)

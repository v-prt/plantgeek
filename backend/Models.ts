import { IUser, IPlant, IReport, IReminder } from './Interfaces'
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
    // botanical name and variety
    type: String,
    required: true,
  },
  secondaryName: {
    // common name
    type: String,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  light: {
    // low to bright indirect, medium to bright indirect, bright indirect
    type: String,
    required: true,
  },
  water: {
    // low, low to medium, medium, medium to high, high
    type: String,
    required: true,
  },
  temperature: {
    // average, above average
    type: String,
    required: true,
  },
  humidity: {
    // low, medium, high
    type: String,
    required: true,
  },
  toxic: {
    type: Boolean,
    required: true,
  },
  origin: {
    // country/region of origin
    type: String,
  },
  climate: {
    // tropical, subtropical, temperate, desert
    type: String,
  },
  rarity: {
    // common, uncommon, rare, very rare, unicorn
    type: String,
  },
  sourceUrl: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  hearts: {
    type: [ObjectId],
    ref: 'User',
    default: [],
  },
  owned: {
    type: [ObjectId],
    ref: 'User',
    default: [],
  },
  wanted: {
    type: [ObjectId],
    ref: 'User',
    default: [],
  },
  contributorId: {
    type: ObjectId,
  },
  review: {
    // pending, approved, rejected
    type: String,
  },
})

const reportSchema: Schema = new Schema(
  {
    // FIXME: refs don't work like this
    userId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    plantId: {
      type: ObjectId,
      ref: 'Plant',
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

const reminderSchema: Schema = new Schema({
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  plantId: {
    type: ObjectId,
    ref: 'Plant',
    required: true,
  },
  frequencyNumber: {
    type: Number,
    required: true,
  },
  frequencyUnit: {
    // Days, Weeks, Months, Years
    type: String,
    required: true,
  },
  dateDue: {
    type: Date,
    required: true,
  },
  dateCompleted: {
    type: Date,
  },
  type: {
    // water, fertilize, repot
    type: String,
    required: true,
  },
})

export const User = model<IUser>('User', userSchema)
export const Plant = model<IPlant>('Plant', plantSchema)
export const Report = model<IReport>('Report', reportSchema)
export const Reminder = model<IReminder>('Reminder', reminderSchema)

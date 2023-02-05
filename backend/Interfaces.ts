import { Document } from 'mongoose'

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  joined: Date
  role?: string
  imageUrl?: string
  plantCollection: IPlant[]
  plantWishlist: IPlant[]
  emailVerified?: boolean
  verificationCode?: string
  passwordResetCode?: string
}

export interface IPlant extends Document {
  primaryName: string
  secondaryName?: string
  imageUrl: string
  light: string
  water: string
  temperature: string
  humidity: string
  toxic: boolean
  origin?: string
  climate?: string
  rarity?: string
  sourceUrl: string
  slug: string
  hearts: IUser[]
  owned: IUser[]
  wanted: IUser[]
  contributorId?: string
  review?: string
}

export interface IReport extends Document {
  userId: string
  plantId: string
  message: string
  sourceUrl?: string
  status: string
}

export interface IReminder extends Document {
  userId: string
  plantId: string
  frequency: string
  dateDue: Date
  dateCompleted?: Date
  type: string
}

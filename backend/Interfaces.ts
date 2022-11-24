import { Document } from 'mongoose'

export interface IPlant extends Document {
  primaryName: string
  secondaryName?: string
  imageUrl: string
  light: string
  water: string
  temperature: string
  humidity: string
  toxic: boolean
  slug: string
  hearts: string[]
  owned: string[]
  wanted: string[]
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

// TODO: plant interface, user interface

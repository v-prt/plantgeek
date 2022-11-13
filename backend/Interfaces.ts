import { Document } from 'mongoose'

// Here, we have a Todo interface that extends the Document type provided by mongoose. We will be using it later to interact with MongoDB
export interface IReport extends Document {
  userId: string
  plantId: string
  report: string
  status: string
}

// TODO: plant interface, user interface
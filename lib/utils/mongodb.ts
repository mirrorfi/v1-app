import { MongoClient } from 'mongodb'

export const mongodbClient = new MongoClient(process.env.MONGODB_URI!)
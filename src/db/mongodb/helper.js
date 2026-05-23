import { MongoClient } from 'mongodb'

let client
let db

export const MongoHelper = {
  async connect() {
    if (!db) {
      client = new MongoClient(process.env.MONGO_URI)

      await client.connect()

      db = client.db(process.env.MONGO_DB)

      console.log('MongoDB connected')
    }

    return db
  },

  async getCollection(collectionName) {
    const database = await this.connect()

    return database.collection(collectionName)
  }
}

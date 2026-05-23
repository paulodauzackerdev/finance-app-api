import { ObjectId } from 'mongodb'

import { MongoHelper } from '../../db/mongodb/helper.js'

export class UserRepository {
  constructor() {
    this.collectionName = 'users'
  }

  mapUser(user) {
    if (!user) {
      return null
    }

    return {
      id: user._id.toString(),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password_hash: user.password_hash,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  }

  async findAll() {
    const collection = await MongoHelper.getCollection(this.collectionName)

    const users = await collection.find({}).sort({ created_at: -1 }).toArray()

    return users.map((user) => this.mapUser(user))
  }

  async findById(userId) {
    if (!ObjectId.isValid(userId)) {
      return null
    }

    const collection = await MongoHelper.getCollection(this.collectionName)

    const user = await collection.findOne({
      _id: new ObjectId(userId)
    })

    return this.mapUser(user)
  }

  async findByEmail(email) {
    const collection = await MongoHelper.getCollection(this.collectionName)

    const user = await collection.findOne({ email })

    return this.mapUser(user)
  }

  async create({ first_name, last_name, email, password_hash }) {
    const collection = await MongoHelper.getCollection(this.collectionName)

    const now = new Date()

    const user = {
      first_name,
      last_name,
      email,
      password_hash,
      is_active: true,
      created_at: now,
      updated_at: now
    }

    const result = await collection.insertOne(user)

    return this.mapUser({
      _id: result.insertedId,
      ...user
    })
  }

  async update(userId, updateParams) {
    if (!ObjectId.isValid(userId)) {
      return null
    }

    if (!updateParams || Object.keys(updateParams).length === 0) {
      throw new Error('No fields to update')
    }

    const collection = await MongoHelper.getCollection(this.collectionName)

    const updateFields = {
      ...updateParams,
      updated_at: new Date()
    }

    const result = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(userId)
      },
      {
        $set: updateFields
      },
      {
        returnDocument: 'after'
      }
    )

    return this.mapUser(result)
  }

  async delete(userId) {
    if (!ObjectId.isValid(userId)) {
      return null
    }

    const collection = await MongoHelper.getCollection(this.collectionName)

    const user = await collection.findOneAndDelete({
      _id: new ObjectId(userId)
    })

    return this.mapUser(user)
  }
}

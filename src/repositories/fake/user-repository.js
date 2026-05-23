import { randomUUID } from 'crypto'

export class UserRepository {
  constructor() {
    this.users = [
      {
        id: randomUUID(),
        first_name: 'Fake',
        last_name: 'User',
        email: 'fake@email.com',
        password_hash: 'hashed-password',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: randomUUID(),
        first_name: 'Second',
        last_name: 'Fake User',
        email: 'second-fake@email.com',
        password_hash: 'hashed-password',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]
  }

  async findAll() {
    return this.users
  }

  async findById(userId) {
    return this.users.find((user) => user.id === userId) || null
  }

  async findByEmail(email) {
    return this.users.find((user) => user.email === email) || null
  }

  async create({ first_name, last_name, email, password_hash }) {
    const user = {
      id: randomUUID(),
      first_name,
      last_name,
      email,
      password_hash,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }

    this.users.push(user)

    return user
  }

  async update(userId, updateParams) {
    const userIndex = this.users.findIndex((user) => user.id === userId)

    if (userIndex === -1) {
      return null
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateParams,
      updated_at: new Date()
    }

    return this.users[userIndex]
  }

  async delete(userId) {
    const userIndex = this.users.findIndex((user) => user.id === userId)

    if (userIndex === -1) {
      return null
    }

    const deletedUser = this.users[userIndex]

    this.users.splice(userIndex, 1)

    return deletedUser
  }
}

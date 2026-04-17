import bcrypt from 'bcrypt'
import { UserRepository } from '../repositories/postgres/create-user.js'

export class CreateUserUseCase {
  constructor() {
    this.userRepository = new UserRepository()
  }

  async execute({ first_name, last_name, email, password }) {
    if (!first_name || !last_name || !email || !password) {
      throw new Error('Missing required fields')
    }

    const existingUser = await this.userRepository.findByEmail(email)

    if (existingUser) {
      throw new Error('User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await this.userRepository.create({
      first_name,
      last_name,
      email,
      password: hashedPassword
    })

    return user
  }
}

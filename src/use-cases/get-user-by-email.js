import { GetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'

export class GetUserByEmailUseCase {
  constructor() {
    this.getUserByEmailRepository = new GetUserByEmailRepository()
  }

  async execute(email) {
    const user = await this.getUserByEmailRepository.findByEmail(email)

    if (!user) {
      throw new Error('User not found')
    }

    return user
  }
}

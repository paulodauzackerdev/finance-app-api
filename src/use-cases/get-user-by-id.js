import { GetUserByIdRepository } from '../repositories/postgres/get-user-by-id.js'

export class GetUserByIdUseCase {
  constructor() {
    this.getUserByIdRepository = new GetUserByIdRepository()
  }

  async execute(userId) {
    const user = await this.getUserByIdRepository.findById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    return user
  }
}

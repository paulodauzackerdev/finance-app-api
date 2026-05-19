import { UserRepository } from '../repositories/postgres/postgres-user-repository.js'
import { UserNotFoundError } from '../errors/user.js'

export class GetUserByEmailUseCase {
  constructor() {
    this.userRepository = new UserRepository()
  }

  async execute(email) {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new UserNotFoundError()
    }

    return user
  }
}

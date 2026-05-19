import { UserRepository } from '../repositories/postgres/postgres-user-repository.js'

export class GetAllUsersUseCase {
  constructor() {
    this.userRepository = new UserRepository()
  }

  async execute() {
    return await this.userRepository.findAll()
  }
}

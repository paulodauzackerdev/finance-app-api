import { removePasswordFromUser } from '../../helpers/user.js'

export class GetDeletedUsersUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute() {
    const users = await this.userRepository.findDeleted()

    return users.map(removePasswordFromUser)
  }
}

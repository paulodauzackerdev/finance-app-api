import { removePasswordFromUser } from '../../helpers/user.js'

import { userDatabaseSchema } from '../../schemas/user/user.schema.js'

import { UserNotFoundError } from '../../errors/user.js'

export class GetUserByEmailUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute(email) {
    const validatedUserEmail = userDatabaseSchema.shape.email.parse(email)

    const user = await this.userRepository.findByEmail(validatedUserEmail)

    if (!user) {
      throw new UserNotFoundError()
    }

    return removePasswordFromUser(user)
  }
}

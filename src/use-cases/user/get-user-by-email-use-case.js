import { removePasswordFromUser } from '../../helpers/user.js'

import { validateEmail } from '../../validators/user/validate-email.js'

import { UserNotFoundError } from '../../errors/user.js'

export class GetUserByEmailUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute(email) {
    const normalizedEmail = validateEmail(email)

    const user = await this.userRepository.findByEmail(normalizedEmail)

    if (!user) {
      throw new UserNotFoundError()
    }

    return removePasswordFromUser(user)
  }
}

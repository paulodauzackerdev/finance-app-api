import validator from 'validator'

import { removePasswordFromUser } from '../../helpers/user.js'

import { UserNotFoundError, InvalidEmailError } from '../../errors/user.js'

export class GetUserByEmailUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute(email) {
    if (!validator.isEmail(email)) {
      throw new InvalidEmailError()
    }

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new UserNotFoundError()
    }

    return removePasswordFromUser(user)
  }
}

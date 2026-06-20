import { removePasswordFromUser } from '../../helpers/user.js'
import { passwordHelper } from '../../helpers/password.js'

import { createUserInputSchema } from '../../schemas/user/user.schema.js'

import { UserAlreadyExistsError } from '../../errors/user.js'

export class CreateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute(createParams) {
    const { firstName, lastName, email, password } =
      createUserInputSchema.parse(createParams)

    const existingUser = await this.userRepository.findByEmail(email)
    if (existingUser) {
      throw new UserAlreadyExistsError()
    }

    const passwordHash = await passwordHelper.hash(password)

    const user = await this.userRepository.create({
      firstName,
      lastName,
      email,
      passwordHash
    })

    return removePasswordFromUser(user)
  }
}

import { removePasswordFromUser } from '../../helpers/user.js'
import { hashPassword } from '../../helpers/password.js'

import {
  validateEmail,
  validateName,
  validatePassword
} from '../../validators/user/index.js'

import { UserAlreadyExistsError } from '../../errors/user.js'
export class CreateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute({ first_name, last_name, email, password }) {
    const firstName = validateName(first_name, 'First name')
    const lastName = validateName(last_name, 'Last name')
    const normalizedEmail = validateEmail(email)
    const validatedPassword = validatePassword(password)

    const existingUser = await this.userRepository.findByEmail(normalizedEmail)
    if (existingUser) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = await hashPassword(validatedPassword)

    const user = await this.userRepository.create({
      first_name: firstName,
      last_name: lastName,
      email: normalizedEmail,
      password_hash
    })

    return removePasswordFromUser(user)
  }
}

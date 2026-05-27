import bcrypt from 'bcrypt'
import validator from 'validator'

import { removePasswordFromUser, normalizeEmail } from '../../helpers/user.js'

import {
  UserAlreadyExistsError,
  InvalidNameError,
  InvalidLastNameError,
  InvalidEmailError,
  WeakPasswordError
} from '../../errors/user.js'

export class CreateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute({ first_name, last_name, email, password }) {
    if (typeof first_name !== 'string') {
      throw new InvalidNameError('First name must be a string')
    }

    if (typeof last_name !== 'string') {
      throw new InvalidLastNameError('Last name must be a string')
    }

    if (typeof email !== 'string') {
      throw new InvalidEmailError('Email must be a string')
    }
    if (typeof password !== 'string') {
      throw new WeakPasswordError('Password must be a string')
    }

    const firstName = first_name.trim()
    const lastName = last_name.trim()

    const normalizedEmail = normalizeEmail(email)

    const trimmedPassword = password.trim()

    if (!firstName) throw new InvalidNameError('First name is required')
    if (!lastName) throw new InvalidLastNameError('Last name is required')
    if (!normalizedEmail) throw new InvalidEmailError('Email is required')
    if (!trimmedPassword) throw new WeakPasswordError('Password is required')

    if (!validator.isLength(firstName, { min: 1, max: 50 })) {
      throw new InvalidNameError(
        'First name must have between 1 and 50 characters'
      )
    }

    if (!validator.isLength(lastName, { min: 1, max: 50 })) {
      throw new InvalidLastNameError(
        'Last name must have between 1 and 50 characters'
      )
    }

    if (!validator.isEmail(normalizedEmail)) {
      throw new InvalidEmailError('Invalid email format')
    }

    if (!validator.isLength(trimmedPassword, { min: 6 })) {
      throw new WeakPasswordError('Password must have at least 6 characters')
    }

    const existingUser = await this.userRepository.findByEmail(normalizedEmail)
    if (existingUser) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = await bcrypt.hash(trimmedPassword, 10)

    const user = await this.userRepository.create({
      first_name: firstName,
      last_name: lastName,
      email: normalizedEmail,
      password_hash
    })

    return removePasswordFromUser(user)
  }
}

import bcrypt from 'bcrypt'
import validator from 'validator'

import { UserRepository } from '../repositories/postgres/postgres-user-repository.js'

import {
  UserNotFoundError,
  UserAlreadyExistsError,
  InvalidNameError,
  InvalidLastNameError,
  InvalidEmailError,
  WeakPasswordError,
  InvalidIsActiveError
} from '../errors/user.js'

export class UpdateUserUseCase {
  constructor() {
    this.userRepository = new UserRepository()
  }

  async execute(userId, updateParams) {
    const existingUser = await this.userRepository.findById(userId)
    if (!existingUser) {
      throw new UserNotFoundError()
    }

    const allowedUpdates = {}

    if (updateParams.first_name !== undefined) {
      if (typeof updateParams.first_name !== 'string') {
        throw new InvalidNameError('First name must be a string')
      }
      const firstName = updateParams.first_name.trim()
      if (!firstName) {
        throw new InvalidNameError('First name is required')
      }

      if (!validator.isLength(firstName, { min: 1, max: 50 })) {
        throw new InvalidNameError(
          'First name must have between 1 and 50 characters'
        )
      }

      if (firstName !== existingUser.first_name) {
        allowedUpdates.first_name = firstName
      }
    }

    if (updateParams.last_name !== undefined) {
      if (typeof updateParams.last_name !== 'string') {
        throw new InvalidLastNameError('Last name must be a string')
      }

      const lastName = updateParams.last_name.trim()

      if (!lastName) {
        throw new InvalidLastNameError('Last name is required')
      }

      if (!validator.isLength(lastName, { min: 1, max: 50 })) {
        throw new InvalidLastNameError(
          'Last name must have between 1 and 50 characters'
        )
      }

      if (lastName !== existingUser.last_name) {
        allowedUpdates.last_name = lastName
      }
    }

    if (updateParams.email !== undefined) {
      if (typeof updateParams.email !== 'string') {
        throw new InvalidEmailError('Email must be a string')
      }

      const normalizedEmail = updateParams.email.trim().toLowerCase()

      if (!normalizedEmail) {
        throw new InvalidEmailError('Email is required')
      }

      if (!validator.isEmail(normalizedEmail)) {
        throw new InvalidEmailError('Invalid email format')
      }

      if (normalizedEmail !== existingUser.email) {
        const emailAlreadyExists =
          await this.userRepository.findByEmail(normalizedEmail)

        if (emailAlreadyExists) {
          throw new UserAlreadyExistsError()
        }

        allowedUpdates.email = normalizedEmail
      }
    }

    if (updateParams.password !== undefined) {
      if (typeof updateParams.password !== 'string') {
        throw new WeakPasswordError('Password must be a string')
      }

      const password = updateParams.password.trim()

      if (!password) {
        throw new WeakPasswordError('Password is required')
      }

      if (!validator.isLength(password, { min: 6 })) {
        throw new WeakPasswordError('Password must have at least 6 characters')
      }

      const password_hash = await bcrypt.hash(password, 10)
      allowedUpdates.password_hash = password_hash
    }

    if (updateParams.is_active !== undefined) {
      if (typeof updateParams.is_active !== 'boolean') {
        throw new InvalidIsActiveError()
      }

      if (updateParams.is_active !== existingUser.is_active) {
        allowedUpdates.is_active = updateParams.is_active
      }
    }

    if (Object.keys(allowedUpdates).length === 0) {
      const { password_hash: passwordHash, ...userWithoutPassword } =
        existingUser

      void passwordHash
      return userWithoutPassword
    }

    const updatedUser = await this.userRepository.update(userId, allowedUpdates)

    const { password_hash: passwordHash, ...userWithoutPassword } = updatedUser

    void passwordHash
    return userWithoutPassword
  }
}

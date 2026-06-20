import { removePasswordFromUser } from '../../helpers/user.js'

import { passwordHelper } from '../../helpers/password.js'

import {
  updateUserInputSchema,
  userIdSchema
} from '../../schemas/user/user.schema.js'

import { UserNotFoundError, UserAlreadyExistsError } from '../../errors/user.js'

/**
 * Campos que exigem processamento especial (não são copiados diretamente).
 * Cada campo mapeia para uma função que recebe (valorValidado, usuarioExistente, repositorio)
 * e retorna o par { chave, valor } a ser aplicado no update.
 * Se retornar null, o campo é pulado (nenhuma mudança).
 */
const SPECIAL_FIELDS = {
  password: async (value) => ({
    key: 'passwordHash',
    value: await passwordHelper.hash(value)
  }),
  email: async (value, existingUser, userRepository) => {
    if (value === existingUser.email) return null

    const emailAlreadyExists = await userRepository.findByEmail(value)

    if (emailAlreadyExists && emailAlreadyExists.id !== existingUser.id) {
      throw new UserAlreadyExistsError()
    }

    return { key: 'email', value }
  }
}

export class UpdateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute(userId, updateParams) {
    const validatedUserId = userIdSchema.parse(userId)
    const validatedData = updateUserInputSchema.parse(updateParams)

    const existingUser = await this.userRepository.findById(validatedUserId)

    if (!existingUser) {
      throw new UserNotFoundError()
    }

    const updatesToApply = {}

    for (const [key, value] of Object.entries(validatedData)) {
      if (SPECIAL_FIELDS[key]) {
        const result = await SPECIAL_FIELDS[key](
          value,
          existingUser,
          this.userRepository
        )

        if (result !== null) {
          updatesToApply[result.key] = result.value
        }
      } else if (value !== existingUser[key]) {
        updatesToApply[key] = value
      }
    }

    if (Object.keys(updatesToApply).length === 0) {
      return removePasswordFromUser(existingUser)
    }

    const updatedUser = await this.userRepository.update(
      validatedUserId,
      updatesToApply
    )

    return removePasswordFromUser(updatedUser)
  }
}

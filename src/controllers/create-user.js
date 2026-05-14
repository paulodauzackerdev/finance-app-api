import validator from 'validator'

import { CreateUserUseCase } from '../use-cases/create-user.js'

import { badRequest, conflict, created, internalServerError } from './helper.js'

export class CreateUserController {
  constructor() {
    this.createUserUseCase = new CreateUserUseCase()
  }

  async handle(req, res) {
    try {
      const { first_name, last_name, email, password } = req.body

      const requiredFields = {
        first_name,
        last_name,
        email,
        password
      }

      for (const field in requiredFields) {
        const value = requiredFields[field]

        if (!value || value.trim().length === 0) {
          return badRequest(res, `Missing param: ${field}`)
        }
      }

      const normalizedEmail = email.trim().toLowerCase()

      if (
        !validator.isLength(first_name.trim(), {
          min: 1,
          max: 50
        })
      ) {
        return badRequest(
          res,
          'First name must have between 1 and 50 characters'
        )
      }

      if (
        !validator.isLength(last_name.trim(), {
          min: 1,
          max: 50
        })
      ) {
        return badRequest(
          res,
          'Last name must have between 1 and 50 characters'
        )
      }

      if (!validator.isEmail(normalizedEmail)) {
        return badRequest(res, 'Invalid email')
      }

      if (
        !validator.isLength(password.trim(), {
          min: 6
        })
      ) {
        return badRequest(res, 'Password must have at least 6 characters')
      }

      const user = await this.createUserUseCase.execute({
        first_name,
        last_name,
        email: normalizedEmail,
        password
      })

      return created(res, user)
    } catch (error) {
      if (error.message === 'Email já cadastrado') {
        return conflict(res, error.message)
      }

      if (error.message === 'Todos os campos são obrigatórios') {
        return badRequest(res, error.message)
      }

      console.error(error)

      return internalServerError(res)
    }
  }
}

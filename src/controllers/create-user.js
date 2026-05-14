import { CreateUserUseCase } from '../use-cases/create-user.js'

export class CreateUserController {
  constructor() {
    this.createUserUseCase = new CreateUserUseCase()
  }

  async handle(req, res) {
    try {
      const { first_name, last_name, email, password } = req.body

      // validação de campos obrigatórios
      const requiredFields = {
        first_name,
        last_name,
        email,
        password
      }

      for (const field in requiredFields) {
        const value = requiredFields[field]

        if (!value || value.trim().length === 0) {
          return res.status(400).json({
            error: `Missing param: ${field}`
          })
        }
      }

      // validação básica de email
      if (!email.includes('@')) {
        return res.status(400).json({
          error: 'Invalid email'
        })
      }

      // tamanho mínimo da senha
      if (password.trim().length < 6) {
        return res.status(400).json({
          error: 'Password must have at least 6 characters'
        })
      }

      // executar regra de negócio
      const user = await this.createUserUseCase.execute({
        first_name,
        last_name,
        email,
        password
      })

      // sucesso
      return res.status(201).json(user)
    } catch (error) {
      // erros esperados do use case
      if (
        error.message === 'Todos os campos são obrigatórios' ||
        error.message === 'Email já cadastrado'
      ) {
        return res.status(400).json({
          error: error.message
        })
      }

      // erro interno
      console.error(error)

      return res.status(500).json({
        error: 'Internal server error'
      })
    }
  }
}

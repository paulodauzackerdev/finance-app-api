import bcrypt from 'bcrypt'
import { UserRepository } from '../repositories/postgres/create-user.js'

export class CreateUserUseCase {
  constructor() {
    this.userRepository = new UserRepository()
  }

  async execute({ first_name, last_name, email, password }) {
    // remover espaços
    first_name = first_name?.trim()
    last_name = last_name?.trim()
    email = email?.trim().toLowerCase()
    password = password?.trim()

    // validar campos
    if (!first_name || !last_name || !email || !password) {
      throw new Error('Todos os campos são obrigatórios')
    }

    // verificar email existente
    const existingUser = await this.userRepository.findByEmail(email)

    if (existingUser) {
      throw new Error('Email já cadastrado')
    }

    // gerar hash
    const password_hash = await bcrypt.hash(password, 10)

    // criar usuário
    const user = await this.userRepository.create({
      first_name,
      last_name,
      email,
      password_hash
    })

    return user
  }
}

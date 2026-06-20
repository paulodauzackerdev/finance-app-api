import { CreateUserUseCase } from './create-user-use-case.js'
import { passwordHelper } from '../../helpers/password.js'
import { UserAlreadyExistsError } from '../../errors/user.js'

jest.mock('../../helpers/password.js', () => ({
  passwordHelper: {
    hash: jest.fn()
  }
}))

describe('CreateUserUseCase', () => {
  let createUserUseCase
  let mockUserRepository

  const validUserParams = {
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao@email.com',
    password: 'Senha123!'
  }

  const hashedPassword = 'hashed_password_hash'
  const createdUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao@email.com',
    isActive: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01')
  }

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn()
    }

    createUserUseCase = new CreateUserUseCase(mockUserRepository)
    jest.clearAllMocks()
  })

  describe('execute', () => {
    test('deve criar usuário com sucesso', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null)
      passwordHelper.hash.mockResolvedValue(hashedPassword)
      mockUserRepository.create.mockResolvedValue(createdUser)

      // Act
      const result = await createUserUseCase.execute(validUserParams)

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        validUserParams.email
      )
      expect(passwordHelper.hash).toHaveBeenCalledWith(validUserParams.password)
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@email.com',
        passwordHash: hashedPassword
      })
      expect(result).toEqual(createdUser)
      expect(result.passwordHash).toBeUndefined()
    })

    test('deve lançar UserAlreadyExistsError quando email já existe', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(createdUser)

      // Act & Assert
      await expect(createUserUseCase.execute(validUserParams)).rejects.toThrow(
        UserAlreadyExistsError
      )

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        validUserParams.email
      )
      expect(passwordHelper.hash).not.toHaveBeenCalled()
      expect(mockUserRepository.create).not.toHaveBeenCalled()
    })

    test('deve validar input com campos inválidos (Zod)', async () => {
      // Arrange
      const invalidParams = {
        firstName: 'A', // muito curto
        lastName: 'B', // muito curto
        email: 'email-invalido',
        password: 'fraca' // muito curta, sem maiúscula, número ou especial
      }

      mockUserRepository.findByEmail.mockResolvedValue(null)

      // Act & Assert
      await expect(createUserUseCase.execute(invalidParams)).rejects.toThrow() // ZodError

      expect(mockUserRepository.create).not.toHaveBeenCalled()
    })

    test('deve validar input com campos faltando (Zod)', async () => {
      // Arrange
      const incompleteParams = {
        firstName: 'João'
        // lastName, email e password faltando
      }

      // Act & Assert
      await expect(
        createUserUseCase.execute(incompleteParams)
      ).rejects.toThrow() // ZodError

      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled()
      expect(mockUserRepository.create).not.toHaveBeenCalled()
    })

    test('deve lançar UserAlreadyExistsError e não criar mesmo com email em maiúsculo (Zod lowercases)', async () => {
      // Arrange
      const paramsWithUpperCaseEmail = {
        ...validUserParams,
        email: 'JOAO@EMAIL.COM'
      }

      mockUserRepository.findByEmail.mockResolvedValue(createdUser)

      // Act & Assert
      await expect(
        createUserUseCase.execute(paramsWithUpperCaseEmail)
      ).rejects.toThrow(UserAlreadyExistsError)

      // O schema do Zod faz .toLowerCase() .trim(), então findByEmail recebe lowercase
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'joao@email.com'
      )
      expect(mockUserRepository.create).not.toHaveBeenCalled()
    })

    test('deve propagar erro se o repositório falhar', async () => {
      // Arrange
      const dbError = new Error('Database connection failed')
      mockUserRepository.findByEmail.mockResolvedValue(null)
      passwordHelper.hash.mockResolvedValue(hashedPassword)
      mockUserRepository.create.mockRejectedValue(dbError)

      // Act & Assert
      await expect(createUserUseCase.execute(validUserParams)).rejects.toThrow(
        'Database connection failed'
      )

      expect(mockUserRepository.findByEmail).toHaveBeenCalled()
      expect(passwordHelper.hash).toHaveBeenCalled()
      expect(mockUserRepository.create).toHaveBeenCalled()
    })
  })
})

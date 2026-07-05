import { faker } from '@faker-js/faker'
import { ZodError } from 'zod'
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
    id: faker.string.uuid(),
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao@email.com',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01')
  }

  const deletedUser = {
    ...createdUser,
    deletedAt: new Date('2026-06-01')
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
    it('should create a user successfully', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null)
      passwordHelper.hash.mockResolvedValue(hashedPassword)
      mockUserRepository.create.mockResolvedValue(createdUser)

      const result = await createUserUseCase.execute(validUserParams)

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        validUserParams.email,
        true
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

    it('should throw UserAlreadyExistsError when email already exists and is active', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(createdUser)

      await expect(createUserUseCase.execute(validUserParams)).rejects.toThrow(
        UserAlreadyExistsError
      )

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        validUserParams.email,
        true
      )
      expect(passwordHelper.hash).not.toHaveBeenCalled()
      expect(mockUserRepository.create).not.toHaveBeenCalled()
    })

    it('should throw UserAlreadyExistsError when email exists but is soft-deleted (mensagem genérica)', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(deletedUser)

      await expect(createUserUseCase.execute(validUserParams)).rejects.toThrow(
        UserAlreadyExistsError
      )

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        validUserParams.email,
        true
      )
      expect(passwordHelper.hash).not.toHaveBeenCalled()
      expect(mockUserRepository.create).not.toHaveBeenCalled()
    })

    it('should throw ZodError when input has invalid fields', async () => {
      const invalidParams = {
        firstName: 'A',
        lastName: 'B',
        email: 'invalid-email',
        password: 'fraca'
      }

      mockUserRepository.findByEmail.mockResolvedValue(null)

      await expect(createUserUseCase.execute(invalidParams)).rejects.toThrow(
        ZodError
      )

      expect(mockUserRepository.create).not.toHaveBeenCalled()
    })

    it('should throw ZodError when input has missing fields', async () => {
      const incompleteParams = {
        firstName: 'João'
      }

      await expect(createUserUseCase.execute(incompleteParams)).rejects.toThrow(
        ZodError
      )

      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled()
      expect(mockUserRepository.create).not.toHaveBeenCalled()
    })

    it('should throw UserAlreadyExistsError with uppercase email (Zod lowercases) when email is deleted', async () => {
      const paramsWithUpperCaseEmail = {
        ...validUserParams,
        email: 'JOAO@EMAIL.COM'
      }

      mockUserRepository.findByEmail.mockResolvedValue(deletedUser)

      await expect(
        createUserUseCase.execute(paramsWithUpperCaseEmail)
      ).rejects.toThrow(UserAlreadyExistsError)

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'joao@email.com',
        true
      )
      expect(mockUserRepository.create).not.toHaveBeenCalled()
    })

    it('should propagate error if repository fails', async () => {
      const dbError = new Error('Database connection failed')
      mockUserRepository.findByEmail.mockResolvedValue(null)
      passwordHelper.hash.mockResolvedValue(hashedPassword)
      mockUserRepository.create.mockRejectedValue(dbError)

      await expect(createUserUseCase.execute(validUserParams)).rejects.toThrow(
        'Database connection failed'
      )

      expect(mockUserRepository.findByEmail).toHaveBeenCalled()
      expect(passwordHelper.hash).toHaveBeenCalled()
      expect(mockUserRepository.create).toHaveBeenCalled()
    })
  })
})

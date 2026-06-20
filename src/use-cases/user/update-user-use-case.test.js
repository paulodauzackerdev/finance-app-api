import { UpdateUserUseCase } from './update-user-use-case.js'
import { passwordHelper } from '../../helpers/password.js'
import { UserNotFoundError, UserAlreadyExistsError } from '../../errors/user.js'

jest.mock('../../helpers/password.js', () => ({
  passwordHelper: {
    hash: jest.fn()
  }
}))

describe('UpdateUserUseCase', () => {
  let updateUserUseCase
  let mockUserRepository

  const mockExistingUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao@email.com',
    isActive: true
  }

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn()
    }

    updateUserUseCase = new UpdateUserUseCase(mockUserRepository)
    jest.clearAllMocks()
  })

  describe('execute', () => {
    test('deve atualizar nome do usuário com sucesso', async () => {
      const userId = mockExistingUser.id
      const updateParams = { firstName: 'João Carlos' }

      mockUserRepository.findById.mockResolvedValue(mockExistingUser)
      mockUserRepository.update.mockResolvedValue({
        ...mockExistingUser,
        firstName: 'João Carlos'
      })

      const result = await updateUserUseCase.execute(userId, updateParams)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
        firstName: 'João Carlos'
      })
      expect(result.firstName).toBe('João Carlos')
      expect(result.passwordHash).toBeUndefined()
    })

    test('deve lançar UserNotFoundError quando usuário não existe', async () => {
      // Arrange
      const userId = mockExistingUser.id
      const updateParams = { firstName: 'Novo Nome' }

      mockUserRepository.findById.mockResolvedValue(null)

      // Act & Assert
      await expect(
        updateUserUseCase.execute(userId, updateParams)
      ).rejects.toThrow(UserNotFoundError)
    })

    test('deve atualizar email e verificar conflito', async () => {
      // Arrange
      const userId = mockExistingUser.id
      const updateParams = { email: 'novo@email.com' }
      const anotherUser = { id: 'outro-id', email: 'novo@email.com' }

      mockUserRepository.findById.mockResolvedValue(mockExistingUser)
      mockUserRepository.findByEmail.mockResolvedValue(anotherUser)

      // Act & Assert
      await expect(
        updateUserUseCase.execute(userId, updateParams)
      ).rejects.toThrow(UserAlreadyExistsError)
    })

    test('deve atualizar senha com hash', async () => {
      // Arrange
      const userId = mockExistingUser.id
      const updateParams = { password: 'NovaSenha123!' }
      const hashedPassword = 'hashed_password_123'

      mockUserRepository.findById.mockResolvedValue(mockExistingUser)
      passwordHelper.hash.mockResolvedValue(hashedPassword)
      mockUserRepository.update.mockResolvedValue(mockExistingUser)

      // Act
      await updateUserUseCase.execute(userId, updateParams)

      // Assert
      expect(passwordHelper.hash).toHaveBeenCalledWith('NovaSenha123!')
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
        passwordHash: hashedPassword
      })
    })

    test('deve retornar o mesmo usuário sem atualizar quando nenhum campo mudou', async () => {
      // Arrange
      const userId = mockExistingUser.id
      const updateParams = {
        firstName: mockExistingUser.firstName,
        email: mockExistingUser.email
      }

      mockUserRepository.findById.mockResolvedValue(mockExistingUser)

      // Act
      const result = await updateUserUseCase.execute(userId, updateParams)

      // Assert
      expect(mockUserRepository.update).not.toHaveBeenCalled()
      expect(result).toEqual(
        expect.objectContaining({
          firstName: mockExistingUser.firstName,
          email: mockExistingUser.email
        })
      )
    })

    test('deve validar UUID inválido com Zod', async () => {
      // Arrange
      const invalidUserId = 'not-a-uuid'
      const updateParams = { firstName: 'Teste' }

      // Act & Assert
      await expect(
        updateUserUseCase.execute(invalidUserId, updateParams)
      ).rejects.toThrow() // ZodError
    })

    test('deve validar input vazio com Zod', async () => {
      // Arrange
      const userId = mockExistingUser.id
      const updateParams = {}

      // Act & Assert
      await expect(
        updateUserUseCase.execute(userId, updateParams)
      ).rejects.toThrow() // ZodError (at least one field)
    })

    test('deve pular campos que não mudaram mesmo quando enviados (OCP - diff automático)', async () => {
      // Arrange
      const userId = mockExistingUser.id
      const updateParams = {
        firstName: mockExistingUser.firstName,
        lastName: mockExistingUser.lastName,
        email: mockExistingUser.email
      }

      mockUserRepository.findById.mockResolvedValue(mockExistingUser)

      // Act
      const result = await updateUserUseCase.execute(userId, updateParams)

      // Assert
      expect(mockUserRepository.update).not.toHaveBeenCalled()
      expect(result).toEqual(expect.objectContaining(mockExistingUser))
    })

    test('deve atualizar múltiplos campos simultaneamente', async () => {
      // Arrange
      const userId = mockExistingUser.id
      const updateParams = {
        firstName: 'Carlos',
        lastName: 'Santos',
        email: 'carlos@email.com'
      }

      mockUserRepository.findById.mockResolvedValue(mockExistingUser)
      mockUserRepository.findByEmail.mockResolvedValue(null)
      mockUserRepository.update.mockResolvedValue({
        ...mockExistingUser,
        ...updateParams
      })

      // Act
      const result = await updateUserUseCase.execute(userId, updateParams)

      // Assert
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
        firstName: 'Carlos',
        lastName: 'Santos',
        email: 'carlos@email.com'
      })
      expect(result.firstName).toBe('Carlos')
      expect(result.lastName).toBe('Santos')
      expect(result.email).toBe('carlos@email.com')
    })
  })
})

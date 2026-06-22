import { GetAllUsersUseCase } from './get-all-users-use-case.js'
import { removePasswordFromUser } from '../../helpers/user.js'

jest.mock('../../helpers/user.js', () => ({
  removePasswordFromUser: jest.fn()
}))

const mockRemovePassword = (fn) => {
  fn.mockImplementation((user) => {
    const { password, ...rest } = user
    void password
    return rest
  })
}

describe('GetAllUsersUseCase', () => {
  let getAllUsersUseCase
  let mockUserRepository

  beforeEach(() => {
    jest.clearAllMocks()

    mockUserRepository = {
      findAll: jest.fn()
    }

    getAllUsersUseCase = new GetAllUsersUseCase(mockUserRepository)
  })

  describe('execute', () => {
    it('should return all users without passwords', async () => {
      const users = [
        { id: 1, name: 'John', email: 'john@email.com', password: 'hash123' },
        { id: 2, name: 'Jane', email: 'jane@email.com', password: 'hash456' }
      ]

      mockUserRepository.findAll.mockResolvedValue(users)
      mockRemovePassword(removePasswordFromUser)

      const result = await getAllUsersUseCase.execute()

      expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1)
      expect(removePasswordFromUser).toHaveBeenCalledTimes(users.length)
      expect(result).toEqual([
        { id: 1, name: 'John', email: 'john@email.com' },
        { id: 2, name: 'Jane', email: 'jane@email.com' }
      ])
    })

    it('should return an empty array when there are no users', async () => {
      mockUserRepository.findAll.mockResolvedValue([])

      const result = await getAllUsersUseCase.execute()

      expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1)
      expect(removePasswordFromUser).not.toHaveBeenCalled()
      expect(result).toEqual([])
    })

    it('should throw when the repository fails', async () => {
      const error = new Error('Database error')
      mockUserRepository.findAll.mockRejectedValue(error)

      await expect(getAllUsersUseCase.execute()).rejects.toThrow(error)
      expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1)
      expect(removePasswordFromUser).not.toHaveBeenCalled()
    })

    it('should keep extra user properties beyond password', async () => {
      const user = {
        id: 1,
        name: 'John',
        email: 'john@email.com',
        password: 'hash123',
        createdAt: '2024-01-01T00:00:00Z',
        isActive: true,
        role: 'admin'
      }

      mockUserRepository.findAll.mockResolvedValue([user])
      mockRemovePassword(removePasswordFromUser)

      const result = await getAllUsersUseCase.execute()

      expect(result[0]).toEqual({
        id: 1,
        name: 'John',
        email: 'john@email.com',
        createdAt: '2024-01-01T00:00:00Z',
        isActive: true,
        role: 'admin'
      })
      expect(result[0]).not.toHaveProperty('password')
    })

    it('should preserve user order', async () => {
      const users = [
        { id: 3, name: 'Carlos', password: 'hash1' },
        { id: 1, name: 'Ana', password: 'hash2' },
        { id: 2, name: 'Beatriz', password: 'hash3' }
      ]

      mockUserRepository.findAll.mockResolvedValue(users)
      mockRemovePassword(removePasswordFromUser)

      const result = await getAllUsersUseCase.execute()

      expect(result.map((u) => u.id)).toEqual([3, 1, 2])
    })
  })
})

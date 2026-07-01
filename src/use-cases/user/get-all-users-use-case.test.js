import { faker } from '@faker-js/faker'
import { GetAllUsersUseCase } from './get-all-users-use-case.js'
import { removePasswordFromUser } from '../../helpers/user.js'

jest.mock('../../helpers/user.js', () => ({
  removePasswordFromUser: jest.fn()
}))

const mockRemovePassword = (fn) => {
  fn.mockImplementation((user) => {
    const { passwordHash, ...rest } = user
    void passwordHash
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
        {
          id: faker.string.uuid(),
          name: 'John',
          email: 'john@email.com',
          passwordHash: 'hash123'
        },
        {
          id: faker.string.uuid(),
          name: 'Jane',
          email: 'jane@email.com',
          passwordHash: 'hash456'
        }
      ]

      mockUserRepository.findAll.mockResolvedValue(users)
      mockRemovePassword(removePasswordFromUser)

      const result = await getAllUsersUseCase.execute()

      expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1)
      expect(removePasswordFromUser).toHaveBeenCalledTimes(users.length)
      expect(result).toEqual([
        { id: users[0].id, name: 'John', email: 'john@email.com' },
        { id: users[1].id, name: 'Jane', email: 'jane@email.com' }
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
        id: faker.string.uuid(),
        name: 'John',
        email: 'john@email.com',
        passwordHash: 'hash123',
        createdAt: '2024-01-01T00:00:00Z',
        isActive: true,
        role: 'admin'
      }

      mockUserRepository.findAll.mockResolvedValue([user])
      mockRemovePassword(removePasswordFromUser)

      const result = await getAllUsersUseCase.execute()

      expect(result[0]).toEqual({
        id: user.id,
        name: 'John',
        email: 'john@email.com',
        createdAt: '2024-01-01T00:00:00Z',
        isActive: true,
        role: 'admin'
      })
      expect(result[0]).not.toHaveProperty('passwordHash')
    })

    it('should preserve user order', async () => {
      const users = [
        { id: faker.string.uuid(), name: 'Carlos', passwordHash: 'hash1' },
        { id: faker.string.uuid(), name: 'Ana', passwordHash: 'hash2' },
        { id: faker.string.uuid(), name: 'Beatriz', passwordHash: 'hash3' }
      ]

      mockUserRepository.findAll.mockResolvedValue(users)
      mockRemovePassword(removePasswordFromUser)

      const result = await getAllUsersUseCase.execute()

      expect(result.map((u) => u.id)).toEqual([
        users[0].id,
        users[1].id,
        users[2].id
      ])
    })
  })
})

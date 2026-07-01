import { faker } from '@faker-js/faker'
import { GetDeletedUsersUseCase } from './get-deleted-users-use-case.js'
import { removePasswordFromUser } from '../../helpers/user.js'

jest.mock('../../helpers/user.js', () => ({
  removePasswordFromUser: jest.fn()
}))

describe('GetDeletedUsersUseCase', () => {
  let getDeletedUsersUseCase
  let mockUserRepository

  beforeEach(() => {
    jest.clearAllMocks()

    mockUserRepository = {
      findDeleted: jest.fn()
    }

    getDeletedUsersUseCase = new GetDeletedUsersUseCase(mockUserRepository)
  })

  describe('execute', () => {
    it('should return deleted users without passwords', async () => {
      const deletedUsers = [
        {
          id: faker.string.uuid(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          passwordHash: 'hash123',
          deletedAt: new Date('2026-06-01')
        },
        {
          id: faker.string.uuid(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          passwordHash: 'hash456',
          deletedAt: new Date('2026-06-02')
        }
      ]

      mockUserRepository.findDeleted.mockResolvedValue(deletedUsers)
      removePasswordFromUser.mockImplementation((user) => {
        const { passwordHash, ...rest } = user
        void passwordHash
        return rest
      })

      const result = await getDeletedUsersUseCase.execute()

      expect(mockUserRepository.findDeleted).toHaveBeenCalledTimes(1)
      expect(removePasswordFromUser).toHaveBeenCalledTimes(deletedUsers.length)
      expect(result).toHaveLength(2)
      expect(result[0]).not.toHaveProperty('passwordHash')
      expect(result[1]).not.toHaveProperty('passwordHash')
    })

    it('should return an empty array when there are no deleted users', async () => {
      mockUserRepository.findDeleted.mockResolvedValue([])

      const result = await getDeletedUsersUseCase.execute()

      expect(mockUserRepository.findDeleted).toHaveBeenCalledTimes(1)
      expect(removePasswordFromUser).not.toHaveBeenCalled()
      expect(result).toEqual([])
    })

    it('should throw when the repository fails', async () => {
      const error = new Error('Database error')
      mockUserRepository.findDeleted.mockRejectedValue(error)

      await expect(getDeletedUsersUseCase.execute()).rejects.toThrow(error)
      expect(mockUserRepository.findDeleted).toHaveBeenCalledTimes(1)
      expect(removePasswordFromUser).not.toHaveBeenCalled()
    })
  })
})

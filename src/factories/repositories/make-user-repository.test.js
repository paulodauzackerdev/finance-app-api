import { UserRepository } from '../../repositories/postgres/postgres-user-repository.js'
import { makeUserRepository } from './make-user-repository.js'

jest.mock('../../repositories/postgres/postgres-user-repository.js', () => ({
  UserRepository: jest.fn()
}))

describe('makeUserRepository', () => {
  it('should create a new UserRepository instance', () => {
    const mockInstance = {}
    UserRepository.mockReturnValue(mockInstance)

    const result = makeUserRepository()

    expect(UserRepository).toHaveBeenCalledTimes(1)
    expect(UserRepository).toHaveBeenCalledWith()
    expect(result).toBe(mockInstance)
  })
})

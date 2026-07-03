jest.mock('../../../prisma/prisma.js', () => {
  const mockUser = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }

  return {
    prisma: {
      user: mockUser
    }
  }
})

import { UserRepository } from './postgres-user-repository.js'
import { prisma } from '../../../prisma/prisma.js'

describe('UserRepository', () => {
  let userRepository

  beforeEach(() => {
    userRepository = new UserRepository()
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    const mockUsers = [
      {
        id: 'uuid-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
        deletedAt: null
      }
    ]

    it('should find all active users (exclude deleted) by default', async () => {
      prisma.user.findMany.mockResolvedValue(mockUsers)

      const result = await userRepository.findAll()

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true
        },
        orderBy: { createdAt: 'desc' }
      })
      expect(result).toEqual(mockUsers)
    })

    it('should include deleted users when includeDeleted is true', async () => {
      prisma.user.findMany.mockResolvedValue(mockUsers)

      await userRepository.findAll(true)

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {},
        select: expect.any(Object),
        orderBy: { createdAt: 'desc' }
      })
    })
  })

  describe('findById', () => {
    const mockUser = {
      id: 'uuid-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
      deletedAt: null
    }

    it('should find active user by id', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser)

      const result = await userRepository.findById('uuid-1')

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-1', deletedAt: null },
        select: expect.any(Object)
      })
      expect(result).toEqual(mockUser)
    })

    it('should include deleted users when includeDeleted is true', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser)

      await userRepository.findById('uuid-1', true)

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
        select: expect.any(Object)
      })
    })

    it('should return null when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null)

      const result = await userRepository.findById('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('findByEmail', () => {
    const mockUser = {
      id: 'uuid-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      passwordHash: 'hashed_password',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
      deletedAt: null
    }

    it('should find active user by email', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser)

      const result = await userRepository.findByEmail('john@example.com')

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@example.com', deletedAt: null },
        select: expect.any(Object)
      })
      expect(result).toEqual(mockUser)
    })

    it('should include deleted users when includeDeleted is true', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser)

      await userRepository.findByEmail('john@example.com', true)

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
        select: expect.any(Object)
      })
    })

    it('should return null when email not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null)

      const result = await userRepository.findByEmail('unknown@example.com')

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('should create a user with the given data', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        passwordHash: 'hashed_password'
      }
      const createdUser = { ...userData, id: 'uuid-1' }

      prisma.user.create.mockResolvedValue(createdUser)

      const result = await userRepository.create(userData)

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: userData,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          updatedAt: true
        }
      })
      expect(result).toEqual(createdUser)
    })
  })

  describe('update', () => {
    const userId = 'uuid-1'

    it('should update user with provided fields', async () => {
      const updateParams = {
        firstName: 'Jane',
        email: 'jane@example.com'
      }
      const updatedUser = {
        id: userId,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com'
      }

      prisma.user.update.mockResolvedValue(updatedUser)

      const result = await userRepository.update(userId, updateParams)

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId, deletedAt: null },
        data: {
          firstName: 'Jane',
          email: 'jane@example.com'
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          updatedAt: true
        }
      })
      expect(result).toEqual(updatedUser)
    })

    it('should handle all updatable fields', async () => {
      const updateParams = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        passwordHash: 'new_hash'
      }

      prisma.user.update.mockResolvedValue({ id: userId })

      await userRepository.update(userId, updateParams)

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId, deletedAt: null },
        data: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          passwordHash: 'new_hash'
        },
        select: expect.any(Object)
      })
    })

    it('should skip undefined fields', async () => {
      const updateParams = {
        firstName: 'Jane'
      }

      prisma.user.update.mockResolvedValue({ id: userId })

      await userRepository.update(userId, updateParams)

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId, deletedAt: null },
        data: { firstName: 'Jane' },
        select: expect.any(Object)
      })
    })
  })

  describe('softDelete', () => {
    it('should set deletedAt', async () => {
      const userId = 'uuid-1'
      const deletedUser = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        deletedAt: new Date('2026-06-01')
      }

      prisma.user.update.mockResolvedValue(deletedUser)

      const result = await userRepository.softDelete(userId)

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId, deletedAt: null },
        data: {
          deletedAt: expect.any(Date)
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          deletedAt: true
        }
      })
      expect(result).toEqual(deletedUser)
    })
  })

  describe('hardDelete', () => {
    it('should delete user permanently', async () => {
      const userId = 'uuid-1'

      prisma.user.delete.mockResolvedValue({ id: userId })

      const result = await userRepository.hardDelete(userId)

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: userId }
      })
      expect(result).toEqual({ id: userId })
    })
  })

  describe('restore', () => {
    it('should restore soft-deleted user', async () => {
      const userId = 'uuid-1'
      const restoredUser = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      }

      prisma.user.update.mockResolvedValue(restoredUser)

      const result = await userRepository.restore(userId)

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          deletedAt: null
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          updatedAt: true
        }
      })
      expect(result).toEqual(restoredUser)
    })
  })

  describe('findDeleted', () => {
    it('should find all soft-deleted users', async () => {
      const deletedUsers = [
        {
          id: 'uuid-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          deletedAt: new Date('2026-06-01')
        }
      ]

      prisma.user.findMany.mockResolvedValue(deletedUsers)

      const result = await userRepository.findDeleted()

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { deletedAt: { not: null } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          deletedAt: true
        },
        orderBy: { deletedAt: 'desc' }
      })
      expect(result).toEqual(deletedUsers)
    })
  })
})

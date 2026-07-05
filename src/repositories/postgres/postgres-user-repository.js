import { prisma } from '../../../prisma/prisma.js'

export class UserRepository {
  async findAll(includeDeleted = false) {
    const where = includeDeleted ? {} : { deletedAt: null }

    return prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  async findById(userId, includeDeleted = false) {
    const where = includeDeleted
      ? { id: userId }
      : { id: userId, deletedAt: null }

    return prisma.user.findUnique({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true
      }
    })
  }

  async findByEmail(email, includeDeleted = false) {
    const where = includeDeleted ? { email } : { email, deletedAt: null }

    return prisma.user.findUnique({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        passwordHash: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true
      }
    })
  }

  async create({ firstName, lastName, email, passwordHash }) {
    return prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  async update(userId, updateParams) {
    const data = {}

    if (updateParams.firstName !== undefined) {
      data.firstName = updateParams.firstName
    }

    if (updateParams.lastName !== undefined) {
      data.lastName = updateParams.lastName
    }

    if (updateParams.email !== undefined) {
      data.email = updateParams.email
    }

    if (updateParams.passwordHash !== undefined) {
      data.passwordHash = updateParams.passwordHash
    }

    return prisma.user.update({
      where: {
        id: userId,
        deletedAt: null
      },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  async softDelete(userId) {
    return prisma.user.update({
      where: {
        id: userId,
        deletedAt: null
      },
      data: {
        deletedAt: new Date()
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        deletedAt: true
      }
    })
  }

  async hardDelete(userId) {
    return prisma.user.delete({
      where: {
        id: userId
      }
    })
  }

  async restore(userId) {
    return prisma.user.update({
      where: {
        id: userId
      },
      data: {
        deletedAt: null
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  async findDeleted() {
    return prisma.user.findMany({
      where: {
        deletedAt: { not: null }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        deletedAt: true
      },
      orderBy: {
        deletedAt: 'desc'
      }
    })
  }
}

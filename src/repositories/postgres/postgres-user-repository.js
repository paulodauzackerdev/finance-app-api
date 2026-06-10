import { prisma } from '../../../prisma/prisma.js'

export class UserRepository {
  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  async findById(userId) {
    return prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  async findByEmail(email) {
    return prisma.user.findUnique({
      where: {
        email
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        passwordHash: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  async create({ first_name, last_name, email, password_hash }) {
    return prisma.user.create({
      data: {
        firstName: first_name,
        lastName: last_name,
        email,
        passwordHash: password_hash
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  async update(userId, updateParams) {
    const data = {}

    if (updateParams.first_name !== undefined) {
      data.firstName = updateParams.first_name
    }

    if (updateParams.last_name !== undefined) {
      data.lastName = updateParams.last_name
    }

    if (updateParams.email !== undefined) {
      data.email = updateParams.email
    }

    if (updateParams.password_hash !== undefined) {
      data.passwordHash = updateParams.password_hash
    }

    return prisma.user.update({
      where: {
        id: userId
      },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  async delete(userId) {
    return prisma.user.delete({
      where: {
        id: userId
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }
}

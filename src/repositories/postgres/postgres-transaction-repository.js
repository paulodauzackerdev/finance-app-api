import { prisma } from '../../../prisma/prisma.js'

export class TransactionRepository {
  async findAll(includeDeleted = false) {
    const where = includeDeleted ? {} : { deletedAt: null }

    return prisma.transaction.findMany({
      where,
      orderBy: {
        transactionDate: 'desc'
      }
    })
  }

  async findById(transactionId, includeDeleted = false) {
    const where = includeDeleted
      ? { id: transactionId }
      : { id: transactionId, deletedAt: null }

    return prisma.transaction.findUnique({
      where
    })
  }

  async findByUserId(userId, includeDeleted = false) {
    const where = includeDeleted ? { userId } : { userId, deletedAt: null }

    return prisma.transaction.findMany({
      where,
      orderBy: {
        transactionDate: 'desc'
      }
    })
  }

  async getUserBalance(userId) {
    const result = await prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId,
        deletedAt: null
      },
      _sum: {
        amount: true
      }
    })

    let totalIncome = 0
    let totalExpense = 0
    let totalInvestment = 0

    for (const item of result) {
      const value = Number(item._sum.amount || 0)

      if (item.type === 'income') totalIncome = value
      if (item.type === 'expense') totalExpense = value
      if (item.type === 'investment') totalInvestment = value
    }

    return {
      totalIncome,
      totalExpense,
      totalInvestment,
      balance: totalIncome - totalExpense - totalInvestment
    }
  }

  async create({ userId, name, amount, description, type, transactionDate }) {
    return prisma.transaction.create({
      data: {
        userId,
        name,
        amount,
        description,
        type,
        transactionDate
      }
    })
  }

  async update(transactionId, updateParams) {
    const data = {}

    if (updateParams.userId !== undefined) {
      data.userId = updateParams.userId
    }

    if (updateParams.name !== undefined) {
      data.name = updateParams.name
    }

    if (updateParams.amount !== undefined) {
      data.amount = updateParams.amount
    }

    if (updateParams.description !== undefined) {
      data.description = updateParams.description
    }

    if (updateParams.type !== undefined) {
      data.type = updateParams.type
    }

    if (updateParams.transactionDate !== undefined) {
      data.transactionDate = updateParams.transactionDate
    }

    return prisma.transaction.update({
      where: {
        id: transactionId,
        deletedAt: null
      },
      data
    })
  }

  async softDelete(transactionId) {
    return prisma.transaction.update({
      where: {
        id: transactionId,
        deletedAt: null
      },
      data: {
        deletedAt: new Date()
      }
    })
  }

  async hardDelete(transactionId) {
    return prisma.transaction.delete({
      where: {
        id: transactionId
      }
    })
  }

  async restore(transactionId) {
    return prisma.transaction.update({
      where: {
        id: transactionId
      },
      data: {
        deletedAt: null
      }
    })
  }

  async findDeleted() {
    return prisma.transaction.findMany({
      where: {
        deletedAt: { not: null }
      },
      orderBy: {
        deletedAt: 'desc'
      }
    })
  }
}

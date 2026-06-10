import { prisma } from '../../../prisma/prisma.js'

export class TransactionRepository {
  async findAll() {
    return prisma.transaction.findMany({
      orderBy: {
        transactionDate: 'desc'
      }
    })
  }

  async findById(transactionId) {
    return prisma.transaction.findUnique({
      where: {
        id: transactionId
      }
    })
  }

  async findByUserId(userId) {
    return prisma.transaction.findMany({
      where: {
        userId
      },
      orderBy: {
        transactionDate: 'desc'
      }
    })
  }

  async getUserBalance(userId) {
    const result = await prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId
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
      total_income: totalIncome,
      total_expense: totalExpense,
      total_investment: totalInvestment,
      balance: totalIncome - totalExpense - totalInvestment
    }
  }

  async create({ user_id, name, amount, description, type, transaction_date }) {
    return prisma.transaction.create({
      data: {
        userId: user_id,
        name,
        amount,
        description,
        type,
        transactionDate: transaction_date
      }
    })
  }

  async update(transactionId, updateParams) {
    const data = {}

    if (updateParams.user_id !== undefined) {
      data.userId = updateParams.user_id
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

    if (updateParams.transaction_date !== undefined) {
      data.transactionDate = updateParams.transaction_date
    }

    return prisma.transaction.update({
      where: {
        id: transactionId
      },
      data
    })
  }

  async delete(transactionId) {
    return prisma.transaction.delete({
      where: {
        id: transactionId
      }
    })
  }
}

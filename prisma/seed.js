import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  const email = 'admin@localhost.com'

  let user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    console.log('👤 Criando usuário...')

    const passwordHash = await bcrypt.hash('12345678', 12)

    user = await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'User',
        email,
        passwordHash,
        isActive: true
      }
    })

    console.log(`✅ Usuário criado (ID: ${user.id})`)
  } else {
    console.log(`👤 Usuário já existe (ID: ${user.id})`)
  }

  const transactionsData = [
    {
      name: 'Salário mensal',
      amount: 5000.0,
      description: 'Entrada principal do mês',
      type: 'income',
      transactionDate: new Date('2026-06-01')
    },
    {
      name: 'Supermercado',
      amount: 1000.0,
      description: 'Compras do mês',
      type: 'expense',
      transactionDate: new Date('2026-06-05')
    },
    {
      name: 'Bitcoin',
      amount: 1000.0,
      description: 'Investimento inicial',
      type: 'investment',
      transactionDate: new Date('2026-06-10')
    }
  ]

  let createdCount = 0
  let existingCount = 0

  for (const transData of transactionsData) {
    const existing = await prisma.transaction.findFirst({
      where: {
        userId: user.id,
        name: transData.name,
        amount: transData.amount
      }
    })

    if (!existing) {
      await prisma.transaction.create({
        data: {
          userId: user.id,
          ...transData
        }
      })
      createdCount++
    } else {
      existingCount++
    }
  }

  if (createdCount > 0) {
    console.log(`✅ ${createdCount} transações criadas`)
  }
  if (existingCount > 0) {
    console.log(`💰 ${existingCount} transações já existiam`)
  }

  const totalTransactions = await prisma.transaction.count({
    where: { userId: user.id }
  })

  console.log(`📊 Total de transações no banco: ${totalTransactions}`)
  console.log('🎉 Seed finalizada')
}

main()
  .catch((e) => {
    console.error('❌ Erro na seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

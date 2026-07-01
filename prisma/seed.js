import { PrismaClient } from '@prisma/client'
import { passwordHelper } from '../src/helpers/password.js'

const prisma = new PrismaClient()

const SEED_USER = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@localhost.com',
  password: 'Admin@123'
}

const SEED_TRANSACTIONS = [
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
  },
  {
    name: 'Aluguel',
    amount: 1500.0,
    description: 'Aluguel do apartamento',
    type: 'expense',
    transactionDate: new Date('2026-06-03')
  },
  {
    name: 'Freela',
    amount: 2000.0,
    description: 'Projeto de consultoria',
    type: 'income',
    transactionDate: new Date('2026-06-15')
  }
]

async function undo() {
  console.log('🗑️  Desfazendo seed...')

  const user = await prisma.user.findUnique({
    where: { email: SEED_USER.email }
  })

  if (!user) {
    console.log('⚠️  Nenhum dado encontrado para desfazer.')
    return
  }

  const transactionNames = SEED_TRANSACTIONS.map((t) => t.name)
  const { count: deletedTransactions } = await prisma.transaction.deleteMany({
    where: {
      userId: user.id,
      name: { in: transactionNames }
    }
  })

  console.log(`🗑️  ${deletedTransactions} transações removidas`)

  await prisma.user.delete({ where: { id: user.id } })
  console.log('🗑️  Usuário seed removido')

  console.log('✅ Seed desfeita com sucesso!')
}

async function seed() {
  console.log('🌱 Iniciando seed...')

  let user = await prisma.user.findUnique({
    where: { email: SEED_USER.email }
  })

  if (user) {
    console.log(`👤 Usuário já existe (ID: ${user.id}), pulando criação`)
  } else {
    console.log('👤 Criando usuário...')

    const hash = await passwordHelper.hash(SEED_USER.password)

    user = await prisma.user.create({
      data: {
        firstName: SEED_USER.firstName,
        lastName: SEED_USER.lastName,
        email: SEED_USER.email,
        passwordHash: hash,
        isActive: SEED_USER.isActive
      }
    })

    console.log(`✅ Usuário criado (ID: ${user.id})`)
  }

  let createdCount = 0
  let existingCount = 0

  for (const transData of SEED_TRANSACTIONS) {
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
          name: transData.name,
          amount: transData.amount,
          description: transData.description,
          type: transData.type,
          transactionDate: transData.transactionDate
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

const shouldUndo =
  process.argv.includes('--undo') || process.argv.includes('-u')

main()
  .catch((e) => {
    console.error('❌ Erro na seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

async function main() {
  if (shouldUndo) {
    await undo()
  } else {
    await seed()
  }
}

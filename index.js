import 'dotenv/config'
import express from 'express'
import { PostgresHelper } from './src/db/postgres/helper.js'

const app = express()
const PORT = process.env.PORT

app.get('/users', async (req, res) => {
  try {
    const users = await PostgresHelper.query('SELECT * FROM users;')

    return res.status(200).json(users)
  } catch (error) {
    console.error('Erro ao conectar no banco:', error)

    return res.status(500).json({
      error: 'Erro interno do servidor'
    })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📦 Banco: ${process.env.POSTGRES_DB}`)
  console.log(`URL: http://localhost:${PORT}/users`)
})

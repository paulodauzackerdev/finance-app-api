import express from 'express'
import 'dotenv/config'
import { CreateUserController } from './src/controllers/create-user.js'
import { PostgresHelper } from './src/db/postgres/helper.js'
import { GetUserByIdController } from './src/controllers/get-user-by-id.js'

const app = express()

app.use(express.json())

const createUserController = new CreateUserController()

app.post('/api/users', createUserController.handle.bind(createUserController))

app.get('/api/users', async (req, res) => {
  const result = await PostgresHelper.query(`SELECT 
  id,
  first_name,
  last_name,
  email,
  created_at
FROM users;`)

  return res.json(result)
})

const getUserByIdController = new GetUserByIdController()

app.get('/api/users/:userId', (req, res) =>
  getUserByIdController.handle(req, res)
)

app.get('/api/users/:userEmail', (req, res) =>
  getUserByIdController.handle(req, res)
)

app.listen(process.env.PORT, () => {
  console.log(
    `Rodando com sucesso: http://localhost:${process.env.PORT}/api/users`
  )
})

import express from 'express'
import 'dotenv/config'

import { usersRoutes } from './src/routes/users-routes.js'
import { transactionsRoutes } from './src/routes/transactions-routes.js'
import { errorHandler } from './src/middlewares/error-handler.js'

const app = express()

app.use(express.json())

app.use('/api/users', usersRoutes)

app.use('/api/transactions', transactionsRoutes)

app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log(`Rodando com sucesso: http://localhost:${process.env.PORT}`)
})

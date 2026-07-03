import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'

import { globalLimiter } from './src/middlewares/rate-limiter.js'
import { corsMiddleware } from './src/middlewares/cors.js'
import { errorHandler } from './src/middlewares/error-handler.js'

import { docsRoutes } from './src/routes/docs-routes.js'
import { authRoutes } from './src/routes/auth-routes.js'
import { usersRoutes } from './src/routes/users-routes.js'
import { transactionsRoutes } from './src/routes/transactions-routes.js'

const app = express()

app.use(helmet())
app.use(corsMiddleware)
app.use(globalLimiter)
app.use(express.json())

app.use('/docs', docsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/transactions', transactionsRoutes)

app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log(`Rodando com sucesso: http://localhost:${process.env.PORT}`)
  console.log(`Documentação: http://localhost:${process.env.PORT}/docs`)
})

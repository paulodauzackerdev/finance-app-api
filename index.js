import express from 'express'

import 'dotenv/config'

import { apiReference } from '@scalar/express-api-reference'

import helmet from 'helmet'
import { globalLimiter } from './src/middlewares/rate-limiter.js'
import { corsMiddleware } from './src/middlewares/cors.js'

import { usersRoutes } from './src/routes/users-routes.js'
import { transactionsRoutes } from './src/routes/transactions-routes.js'

import { errorHandler } from './src/middlewares/error-handler.js'

import { openApiSpec } from './src/docs/openapi.js'

const app = express()

app.use(helmet())

app.use(corsMiddleware)

app.use(globalLimiter)

app.use(express.json())

app.use(
  '/docs',
  apiReference({
    spec: {
      content: openApiSpec
    }
  })
)

app.use('/api/users', usersRoutes)

app.use('/api/transactions', transactionsRoutes)

app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log(`Rodando com sucesso: http://localhost:${process.env.PORT}`)
  console.log(`Documentação: http://localhost:${process.env.PORT}/docs`)
})

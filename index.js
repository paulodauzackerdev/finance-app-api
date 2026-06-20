import express from 'express'
import 'dotenv/config'
import { apiReference } from '@scalar/express-api-reference'

import { usersRoutes } from './src/routes/users-routes.js'
import { transactionsRoutes } from './src/routes/transactions-routes.js'
import { errorHandler } from './src/middlewares/error-handler.js'
import { openApiSpec } from './src/docs/openapi.js'

const app = express()

app.use(express.json())

// Documentação interativa da API
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

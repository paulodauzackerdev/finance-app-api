import express from 'express'
import 'dotenv/config'

import { usersRoutes } from './src/routes/users-routes.js'

const app = express()

app.use(express.json())

app.use('/api/users', usersRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Rodando com sucesso: http://localhost:${process.env.PORT}`)
})

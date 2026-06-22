import { Router } from 'express'
import { apiReference } from '@scalar/express-api-reference'

import { docsHelmet } from '../middlewares/helmet.js'
import { openApiSpec } from '../docs/openapi.js'

const docsRoutes = Router()

docsRoutes.use(
  docsHelmet,
  apiReference({
    spec: {
      content: openApiSpec
    }
  })
)

export { docsRoutes }

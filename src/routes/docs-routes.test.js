/**
 * @jest-environment node
 */
jest.mock('@scalar/express-api-reference', () => ({
  apiReference: jest.fn(() => (req, res, next) => next())
}))

jest.mock('../middlewares/helmet.js', () => ({
  docsHelmet: jest.fn((req, res, next) => next())
}))

jest.mock('../docs/openapi.js', () => ({
  openApiSpec: { openapi: '3.0.0', info: { title: 'Test API' } }
}))

import { Router } from 'express'
import { docsRoutes } from './docs-routes.js'

describe('docsRoutes', () => {
  it('should export a Router instance', () => {
    expect(docsRoutes).toBeDefined()
    expect(docsRoutes).toBeInstanceOf(Router)
  })

  it('should have middleware registered', () => {
    expect(docsRoutes.stack.length).toBeGreaterThanOrEqual(1)
  })
})

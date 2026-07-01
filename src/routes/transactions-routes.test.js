/**
 * @jest-environment node
 */
jest.mock(
  '../factories/transactions/make-create-transaction-controller.js',
  () => ({
    makeCreateTransactionController: jest.fn(() => ({ handle: jest.fn() }))
  })
)
jest.mock(
  '../factories/transactions/make-get-transactions-by-user-id-controller.js',
  () => ({
    makeGetTransactionsByUserIdController: jest.fn(() => ({
      handle: jest.fn()
    }))
  })
)
jest.mock(
  '../factories/transactions/make-update-transaction-controller.js',
  () => ({
    makeUpdateTransactionController: jest.fn(() => ({ handle: jest.fn() }))
  })
)
jest.mock(
  '../factories/transactions/make-hard-delete-transaction-controller.js',
  () => ({
    makeHardDeleteTransactionController: jest.fn(() => ({ handle: jest.fn() }))
  })
)
jest.mock(
  '../factories/transactions/make-soft-delete-transaction-controller.js',
  () => ({
    makeSoftDeleteTransactionController: jest.fn(() => ({ handle: jest.fn() }))
  })
)
jest.mock(
  '../factories/transactions/make-restore-transaction-controller.js',
  () => ({
    makeRestoreTransactionController: jest.fn(() => ({ handle: jest.fn() }))
  })
)
jest.mock(
  '../factories/transactions/make-get-deleted-transactions-controller.js',
  () => ({
    makeGetDeletedTransactionsController: jest.fn(() => ({
      handle: jest.fn()
    }))
  })
)
jest.mock(
  '../factories/transactions/make-get-deleted-transactions-by-user-id-controller.js',
  () => ({
    makeGetDeletedTransactionsByUserIdController: jest.fn(() => ({
      handle: jest.fn()
    }))
  })
)

import { Router } from 'express'
import { transactionsRoutes } from './transactions-routes.js'

describe('transactionsRoutes', () => {
  it('should export a Router instance', () => {
    expect(transactionsRoutes).toBeDefined()
    expect(transactionsRoutes).toBeInstanceOf(Router)
  })

  it('should register all expected routes', () => {
    const routes = transactionsRoutes.stack.map((layer) => ({
      method: Object.keys(layer.route.methods)[0].toUpperCase(),
      path: layer.route.path
    }))

    expect(routes).toHaveLength(8)

    expect(routes).toEqual(
      expect.arrayContaining([
        { method: 'POST', path: '/' },
        { method: 'GET', path: '/' },
        { method: 'GET', path: '/deleted' },
        { method: 'GET', path: '/deleted/:userId' },
        { method: 'PATCH', path: '/:id' },
        { method: 'DELETE', path: '/:id/hard' },
        { method: 'DELETE', path: '/:id' },
        { method: 'PATCH', path: '/:id/restore' }
      ])
    )
  })
})

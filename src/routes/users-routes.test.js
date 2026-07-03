/**
 * @jest-environment node
 */

jest.mock('../middlewares/auth.js', () => ({
  authMiddleware: jest.fn((req, res, next) => next())
}))
jest.mock('../middlewares/rate-limiter.js', () => ({
  createUserLimiter: jest.fn((req, res, next) => next())
}))

jest.mock('../factories/users/make-create-user-controller.js', () => ({
  makeCreateUserController: jest.fn(() => ({ handle: jest.fn() }))
}))
jest.mock('../factories/users/make-get-all-users-controller.js', () => ({
  makeGetAllUsersController: jest.fn(() => ({ handle: jest.fn() }))
}))
jest.mock('../factories/users/make-get-user-by-id-controller.js', () => ({
  makeGetUserByIdController: jest.fn(() => ({ handle: jest.fn() }))
}))
jest.mock('../factories/users/make-get-user-by-email-controller.js', () => ({
  makeGetUserByEmailController: jest.fn(() => ({ handle: jest.fn() }))
}))
jest.mock('../factories/users/make-update-user-controller.js', () => ({
  makeUpdateUserController: jest.fn(() => ({ handle: jest.fn() }))
}))
jest.mock('../factories/users/make-soft-delete-user-controller.js', () => ({
  makeSoftDeleteUserController: jest.fn(() => ({ handle: jest.fn() }))
}))
jest.mock('../factories/users/make-hard-delete-user-controller.js', () => ({
  makeHardDeleteUserController: jest.fn(() => ({ handle: jest.fn() }))
}))
jest.mock('../factories/users/make-get-deleted-users-controller.js', () => ({
  makeGetDeletedUsersController: jest.fn(() => ({ handle: jest.fn() }))
}))
jest.mock('../factories/users/make-get-user-balance-controller.js', () => ({
  makeGetUserBalanceController: jest.fn(() => ({ handle: jest.fn() }))
}))
jest.mock('../factories/users/make-restore-user-controller.js', () => ({
  makeRestoreUserController: jest.fn(() => ({ handle: jest.fn() }))
}))

import { Router } from 'express'
import { usersRoutes } from './users-routes.js'

describe('usersRoutes', () => {
  it('should export a Router instance', () => {
    expect(usersRoutes).toBeDefined()
    expect(usersRoutes).toBeInstanceOf(Router)
  })

  it('should register all expected routes', () => {
    const routes = usersRoutes.stack.map((layer) => ({
      method: Object.keys(layer.route.methods)[0].toUpperCase(),
      path: layer.route.path
    }))

    expect(routes).toHaveLength(10)

    expect(routes).toEqual(
      expect.arrayContaining([
        { method: 'GET', path: '/' },
        { method: 'POST', path: '/' },
        { method: 'GET', path: '/email/:email' },
        { method: 'GET', path: '/deleted' },
        { method: 'GET', path: '/:id/balance' },
        { method: 'DELETE', path: '/:id/hard' },
        { method: 'PATCH', path: '/:id/restore' },
        { method: 'GET', path: '/:id' },
        { method: 'PATCH', path: '/:id' },
        { method: 'DELETE', path: '/:id' }
      ])
    )
  })
})

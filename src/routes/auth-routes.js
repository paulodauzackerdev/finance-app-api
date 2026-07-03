import { Router } from 'express'

import { makeLoginController } from '../factories/auth/make-login-controller.js'
import { makeRefreshTokenController } from '../factories/auth/make-refresh-token-controller.js'
import { makeLogoutController } from '../factories/auth/make-logout-controller.js'

import { authMiddleware } from '../middlewares/auth.js'
import { loginLimiter, refreshLimiter } from '../middlewares/rate-limiter.js'

const authRoutes = Router()

const loginController = makeLoginController()
const refreshTokenController = makeRefreshTokenController()
const logoutController = makeLogoutController()

authRoutes.post('/login', loginLimiter, loginController.handle)
authRoutes.post('/refresh', refreshLimiter, refreshTokenController.handle)
authRoutes.post('/logout', authMiddleware, logoutController.handle)

export { authRoutes }

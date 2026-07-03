import { jwtHelper } from '../helpers/jwt.js'

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' })
  }

  const parts = authHeader.split(' ')

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Token error' })
  }

  const [scheme, token] = parts

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token malformatted' })
  }

  try {
    const decoded = jwtHelper.verify(token)

    req.userId = decoded.userId
    req.userRole = decoded.role

    return next()
  } catch {
    return res.status(401).json({ error: 'Token invalid or expired' })
  }
}

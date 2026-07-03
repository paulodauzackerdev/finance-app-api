import { z } from 'zod'

export const loginInputSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required')
})

export const refreshTokenInputSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
})

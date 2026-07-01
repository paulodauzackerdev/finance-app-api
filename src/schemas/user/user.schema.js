import { z } from 'zod'

export const userDatabaseSchema = z.object({
  id: z.string().uuid(),
  passwordHash: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),

  firstName: z
    .string()
    .min(2, 'First name must have at least 2 characters')
    .max(50, 'First name must have at most 50 characters')
    .regex(
      /^\p{L}+(?:\s+\p{L}+)*$/u,
      'Name can only contain letters and spaces'
    ),

  lastName: z
    .string()
    .min(2, 'Last name must have at least 2 characters')
    .max(50, 'Last name must have at most 50 characters')
    .regex(
      /^\p{L}+(?:\s+\p{L}+)*$/u,
      'Name can only contain letters and spaces'
    ),

  email: z.string().email('Invalid email format').toLowerCase(),

  isActive: z.boolean().default(true)
})

export const createUserInputSchema = z.object({
  firstName: userDatabaseSchema.shape.firstName,
  lastName: userDatabaseSchema.shape.lastName,
  email: userDatabaseSchema.shape.email,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must have at most 32 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character'
    )
})

export const updateUserInputSchema = createUserInputSchema
  .partial()
  .superRefine((data, ctx) => {
    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one field must be provided'
      })
    }
  })

export const userResponseSchema = userDatabaseSchema.pick({
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true
})

export const userIdSchema = z
  .string()
  .uuid('Invalid user ID format - must be a valid UUID')

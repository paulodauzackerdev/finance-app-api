import { z } from 'zod'

const transactionTypeEnum = z.enum(['income', 'expense', 'investment'], {
  errorMap: () => ({
    message: 'Type must be one of: income, expense, investment'
  })
})

export const createTransactionInputSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  name: z
    .string()
    .min(1, 'Transaction name is required')
    .max(100, 'Transaction name must have at most 100 characters'),
  amount: z
    .number()
    .positive('Amount must be greater than zero')
    .finite('Amount must be a finite number')
    .multipleOf(0.01, 'Amount must have at most 2 decimal places'),
  description: z
    .string()
    .max(500, 'Description must have at most 500 characters')
    .nullable()
    .optional(),
  type: transactionTypeEnum,
  transactionDate: z
    .string()
    .datetime({ offset: true })
    .optional()
    .default(() => new Date().toISOString())
})

export const updateTransactionInputSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Transaction name is required')
      .max(100, 'Transaction name must have at most 100 characters')
      .optional(),
    amount: z
      .number()
      .positive('Amount must be greater than zero')
      .finite('Amount must be a finite number')
      .multipleOf(0.01, 'Amount must have at most 2 decimal places')
      .optional(),
    description: z
      .string()
      .max(500, 'Description must have at most 500 characters')
      .nullable()
      .optional(),
    type: transactionTypeEnum.optional(),
    transactionDate: z.string().datetime({ offset: true }).optional()
  })
  .superRefine((data, ctx) => {
    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one field must be provided'
      })
    }
  })

export const transactionIdSchema = z
  .string()
  .uuid('Invalid transaction ID format - must be a valid UUID')

import {
  createTransactionInputSchema,
  updateTransactionInputSchema,
  transactionIdSchema
} from './transaction.schema.js'

describe('transactionIdSchema', () => {
  it('should accept a valid UUID', () => {
    const result = transactionIdSchema.parse(
      '550e8400-e29b-41d4-a716-446655440000'
    )

    expect(result).toBe('550e8400-e29b-41d4-a716-446655440000')
  })

  it('should reject invalid UUID format', () => {
    expect(() => transactionIdSchema.parse('not-a-uuid')).toThrow()
  })

  it('should reject empty string', () => {
    expect(() => transactionIdSchema.parse('')).toThrow()
  })
})

describe('createTransactionInputSchema', () => {
  const validInput = {
    userId: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Salary',
    amount: 5000,
    description: 'Monthly salary',
    type: 'income',
    transactionDate: '2026-06-01T00:00:00.000Z'
  }

  it('should accept valid transaction input', () => {
    const result = createTransactionInputSchema.parse(validInput)

    expect(result.userId).toBe(validInput.userId)
    expect(result.name).toBe(validInput.name)
    expect(result.amount).toBe(validInput.amount)
    expect(result.description).toBe(validInput.description)
    expect(result.type).toBe(validInput.type)
    expect(result.transactionDate).toBe(validInput.transactionDate)
  })

  it('should set default transactionDate when not provided', () => {
    const { transactionDate: _transactionDate, ...inputWithoutDate } =
      validInput

    const result = createTransactionInputSchema.parse(inputWithoutDate)
    void _transactionDate

    expect(result.transactionDate).toBeDefined()
    expect(typeof result.transactionDate).toBe('string')
  })

  it('should accept input without optional description', () => {
    const { description: _description, ...inputWithoutDesc } = validInput

    const result = createTransactionInputSchema.parse(inputWithoutDesc)
    void _description

    expect(result.description).toBeUndefined()
  })

  it('should accept description as null', () => {
    const result = createTransactionInputSchema.parse({
      ...validInput,
      description: null
    })

    expect(result.description).toBeNull()
  })

  it('should reject empty name', () => {
    expect(() =>
      createTransactionInputSchema.parse({ ...validInput, name: '' })
    ).toThrow('Transaction name is required')
  })

  it('should reject name longer than 100 characters', () => {
    expect(() =>
      createTransactionInputSchema.parse({
        ...validInput,
        name: 'a'.repeat(101)
      })
    ).toThrow('at most 100 characters')
  })

  it('should reject invalid userId', () => {
    expect(() =>
      createTransactionInputSchema.parse({ ...validInput, userId: 'bad-id' })
    ).toThrow('Invalid user ID format')
  })

  it('should reject non-positive amount', () => {
    expect(() =>
      createTransactionInputSchema.parse({ ...validInput, amount: 0 })
    ).toThrow('Amount must be greater than zero')
  })

  it('should reject negative amount', () => {
    expect(() =>
      createTransactionInputSchema.parse({ ...validInput, amount: -100 })
    ).toThrow('Amount must be greater than zero')
  })

  it('should reject Infinity amount', () => {
    expect(() =>
      createTransactionInputSchema.parse({ ...validInput, amount: Infinity })
    ).toThrow('received number')
  })

  it('should reject amount with more than 2 decimal places', () => {
    expect(() =>
      createTransactionInputSchema.parse({ ...validInput, amount: 50.123 })
    ).toThrow('at most 2 decimal places')
  })

  it('should reject invalid transaction type', () => {
    expect(() =>
      createTransactionInputSchema.parse({ ...validInput, type: 'invalid' })
    ).toThrow('expected one of')
  })

  it('should accept all valid transaction types', () => {
    const types = ['income', 'expense', 'investment']

    for (const type of types) {
      const result = createTransactionInputSchema.parse({
        ...validInput,
        type
      })

      expect(result.type).toBe(type)
    }
  })

  it('should reject description longer than 500 characters', () => {
    expect(() =>
      createTransactionInputSchema.parse({
        ...validInput,
        description: 'a'.repeat(501)
      })
    ).toThrow('at most 500 characters')
  })

  it('should reject invalid transactionDate format', () => {
    expect(() =>
      createTransactionInputSchema.parse({
        ...validInput,
        transactionDate: 'invalid-date'
      })
    ).toThrow()
  })
})

describe('updateTransactionInputSchema', () => {
  const validUpdate = {
    name: 'Updated Salary',
    amount: 6000
  }

  it('should accept valid partial update', () => {
    const result = updateTransactionInputSchema.parse(validUpdate)

    expect(result.name).toBe('Updated Salary')
    expect(result.amount).toBe(6000)
  })

  it('should accept a single field update', () => {
    const result = updateTransactionInputSchema.parse({ name: 'New name' })

    expect(result.name).toBe('New name')
  })

  it('should reject empty update (no fields)', () => {
    expect(() => updateTransactionInputSchema.parse({})).toThrow(
      'At least one field must be provided'
    )
  })

  it('should accept type update', () => {
    const result = updateTransactionInputSchema.parse({ type: 'expense' })

    expect(result.type).toBe('expense')
  })

  it('should accept description set to null', () => {
    const result = updateTransactionInputSchema.parse({ description: null })

    expect(result.description).toBeNull()
  })

  it('should accept transactionDate update', () => {
    const result = updateTransactionInputSchema.parse({
      transactionDate: '2026-07-01T00:00:00.000Z'
    })

    expect(result.transactionDate).toBe('2026-07-01T00:00:00.000Z')
  })

  it('should reject invalid type in update', () => {
    expect(() =>
      updateTransactionInputSchema.parse({ type: 'unknown' })
    ).toThrow()
  })
})

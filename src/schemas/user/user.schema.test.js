import {
  createUserInputSchema,
  updateUserInputSchema,
  userIdSchema,
  userDatabaseSchema,
  userResponseSchema
} from './user.schema.js'

describe('userIdSchema', () => {
  it('should accept a valid UUID', () => {
    const result = userIdSchema.parse('550e8400-e29b-41d4-a716-446655440000')

    expect(result).toBe('550e8400-e29b-41d4-a716-446655440000')
  })

  it('should reject invalid UUID format', () => {
    expect(() => userIdSchema.parse('not-a-uuid')).toThrow(
      'Invalid user ID format'
    )
  })

  it('should reject empty string', () => {
    expect(() => userIdSchema.parse('')).toThrow()
  })
})

describe('createUserInputSchema', () => {
  const validInput = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'StrongPass1!'
  }

  it('should accept valid input', () => {
    const result = createUserInputSchema.parse(validInput)

    expect(result.firstName).toBe('John')
    expect(result.lastName).toBe('Doe')
    expect(result.email).toBe('john@example.com')
    expect(result.password).toBe('StrongPass1!')
  })

  it('should lowercase email', () => {
    const result = createUserInputSchema.parse({
      ...validInput,
      email: 'JOHN@Example.COM'
    })

    expect(result.email).toBe('john@example.com')
  })

  describe('firstName validation', () => {
    it('should reject firstName shorter than 2 characters', () => {
      expect(() =>
        createUserInputSchema.parse({ ...validInput, firstName: 'A' })
      ).toThrow('at least 2 characters')
    })

    it('should reject firstName longer than 50 characters', () => {
      expect(() =>
        createUserInputSchema.parse({
          ...validInput,
          firstName: 'A'.repeat(51)
        })
      ).toThrow('at most 50 characters')
    })
  })

  describe('lastName validation', () => {
    it('should reject lastName shorter than 2 characters', () => {
      expect(() =>
        createUserInputSchema.parse({ ...validInput, lastName: 'B' })
      ).toThrow('at least 2 characters')
    })

    it('should reject lastName longer than 50 characters', () => {
      expect(() =>
        createUserInputSchema.parse({
          ...validInput,
          lastName: 'B'.repeat(51)
        })
      ).toThrow('at most 50 characters')
    })
  })

  describe('email validation', () => {
    it('should reject invalid email', () => {
      expect(() =>
        createUserInputSchema.parse({ ...validInput, email: 'invalid-email' })
      ).toThrow('Invalid email format')
    })

    it('should reject empty email', () => {
      expect(() =>
        createUserInputSchema.parse({ ...validInput, email: '' })
      ).toThrow('Invalid email format')
    })
  })

  describe('password validation', () => {
    it('should reject password shorter than 8 characters', () => {
      expect(() =>
        createUserInputSchema.parse({
          ...validInput,
          password: 'Sh0rt!'
        })
      ).toThrow('at least 8 characters')
    })

    it('should reject password longer than 32 characters', () => {
      expect(() =>
        createUserInputSchema.parse({
          ...validInput,
          password: 'LongPass123!' + 'A'.repeat(30)
        })
      ).toThrow('at most 32 characters')
    })

    it('should require at least one uppercase letter', () => {
      expect(() =>
        createUserInputSchema.parse({
          ...validInput,
          password: 'lowercase1!'
        })
      ).toThrow('at least one uppercase letter')
    })

    it('should require at least one lowercase letter', () => {
      expect(() =>
        createUserInputSchema.parse({
          ...validInput,
          password: 'UPPERCASE1!'
        })
      ).toThrow('at least one lowercase letter')
    })

    it('should require at least one number', () => {
      expect(() =>
        createUserInputSchema.parse({
          ...validInput,
          password: 'NoNumbers!'
        })
      ).toThrow('at least one number')
    })

    it('should require at least one special character', () => {
      expect(() =>
        createUserInputSchema.parse({
          ...validInput,
          password: 'NoSpecial1'
        })
      ).toThrow('at least one special character')
    })
  })
})

describe('updateUserInputSchema', () => {
  it('should accept a single field update', () => {
    const result = updateUserInputSchema.parse({ firstName: 'Jane' })

    expect(result.firstName).toBe('Jane')
  })

  it('should accept email update', () => {
    const result = updateUserInputSchema.parse({
      email: 'jane@example.com'
    })

    expect(result.email).toBe('jane@example.com')
  })

  it('should reject empty update', () => {
    expect(() => updateUserInputSchema.parse({})).toThrow(
      'At least one field must be provided'
    )
  })

  it('should accept multiple field update', () => {
    const result = updateUserInputSchema.parse({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com'
    })

    expect(result).toEqual({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com'
    })
  })

  it('should validate password rules when password is provided', () => {
    expect(() => updateUserInputSchema.parse({ password: 'weak' })).toThrow()
  })
})

describe('userDatabaseSchema', () => {
  const validUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    passwordHash: '$2b$12$hashvalue',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    deletedAt: null
  }

  it('should accept valid user data', () => {
    const result = userDatabaseSchema.parse(validUser)

    expect(result.id).toBe(validUser.id)
    expect(result.deletedAt).toBeNull()
  })

  it('should accept deletedAt as a Date', () => {
    const result = userDatabaseSchema.parse({
      ...validUser,
      deletedAt: new Date('2026-06-01')
    })

    expect(result.deletedAt).toBeInstanceOf(Date)
  })
})

describe('userResponseSchema', () => {
  it('should not include passwordHash', () => {
    const result = userResponseSchema.keyof().options

    expect(result).not.toContain('passwordHash')
  })
})

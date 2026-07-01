import { removePasswordFromUser } from './user.js'

describe('removePasswordFromUser', () => {
  it('should return null when user is null', () => {
    const result = removePasswordFromUser(null)

    expect(result).toBeNull()
  })

  it('should return null when user is undefined', () => {
    const result = removePasswordFromUser(undefined)

    expect(result).toBeNull()
  })

  it('should remove passwordHash from user object', () => {
    const user = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      firstName: 'Sarah',
      lastName: 'Connor',
      email: 'sarah@resistance.com',
      passwordHash: 'hashed_password_value',
      isActive: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01')
    }

    const result = removePasswordFromUser(user)

    expect(result).not.toHaveProperty('passwordHash')
    expect(result.id).toBe(user.id)
    expect(result.firstName).toBe(user.firstName)
    expect(result.lastName).toBe(user.lastName)
    expect(result.email).toBe(user.email)
    expect(result.isActive).toBe(user.isActive)
    expect(result.createdAt).toBe(user.createdAt)
    expect(result.updatedAt).toBe(user.updatedAt)
  })

  it('should not mutate the original user object', () => {
    const user = {
      id: 'uuid',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      passwordHash: 'secret'
    }

    const result = removePasswordFromUser(user)

    expect(user).toHaveProperty('passwordHash')
    expect(result).not.toHaveProperty('passwordHash')
  })

  it('should handle user object without passwordHash gracefully', () => {
    const user = {
      id: 'uuid',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    }

    const result = removePasswordFromUser(user)

    expect(result).toEqual(user)
  })
})

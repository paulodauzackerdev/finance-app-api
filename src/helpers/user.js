export const normalizeEmail = (email) => {
  if (typeof email !== 'string') return ''
  return email.trim().toLowerCase()
}

export const removePasswordFromUser = (user) => {
  if (!user) return null

  const { password_hash: passwordHash, ...userWithoutPassword } = user

  void passwordHash

  return userWithoutPassword
}

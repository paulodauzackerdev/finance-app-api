export const normalizeEmail = (email) => {
  return email.trim().toLowerCase()
}

export const removePasswordFromUser = (user) => {
  if (!user) return null

  const { password_hash: passwordHash, ...userWithoutPassword } = user

  void passwordHash

  return userWithoutPassword
}

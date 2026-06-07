export const removePasswordFromUser = (user) => {
  if (!user) return null

  const { password_hash: passwordHash, ...userWithoutPassword } = user

  void passwordHash

  return userWithoutPassword
}

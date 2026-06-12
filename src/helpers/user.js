export const removePasswordFromUser = (user) => {
  if (!user) return null

  const { passwordHash: passwordHash, ...userWithoutPassword } = user

  void passwordHash

  return userWithoutPassword
}

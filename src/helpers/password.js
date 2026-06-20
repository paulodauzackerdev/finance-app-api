import bcrypt from 'bcrypt'

export const passwordHelper = {
  hash: async (password) => {
    return bcrypt.hash(password, 12)
  },
  compare: async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash)
  }
}

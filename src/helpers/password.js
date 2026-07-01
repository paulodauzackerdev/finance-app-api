import bcrypt from 'bcrypt'

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10)

export const passwordHelper = {
  hash: async (password) => {
    return bcrypt.hash(password, SALT_ROUNDS)
  },
  compare: async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash)
  }
}

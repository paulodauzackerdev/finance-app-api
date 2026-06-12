import { UserRepository } from '../../repositories/postgres/postgres-user-repository.js'

export const makeUserRepository = () => {
  return new UserRepository()
}

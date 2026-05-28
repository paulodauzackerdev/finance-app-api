import { UserRepository } from '../../repositories/postgres/postgres-user-repository.js'

// import { UserRepository } from '../../repositories/mongodb/user-repository.js'

// import { UserRepository } from '../../repositories/fake/user-repository.js'

export const makeUserRepository = () => {
  return new UserRepository()
}

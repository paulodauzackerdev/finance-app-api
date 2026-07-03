import { RefreshTokenRepository } from '../../repositories/postgres/postgres-refresh-token-repository.js'

export const makeRefreshTokenRepository = () => {
  return new RefreshTokenRepository()
}

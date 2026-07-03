import { ok } from '../../helpers/http.js'

export class RefreshTokenController {
  constructor(refreshTokenUseCase) {
    this.refreshTokenUseCase = refreshTokenUseCase
  }

  handle = async (req, res, next) => {
    try {
      const result = await this.refreshTokenUseCase.execute(req.body)

      return ok(res, result)
    } catch (error) {
      next(error)
    }
  }
}

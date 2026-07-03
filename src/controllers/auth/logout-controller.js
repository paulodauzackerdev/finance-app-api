import { ok } from '../../helpers/http.js'

export class LogoutController {
  constructor(logoutUseCase) {
    this.logoutUseCase = logoutUseCase
  }

  handle = async (req, res, next) => {
    try {
      const result = await this.logoutUseCase.execute(req.body)

      return ok(res, result)
    } catch (error) {
      next(error)
    }
  }
}

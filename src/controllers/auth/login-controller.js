import { ok } from '../../helpers/http.js'

export class LoginController {
  constructor(loginUseCase) {
    this.loginUseCase = loginUseCase
  }

  handle = async (req, res, next) => {
    try {
      const result = await this.loginUseCase.execute(req.body)

      return ok(res, result)
    } catch (error) {
      next(error)
    }
  }
}

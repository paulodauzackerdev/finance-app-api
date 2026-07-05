import { ok } from '../../helpers/http.js'

export class GetUserBalanceController {
  constructor(getUserBalanceUseCase) {
    this.getUserBalanceUseCase = getUserBalanceUseCase
  }

  handle = async (req, res, next) => {
    try {
      const { id } = req.params
      const balance = await this.getUserBalanceUseCase.execute(
        id,
        req.userId,
        req.userRole
      )
      return ok(res, balance)
    } catch (error) {
      next(error)
    }
  }
}

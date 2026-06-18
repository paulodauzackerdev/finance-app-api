import { ok } from '../../helpers/http.js'

export class HardDeleteUserController {
  constructor(hardDeleteUserUseCase) {
    this.hardDeleteUserUseCase = hardDeleteUserUseCase
  }

  handle = async (req, res, next) => {
    try {
      const { id } = req.params
      const hardDeletedUser = await this.hardDeleteUserUseCase.execute(id)
      return ok(res, {
        message: 'User permanently deleted successfully',
        user: hardDeletedUser
      })
    } catch (error) {
      next(error)
    }
  }
}

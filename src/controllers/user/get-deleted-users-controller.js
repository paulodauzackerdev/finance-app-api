import { ok } from '../../helpers/http.js'

export class GetDeletedUsersController {
  constructor(getDeletedUsersUseCase) {
    this.getDeletedUsersUseCase = getDeletedUsersUseCase
  }

  handle = async (req, res, next) => {
    try {
      const deletedUsers = await this.getDeletedUsersUseCase.execute()
      return ok(res, deletedUsers)
    } catch (error) {
      next(error)
    }
  }
}

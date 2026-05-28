import { created } from '../../helpers/http.js'

export class CreateUserController {
  constructor(createUserUseCase) {
    this.createUserUseCase = createUserUseCase
  }

  handle = async (req, res) => {
    const user = await this.createUserUseCase.execute(req.body)

    return created(res, user)
  }
}

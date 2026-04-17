import { PostgresHelper } from '../../db/postgres/helper.js'

export class UserRepository {
  async findByEmail(email) {
    const result = await PostgresHelper.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    return result[0]
  }

  async create({ first_name, last_name, email, password }) {
    const result = await PostgresHelper.query(
      `INSERT INTO users 
      (first_name, last_name, email, password) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, first_name, last_name, email, created_at, updated_at`,
      [first_name, last_name, email, password]
    )

    return result[0]
  }
}

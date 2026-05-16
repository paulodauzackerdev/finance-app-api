import { PostgresHelper } from '../../db/postgres/helper.js'

export class GetUserByEmailRepository {
  async findByEmail(email) {
    const normalizedEmail = email.trim().toLowerCase()
    const result = await PostgresHelper.query(
      `
    SELECT
      id,
      first_name,
      last_name,
      email,
      created_at
    FROM users
    WHERE email = $1
  `,
      [normalizedEmail]
    )
    return result[0] || null
  }
}

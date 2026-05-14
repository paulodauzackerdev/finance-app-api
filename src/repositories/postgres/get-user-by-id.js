import { PostgresHelper } from '../../db/postgres/helper.js'

export class GetUserByIdRepository {
  async execute(userId) {
    const result = await PostgresHelper.query(
      `
        SELECT
          id,
          first_name,
          last_name,
          email,
          created_at
        FROM users
        WHERE id = $1
      `,
      [userId]
    )

    return result[0]
  }
}

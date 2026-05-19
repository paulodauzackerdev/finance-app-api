import { PostgresHelper } from '../../db/postgres/helper.js'

export class UserRepository {
  async findAll() {
    const result = await PostgresHelper.query(`
    SELECT
      id,
      first_name,
      last_name,
      email,
      is_active,
      created_at,
      updated_at
    FROM users
    ORDER BY created_at DESC
  `)

    return result
  }
  async findById(userId) {
    const result = await PostgresHelper.query(
      `
        SELECT
          id,
          first_name,
          last_name,
          email,
          is_active,
          created_at,
          updated_at
        FROM users
        WHERE id = $1
      `,
      [userId]
    )

    return result[0] || null
  }

  async findByEmail(email) {
    const result = await PostgresHelper.query(
      `
        SELECT
          id,
          first_name,
          last_name,
          email,
          is_active,
          created_at,
          updated_at
        FROM users
        WHERE email = $1
      `,
      [email]
    )

    return result[0] || null
  }

  async create({ first_name, last_name, email, password_hash }) {
    const result = await PostgresHelper.query(
      `
        INSERT INTO users (
          first_name,
          last_name,
          email,
          password_hash
        )
        VALUES ($1, $2, $3, $4)

        RETURNING
          id,
          first_name,
          last_name,
          email,
          is_active,
          created_at,
          updated_at
      `,
      [first_name, last_name, email, password_hash]
    )

    return result[0]
  }

  async update(userId, updateParams) {
    if (!updateParams || Object.keys(updateParams).length === 0) {
      throw new Error('No fields to update')
    }

    const updateFields = []
    const updateValues = []

    for (const [key, value] of Object.entries(updateParams)) {
      updateFields.push(`${key} = $${updateValues.length + 1}`)
      updateValues.push(value)
    }

    updateValues.push(userId)

    const query = `
    UPDATE users
    SET ${updateFields.join(', ')}
    WHERE id = $${updateValues.length}
    RETURNING
      id,
      first_name,
      last_name,
      email,
      is_active,
      created_at,
      updated_at
  `

    const result = await PostgresHelper.query(query, updateValues)
    return result[0] || null
  }

  async delete(userId) {
    const result = await PostgresHelper.query(
      `
        DELETE FROM users
        WHERE id = $1

        RETURNING
          id,
          first_name,
          last_name,
          email,
          is_active,
          created_at,
          updated_at
      `,
      [userId]
    )

    return result[0] || null
  }
}

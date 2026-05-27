import { PostgresHelper } from '../../db/postgres/helper.js'

export class TransactionRepository {
  async findAll() {
    const result = await PostgresHelper.query(
      `
        SELECT
          id,
          user_id,
          name,
          amount,
          description,
          type,
          transaction_date,
          created_at,
          updated_at
        FROM transactions
        ORDER BY transaction_date DESC
      `
    )

    return result
  }

  async findById(transactionId) {
    const result = await PostgresHelper.query(
      `
        SELECT
          id,
          user_id,
          name,
          amount,
          description,
          type,
          transaction_date,
          created_at,
          updated_at
        FROM transactions
        WHERE id = $1
      `,
      [transactionId]
    )

    return result[0] || null
  }

  async findByUserId(userId) {
    const result = await PostgresHelper.query(
      `
        SELECT
          id,
          user_id,
          name,
          amount,
          description,
          type,
          transaction_date,
          created_at,
          updated_at
        FROM transactions
        WHERE user_id = $1
        ORDER BY transaction_date DESC
      `,
      [userId]
    )

    return result
  }

  async create({ user_id, name, amount, description, type, transaction_date }) {
    const result = await PostgresHelper.query(
      `
        INSERT INTO transactions (
          user_id,
          name,
          amount,
          description,
          type,
          transaction_date
        )

        VALUES ($1, $2, $3, $4, $5, $6)

        RETURNING
          id,
          user_id,
          name,
          amount,
          description,
          type,
          transaction_date,
          created_at,
          updated_at
      `,
      [user_id, name, amount, description, type, transaction_date]
    )

    return result[0]
  }

  async update(transactionId, updateParams) {
    if (!updateParams || Object.keys(updateParams).length === 0) {
      throw new Error('No fields to update')
    }

    const updateFields = []
    const updateValues = []

    for (const [key, value] of Object.entries(updateParams)) {
      updateFields.push(`${key} = $${updateValues.length + 1}`)

      updateValues.push(value)
    }

    updateValues.push(transactionId)

    const query = `
      UPDATE transactions
      SET ${updateFields.join(', ')}

      WHERE id = $${updateValues.length}

      RETURNING
        id,
        user_id,
        name,
        amount,
        description,
        type,
        transaction_date,
        created_at,
        updated_at
    `

    const result = await PostgresHelper.query(query, updateValues)

    return result[0] || null
  }

  async delete(transactionId) {
    const result = await PostgresHelper.query(
      `
        DELETE FROM transactions
        WHERE id = $1

        RETURNING
          id,
          user_id,
          name,
          amount,
          description,
          type,
          transaction_date,
          created_at,
          updated_at
      `,
      [transactionId]
    )

    return result[0] || null
  }
}

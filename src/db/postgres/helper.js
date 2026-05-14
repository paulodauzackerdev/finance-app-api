import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB,

  max: 10,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000
})

export const PostgresHelper = {
  query: async (query, params) => {
    try {
      const result = await pool.query(query, params)

      return result.rows
    } catch (error) {
      console.error('Postgres error:', error)

      throw error
    }
  }
}

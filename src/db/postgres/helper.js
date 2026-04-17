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
    const client = await pool.connect()

    try {
      const results = await client.query(query, params)
      return results.rows
    } finally {
      client.release()
    }
  }
}

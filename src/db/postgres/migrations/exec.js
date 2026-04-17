import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from '../helper.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const execMigrations = async () => {
  const client = await pool.connect()

  try {
    const filePath = path.join(__dirname, '01-init.sql')
    const script = fs.readFileSync(filePath, 'utf-8')

    await client.query('BEGIN')
    await client.query(script)
    await client.query('COMMIT')

    console.log('Migrations executadas com sucesso!')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Erro ao executar migrations:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

execMigrations()

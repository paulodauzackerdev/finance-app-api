import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from '../helper.js'

const migrationsIgnore = 2 // Ignorar SQL a partir do número
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const execMigrations = async () => {
  const client = await pool.connect()

  try {
    const migrationsPath = __dirname
    const files = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith('.sql'))
      .filter((file) => {
        const number = parseInt(file.split('-')[0])
        return number > migrationsIgnore
      })
      .sort()

    await client.query('BEGIN')

    for (const file of files) {
      const filePath = path.join(migrationsPath, file)
      const script = fs.readFileSync(filePath, 'utf-8')

      console.log(`🚀 Executando: ${file}`)
      await client.query(script)
    }

    await client.query('COMMIT')

    console.log('✅ Todas migrations executadas com sucesso!')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('❌ Erro ao executar migrations:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

execMigrations()

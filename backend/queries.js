import { Pool } from 'pg'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config } from 'dotenv'
import bcrypt from 'bcrypt'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, './docker/.env') })

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASS,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DB,
})

const getBoardData = async (boardId) => {
  try {
    const res = await pool.query('SELECT * FROM board WHERE id = $1', [boardId])

    if (res.rows.length === 0) {
      return null
    }

    return res.rows[0]
  }
  catch (err) {
    console.error('❌ Ошибка получения данных из представления board:', err.stack)
    throw err
  }
}

const findUserByEmail = async (email) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    return result.rows[0] || null
  } catch (error) {
    console.error('Ошибка при поиске пользователя:', error)
    throw error
  }
}

const verifyPassword = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword)
}

export { getBoardData, findUserByEmail, verifyPassword, pool }

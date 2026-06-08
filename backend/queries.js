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
      'SELECT id, name, email, password FROM users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  } catch (err) {
    console.error('❌ Ошибка выполнения запроса findUserByEmail в БД:', err.stack)
    throw err
  }
}

const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword)
    return isMatch
  } catch (err) {
    console.error('❌ Ошибка при сравнении паролей bcrypt:', err.stack)
    return false
  }
}

const createUser = async (name, email, hashedPassword) => {
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    )
    return result.rows[0] // ИСПРАВЛЕНО: добавили [0]
  } catch (err) {
    console.error('❌ Ошибка выполнения запроса createUser в БД:', err.stack)
    throw err
  }
}

const updateUser = async (userId, column, value) => {
  try {
    const result = await pool.query(
      `UPDATE users SET ${column} = $1 WHERE id = $2 RETURNING id, name, email`,
      [value, userId]
    )
    return result.rows[0] // ИСПРАВЛЕНО: добавили [0]
  } catch (err) {
    console.error('❌ Ошибка выполнения запроса updateUser in БД:', err.stack)
    throw err
  }
}

const deleteUser = async (userId) => {
  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [userId],
    )

    return result.rowCount > 0
  }
  catch (err) {
    console.error('❌ Ошибка выполнения запроса deleteUser в БД:', err.stack)
    throw err
  }
}

export { getBoardData, findUserByEmail, verifyPassword, createUser, updateUser, deleteUser, pool }

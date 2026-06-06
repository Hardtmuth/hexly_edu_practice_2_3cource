import { Pool } from 'pg'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config } from 'dotenv'

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
    console.log('Данные из представления board:', res.rows)
    return res.rows
  }
  catch (err) {
    console.error('❌ Ошибка получения даннх из представления board}:', err.stack)
  }
}

export { getBoardData, pool }

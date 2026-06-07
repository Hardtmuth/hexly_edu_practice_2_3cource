import fastify from 'fastify'
import jwt from 'jsonwebtoken'
import { pool, getBoardData, findUserByEmail, verifyPassword } from './queries.js'

const apiPath = '/api/v1'
const getPath = keyword => [apiPath, keyword].join('/')

const server = () => {
  const app = fastify({
    logger: true,
  })

  app.register(import('@fastify/postgres'), {
    client: pool,
  })

  app.get('/', () => {
    return { hello: 'world' }
  })

  app.post(getPath('auth/login'), async (request, reply) => {
    try {
      const { email, password } = request.body

      const user = await findUserByEmail(email)
      if (!user) {
        return reply.status(401).send({
          error: 'Пользователь не найден'
        })
      }

      const isPasswordValid = await verifyPassword(password, user.password)
      if (!isPasswordValid) {
        return reply.status(401).send({
          error: 'Неверный пароль'
        })
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email
        },
        process.env.JWT_SECRET || 'secret-key',
        { expiresIn: '24h' }
      );

      reply.send({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      })
    } catch (error) {
      app.log.error(error)
      reply.status(500).send({ error: 'Внутренняя ошибка сервера' })
    }
  })

  app.get(getPath('user/:id/list'), async (request, reply) => {
    const { id } = request.params
    const projects = await pool.query('SELECT id, name, description FROM projects WHERE owner_id = $1', [id])
    reply.send({ projects: projects.rows })
  })

  app.get(getPath('board/:id'), async (request, reply) => {
    try {
      const { id } = request.params
      const boardData = await getBoardData(id)

      if (!boardData) {
        return reply.status(404).send({ error: 'Доска не найдена' })
      }

      reply.send(boardData)
    } catch (error) {
      reply.status(500).send({ error: 'Ошибка сервера при получении доски' })
    }
  })

  return app
}

const port = 3000

server().listen({ port })

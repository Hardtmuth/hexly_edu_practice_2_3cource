import fastify from 'fastify'
import { pool, getBoardData } from './queries.js'

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

  app.get(getPath('board/:id'), async (request, reply) => {
    const { id } = request.params
    const boardData = await getBoardData(id)
    reply.send(boardData)
  })

  return app
}

const port = 3000

server().listen({ port })

import fastify from 'fastify'
import { pool } from './queries.js'

import { registerStatic } from './plugins/static.js'
import { registerPostgres } from './plugins/postgres.js'

import { registerAuthRoutes } from './routes/auth.js'
import { registerProjectRoutes } from './routes/projects.js'
import { registerColumnRoutes } from './routes/columns.js'
import { registerTaskRoutes } from './routes/tasks.js'
import { registerBoardRoutes } from './routes/boards.js'

const server = () => {
  const app = fastify({ logger: true })

  registerStatic(app)
  registerPostgres(app, pool)

  app.setNotFoundHandler((request, reply) => {
    reply.sendFile('index.html')
  })

  app.get('/', () => ({ hello: 'world' }))

  registerAuthRoutes(app)
  registerProjectRoutes(app)
  registerColumnRoutes(app)
  registerTaskRoutes(app)
  registerBoardRoutes(app)

  return app
}

const port = 3000

server().listen({ port }, (err) => {
  if (err) throw err
  console.log(`Server listening on port ${port}`)
})

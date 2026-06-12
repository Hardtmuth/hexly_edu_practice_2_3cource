export const registerPostgres = (app, pool) => {
  app.register(import('@fastify/postgres'), {
    client: pool,
  })
}

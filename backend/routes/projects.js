import { pool } from '../queries.js'
import { getPath } from '../utils/pathUtils.js'

export const registerProjectRoutes = (app) => {
  app.get(getPath('user/:id/list'), async (request, reply) => {
    const { id } = request.params

    if (id === 'undefined' || isNaN(Number(id))) {
      return reply.status(400).send({ error: 'Некорректный идентификатор пользователя' })
    }

    try {
      const projects = await pool.query('SELECT id, name, description FROM projects WHERE owner_id = $1', [id])
      reply.send({ projects: projects.rows })
    }
    catch (error) {
      app.log.error(error)
      reply.status(500).send({ error: 'Ошибка базы данных при получении проектов' })
    }
  })

  app.post(getPath('projects'), async (request, reply) => {
    try {
      const { userId, name, description } = request.body

      const result = await pool.query(
        'INSERT INTO projects (owner_id, name, description) VALUES ($1, $2, $3) RETURNING id, name, description',
        [userId, name, description],
      )

      reply.status(201).send({ success: true, project: result.rows[0] })
    }
    catch {
      reply.status(500).send({ error: 'Не удалось создать проект' })
    }
  })

  app.put(getPath('projects/:id'), async (request, reply) => {
    try {
      const { id } = request.params
      const { name, description } = request.body

      const result = await pool.query(
        'UPDATE projects SET name = $1, description = $2 WHERE id = $3 RETURNING id, name, description',
        [name, description, id],
      )

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Проект не найден' })
      }

      reply.send({ success: true, project: result.rows[0] })
    }
    catch {
      reply.status(500).send({ error: 'Не удалось обновить проект' })
    }
  })

  app.delete(getPath('projects/:id'), async (request, reply) => {
    try {
      const { id } = request.params

      const result = await pool.query(
        'DELETE FROM projects WHERE id = $1 RETURNING id',
        [id],
      )

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Проект не найден' })
      }

      reply.send({ success: true, projectId: parseInt(id, 10) })
    }
    catch {
      reply.status(500).send({ error: 'Не удалось удалить проект' })
    }
  })
}

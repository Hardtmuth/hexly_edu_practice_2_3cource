import { pool } from '../queries.js'
import { getPath } from '../utils/pathUtils.js'

export const registerColumnRoutes = (app) => {
  app.post(getPath('columns'), async (request, reply) => {
    try {
      const { projectId, name } = request.body

      const result = await pool.query(
        `INSERT INTO columns (project_id, name, position)
         VALUES ($1, $2, (SELECT COALESCE(MAX(position), 0) + 1 FROM columns WHERE project_id = $1))
         RETURNING id, name, position`,
        [projectId, name],
      )

      const newColumn = {
        ...result.rows[0],
        tasks: [],
      }

      reply.status(201).send({ success: true, column: newColumn })
    }
    catch (error) {
      app.log.error(error)
      reply.status(500).send({ error: 'Не удалось создать колонку' })
    }
  })

  app.delete(getPath('columns/:id'), async (request, reply) => {
    const client = await pool.connect()
    try {
      const { id } = request.params

      await client.query('BEGIN')

      const colRes = await client.query('SELECT project_id, position FROM columns WHERE id = $1', [id])

      if (colRes.rows.length === 0) {
        await client.query('ROLLBACK')
        return reply.status(404).send({ error: 'Колонка не найдена' })
      }

      const { project_id, position } = colRes.rows[0]

      await client.query('DELETE FROM columns WHERE id = $1', [id])

      await client.query(
        'UPDATE columns SET position = position - 1 WHERE project_id = $1 AND position > $2',
        [project_id, position],
      )

      await client.query('COMMIT')
      reply.send({ success: true, columnId: parseInt(id, 10) })
    }
    catch (error) {
      await client.query('ROLLBACK')
      app.log.error(error)
      reply.status(500).send({ error: 'Не удалось удалить колонку' })
    }
    finally {
      client.release()
    }
  })

  app.patch(getPath('columns/:id/rename'), async (request, reply) => {
    try {
      const { id } = request.params
      const { name } = request.body
      await pool.query('UPDATE columns SET name = $1 WHERE id = $2', [name, id])
      reply.send({ success: true, columnId: parseInt(id, 10), name })
    }
    catch {
      reply.status(500).send({ error: 'Не удалось переименовать колонку' })
    }
  })

  app.put(getPath('columns/:id/move'), async (request, reply) => {
    const client = await pool.connect()
    try {
      const { id } = request.params
      const { direction } = request.body // left, right

      await client.query('BEGIN')

      const currentRes = await client.query('SELECT project_id, position FROM columns WHERE id = $1', [id])
      if (currentRes.rows.length === 0) return reply.status(404).send({ error: 'Колонка не найдена' })

      const { project_id, position } = currentRes.rows[0]
      const targetPosition = direction === 'left' ? position - 1 : position + 1

      await client.query(
        'UPDATE columns SET position = $1 WHERE project_id = $2 AND position = $3',
        [position, project_id, targetPosition],
      )

      await client.query('UPDATE columns SET position = $1 WHERE id = $2', [targetPosition, id])

      await client.query('COMMIT')
      reply.send({ success: true, columnId: parseInt(id, 10), direction })
    }
    catch {
      await client.query('ROLLBACK')
      reply.status(500).send({ error: 'Не удалось переместить колонку' })
    }
    finally {
      client.release()
    }
  })

  app.post(getPath('columns/insert'), async (request, reply) => {
    const client = await pool.connect()
    try {
      const { referenceColumnId, direction, name } = request.body

      await client.query('BEGIN')

      const refRes = await client.query('SELECT project_id, position FROM columns WHERE id = $1', [referenceColumnId])
      const { project_id, position } = refRes.rows[0]

      const insertPosition = direction === 'left' ? position : position + 1

      await client.query(
        'UPDATE columns SET position = position + 1 WHERE project_id = $1 AND position >= $2',
        [project_id, insertPosition],
      )

      const result = await client.query(
        'INSERT INTO columns (project_id, name, position) VALUES ($1, $2, $3) RETURNING id, name, position',
        [project_id, name, insertPosition],
      )

      await client.query('COMMIT')
      reply.status(201).send({ success: true, column: { ...result.rows[0], tasks: [] } })
    }
    catch {
      await client.query('ROLLBACK')
      reply.status(500).send({ error: 'Не удалось вставить колонку' })
    }
    finally {
      client.release()
    }
  })

  app.delete(getPath('columns/:id/clear'), async (request, reply) => {
    try {
      const { id } = request.params

      const result = await pool.query(
        'DELETE FROM tasks WHERE column_id = $1 RETURNING column_id',
        [id],
      )

      reply.send({
        success: true,
        columnId: parseInt(id, 10),
        deletedCount: result.rowCount,
      })
    }
    catch (error) {
      app.log.error(error)
      reply.status(500).send({ error: 'Не удалось очистить колонку' })
    }
  })
}

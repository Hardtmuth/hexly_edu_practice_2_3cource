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
          error: 'Пользователь не найден',
        })
      }

      const isPasswordValid = await verifyPassword(password, user.password)
      if (!isPasswordValid) {
        return reply.status(401).send({
          error: 'Неверный пароль',
        })
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET || 'secret-key',
        { expiresIn: '24h' },
      )

      reply.send({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
    }
    catch (error) {
      app.log.error(error)
      reply.status(500).send({ error: 'Внутренняя ошибка сервера' })
    }
  })

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

  app.get(getPath('board/:id'), async (request, reply) => {
    try {
      const { id } = request.params
      const boardData = await getBoardData(id)

      if (!boardData) {
        return reply.status(404).send({ error: 'Доска не найдена' })
      }

      reply.send(boardData)
    }
    catch {
      reply.status(500).send({ error: 'Ошибка сервера при получении доски' })
    }
  })

  app.put(getPath('tasks/move'), async (request, reply) => {
    const client = await pool.connect()
    try {
      const { taskId, fromColumnId, toColumnId, newIndex } = request.body

      await client.query('BEGIN')

      await client.query(`
        UPDATE tasks 
        SET position = position - 1 
        WHERE column_id = $1 AND position > (SELECT position FROM tasks WHERE id = $2)
      `, [fromColumnId, taskId])

      const targetPosition = newIndex + 1
      await client.query(`
        UPDATE tasks 
        SET position = position + 1 
        WHERE column_id = $1 AND position >= $2
      `, [toColumnId, targetPosition])

      await client.query(`
        UPDATE tasks 
        SET column_id = $1, position = $2 
        WHERE id = $3
      `, [toColumnId, targetPosition, taskId])

      await client.query('COMMIT')
      reply.send({ success: true })
    }
    catch (error) {
      await client.query('ROLLBACK')
      app.log.error(error)
      reply.status(500).send({ error: 'Не удалось переместить задачу' })
    }
    finally {
      client.release()
    }
  })

  app.put(getPath('tasks/:id'), async (request, reply) => {
    try {
      const { id } = request.params
      const { name, description } = request.body

      const result = await pool.query(
        `UPDATE tasks 
         SET title = $1, description = $2 
         WHERE id = $3 
         RETURNING id, column_id, position, status, title AS name, description`,
        [name, description, id],
      )

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Задача не найдена' })
      }

      reply.send({ success: true, task: result.rows[0] })
    }
    catch (error) {
      app.log.error(error)
      reply.status(500).send({ error: 'Внутренняя ошибка сервера при обновлении задачи' })
    }
  })

  app.delete(getPath('tasks/:id'), async (request, reply) => {
    const client = await pool.connect()
    try {
      const { id } = request.params

      await client.query('BEGIN')

      const taskRes = await client.query('SELECT column_id, position FROM tasks WHERE id = $1', [id])

      if (taskRes.rows.length === 0) {
        await client.query('ROLLBACK')
        return reply.status(404).send({ error: 'Задача не найдена' })
      }

      const { column_id, position } = taskRes.rows[0]

      await client.query('DELETE FROM tasks WHERE id = $1', [id])

      await client.query(
        'UPDATE tasks SET position = position - 1 WHERE column_id = $1 AND position > $2',
        [column_id, position],
      )

      await client.query('COMMIT')
      reply.send({ success: true, taskId: parseInt(id, 10) })
    }
    catch (error) {
      await client.query('ROLLBACK')
      app.log.error(error)
      reply.status(500).send({ error: 'Внутренняя ошибка сервера при удалении задачи' })
    }
    finally {
      client.release()
    }
  })

  app.post(getPath('tasks'), async (request, reply) => {
    try {
      const { columnId, name, description } = request.body

      const result = await pool.query(
        `INSERT INTO tasks (column_id, title, description, position, status)
         VALUES (
           $1, 
           $2, 
           $3, 
           (SELECT COALESCE(MAX(position), 0) + 1 FROM tasks WHERE column_id = $1),
           'todo'
         )
         RETURNING id, column_id, position, status, title AS name, description`,
        [columnId, name, description],
      )

      reply.status(201).send({ success: true, task: result.rows[0] })
    }
    catch (error) {
      app.log.error(error)
      reply.status(500).send({ error: 'Не удалось создать задачу' })
    }
  })

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

  return app
}

const port = 3000

server().listen({ port })

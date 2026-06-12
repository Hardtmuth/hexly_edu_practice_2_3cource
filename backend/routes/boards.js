import { pool } from '../queries.js'
import { getPath } from '../utils/pathUtils.js'
import { getBoardData } from '../queries.js'

export const registerBoardRoutes = (app) => {
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
}

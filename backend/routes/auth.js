import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { findUserByEmail, createUser, deleteUser, updateUser, verifyPassword } from '../queries.js'
import { getPath } from '../utils/pathUtils.js'

export const registerAuthRoutes = (app) => {
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

  app.post(getPath('auth/register'), async (request, reply) => {
    try {
      const { name, email, password } = request.body

      const existingUser = await findUserByEmail(email)
      if (existingUser) {
        return reply.status(400).send({
          error: 'Пользователь с таким email уже зарегистрирован',
        })
      }

      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      const newUser = await createUser(name, email, hashedPassword)

      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        process.env.JWT_SECRET || 'secret-key',
        { expiresIn: '24h' },
      )

      reply.status(201).send({
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      })
    }
    catch (error) {
      app.log.error(error)
      reply.status(500).send({ error: 'Внутренняя ошибка сервера' })
    }
  })

  app.delete(getPath('auth/delete-account'), async (request, reply) => {
    try {
      const authHeader = request.headers.authorization
      if (!authHeader) {
        return reply.status(401).send({ error: 'Токен отсутствует' })
      }

      const token = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key')

      const isDeleted = await deleteUser(decoded.userId)

      if (!isDeleted) {
        return reply.status(404).send({ error: 'Пользователь не найден' })
      }

      reply.send({ message: 'Аккаунт успешно удален' })
    }
    catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return reply.status(401).send({ error: 'Сессия устарела или токен невалиден' })
      }
      app.log.error(error)
      return reply.status(500).send({ error: 'Внутренняя ошибка сервера' })
    }
  })

  app.put(getPath('auth/update-account'), async (request, reply) => {
    try {
      const authHeader = request.headers.authorization
      if (!authHeader) return reply.status(401).send({ error: 'Токен отсутствует' })

      const token = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key')

      let { column, value } = request.body

      if (!column || value === undefined) {
        return reply.status(400).send({ error: 'Необходимо указать column и value' })
      }

      const allowedColumns = ['name', 'email', 'password']
      if (!allowedColumns.includes(column)) {
        return reply.status(400).send({ error: 'Запрещено редактировать данное поле' })
      }

      if (column === 'email') {
        const existingUser = await findUserByEmail(value)
        if (existingUser && existingUser.id !== decoded.userId) {
          return reply.status(400).send({ error: 'Этот email уже занят другим пользователем' })
        }
      }

      if (column === 'password') {
        if (value.length < 6 || value.length > 20) {
          return reply.status(400).send({ error: 'Пароль должен быть от 6 до 20 символов' })
        }
        const saltRounds = 10
        value = await bcrypt.hash(value, saltRounds)
      }

      const updatedUser = await updateUser(decoded.userId, column, value)
      if (!updatedUser) return reply.status(404).send({ error: 'Пользователь не найден' })

      reply.send({
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
        },
      })
    }
    catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return reply.status(401).send({ error: 'Сессия устарела или токен невалиден' })
      }
      app.log.error(error)
      reply.status(500).send({ error: 'Внутренняя ошибка сервера' })
    }
  })
}

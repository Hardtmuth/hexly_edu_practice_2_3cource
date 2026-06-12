
import path from 'path'
import fastifyStatic from '@fastify/static'
import { __dirname } from '../utils/pathUtils.js'

export const registerStatic = (app) => {
  app.register(fastifyStatic, {
    root: path.join(__dirname, '../dist'),
    prefix: '/',
  })
}

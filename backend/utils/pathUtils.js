import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const apiPath = '/api/v1'
const getPath = (keyword) => [apiPath, keyword].join('/')

export { getPath, __dirname }

const apiPath = '/api/v1'
export const SERVER = 'http://localhost:3000'

export default {
  authPath: () => [apiPath, 'auth', 'login'].join('/'),
  userProjectsPath: (userId) => [apiPath, 'user', userId, 'list'].join('/'),
  userBoardPath: (boardId) => [apiPath, 'board', boardId].join('/'),
  moveTaskPath: () => [apiPath, 'tasks', 'move'].join('/'),
  createTaskPath: () => [apiPath, 'tasks'].join('/'),
  taskPath: (taskId) => [apiPath, 'tasks', taskId].join('/'),
  createColumnPath: () => [apiPath, 'columns'].join('/'),
  columnPath: (columnId) => [apiPath, 'columns', columnId].join('/'),
}

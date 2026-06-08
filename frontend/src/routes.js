const apiPath = '/api/v1'
export const SERVER = 'http://localhost:3000'

export default {
  authPath: () => [apiPath, 'auth', 'login'].join('/'),
  userProjectsPath: userId => [apiPath, 'user', userId, 'list'].join('/'),
  userBoardPath: boardId => [apiPath, 'board', boardId].join('/'),
  moveTaskPath: () => [apiPath, 'tasks', 'move'].join('/'),
  createTaskPath: () => [apiPath, 'tasks'].join('/'),
  taskPath: taskId => [apiPath, 'tasks', taskId].join('/'),
  createColumnPath: () => [apiPath, 'columns'].join('/'),
  columnPath: columnId => [apiPath, 'columns', columnId].join('/'),
  renameColumnPath: columnId => [apiPath, 'columns', columnId, 'rename'].join('/'),
  moveColumnPath: columnId => [apiPath, 'columns', columnId, 'move'].join('/'),
  insertColumnPath: () => [apiPath, 'columns', 'insert'].join('/'),
  clearColumnPath: columnId => [apiPath, 'columns', columnId, 'clear'].join('/'),
  createProjectPath: () => [apiPath, 'projects'].join('/'),
  projectPath: projectId => [apiPath, 'projects', projectId].join('/'),
  registerPath: () => [apiPath, 'auth', 'register'].join('/'),
  deleteAccountPath: () => [apiPath, 'auth', 'delete-account'].join('/'),
  updateAccountPath: () => [apiPath, 'auth', 'update-account'].join('/'),
}

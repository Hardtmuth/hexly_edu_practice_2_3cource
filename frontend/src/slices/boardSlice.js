import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import routes from '../routes.js'

export const fetchBoard = createAsyncThunk(
  'board/fetchBoard',
  async (boardId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token')

      if (!token) {
        return rejectWithValue('Токен авторизации отсутствует')
      }

      const response = await axios.get(routes.userBoardPath(boardId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data
    }
    catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error || 'Ошибка загрузки данных доски'
        return rejectWithValue(errorMessage)
      }
      else if (error.request) {
        return rejectWithValue('Нет ответа от сервера')
      }
      else {
        return rejectWithValue('Ошибка сети')
      }
    }
  },
)

export const moveTask = createAsyncThunk(
  'board/moveTask',
  async (moveData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token')

      const response = await axios.put(routes.moveTaskPath(), moveData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    }
    catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при синхронизации')
    }
  },
)

export const updateTaskOnServer = createAsyncThunk(
  'board/updateTaskOnServer',
  async ({ taskId, name, description }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token')
      const response = await axios.put(routes.taskPath(taskId), { name, description }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data.task
    }
    catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при обновлении задачи')
    }
  },
)

export const deleteTaskOnServer = createAsyncThunk(
  'board/deleteTaskOnServer',
  async (taskId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token')
      await axios.delete(routes.taskPath(taskId), {
        headers: { Authorization: `Bearer ${token}` },
      })
      return taskId
    }
    catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при удалении задачи')
    }
  },
)

export const createTaskOnServer = createAsyncThunk(
  'board/createTaskOnServer',
  async ({ columnId, name, description }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token')
      const response = await axios.post(routes.createTaskPath(), { columnId, name, description }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data.task
    }
    catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при создании задачи')
    }
  },
)

export const createColumnOnServer = createAsyncThunk(
  'board/createColumnOnServer',
  async ({ projectId, name }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token')
      const response = await axios.post(routes.createColumnPath(), { projectId, name }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data.column
    }
    catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при создании колонки')
    }
  },
)

export const deleteColumnOnServer = createAsyncThunk(
  'board/deleteColumnOnServer',
  async (columnId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token')
      await axios.delete(routes.columnPath(columnId), {
        headers: { Authorization: `Bearer ${token}` },
      })
      return columnId
    }
    catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при удалении колонки')
    }
  },
)

export const renameColumnOnServer = createAsyncThunk('board/renameColumnOnServer', async ({ id, name }, { getState }) => {
  const token = getState().auth.token || localStorage.getItem('token')
  const response = await axios.patch(routes.renameColumnPath(id), { name }, { headers: { Authorization: `Bearer ${token}` } })
  return response.data
})

export const moveColumnOnServer = createAsyncThunk('board/moveColumnOnServer', async ({ id, direction }, { getState }) => {
  const token = getState().auth.token || localStorage.getItem('token')
  const response = await axios.put(routes.moveColumnPath(id), { direction }, { headers: { Authorization: `Bearer ${token}` } })
  return response.data
})

export const insertColumnOnServer = createAsyncThunk('board/insertColumnOnServer', async (data, { getState }) => {
  const token = getState().auth.token || localStorage.getItem('token')
  const response = await axios.post(routes.insertColumnPath(), data, { headers: { Authorization: `Bearer ${token}` } })
  return response.data.column
})

export const clearColumnOnServer = createAsyncThunk(
  'board/clearColumnOnServer',
  async (columnId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token')
      const response = await axios.delete(routes.clearColumnPath(columnId), {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data.columnId
    }
    catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при очистке колонки')
    }
  },
)

const boardSlice = createSlice({
  name: 'board',
  initialState: {
    boardData: null,
    loading: false,
    error: null,
    _previousBoardData: null,
  },
  reducers: {
    clearBoard: (state) => {
      state.boardData = null
      state.error = null
    },
    moveTaskOptimistic: (state, action) => {
      const { source, destination } = action.payload
      if (!destination || !source) return
      state._previousBoardData = JSON.parse(JSON.stringify(state.boardData))

      const sourceCol = state.boardData.cols.find(
        col => col?.id?.toString() === source.droppableId,
      )
      const destCol = state.boardData.cols.find(col => col.id.toString() === destination.droppableId)

      if (sourceCol && destCol && sourceCol.tasks && destCol.tasks) {
        const [movedTask] = sourceCol.tasks.splice(source.index, 1)
        destCol.tasks.splice(destination.index, 0, movedTask)
      }
    },
    moveColumnOptimistic: (state, action) => {
      const { id, direction } = action.payload
      const index = state.boardData.cols.findIndex(c => c.id === id)
      if (index === -1) return

      const targetIndex = direction === 'left' ? index - 1 : index + 1
      if (targetIndex >= 0 && targetIndex < state.boardData.cols.length) {
        // Меняем местами элементы в массиве
        const [movedColumn] = state.boardData.cols.splice(index, 1)
        state.boardData.cols.splice(targetIndex, 0, movedColumn)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBoard.fulfilled, (state, action) => {
        state.loading = false
        const fetchedData = action.payload
        if (fetchedData && fetchedData.cols) {
          fetchedData.cols = fetchedData.cols.filter(col => col && col.id !== null && col.id !== undefined)
        }
        state.boardData = fetchedData
      })
      .addCase(fetchBoard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(moveTask.rejected, (state, action) => {
        if (state._previousBoardData) {
          state.boardData = state._previousBoardData
        }
        state.error = action.payload
      })
      .addCase(updateTaskOnServer.fulfilled, (state, action) => {
        const updatedTask = action.payload
        state.boardData.cols.forEach((col) => {
          if (col.tasks) {
            const index = col.tasks.findIndex(t => t.id === updatedTask.id)
            if (index !== -1) {
              col.tasks[index] = updatedTask
            }
          }
        })
      })
      .addCase(deleteTaskOnServer.fulfilled, (state, action) => {
        const deletedTaskId = action.payload
        state.boardData.cols.forEach((col) => {
          if (col.tasks) {
            col.tasks = col.tasks.filter(t => t.id !== deletedTaskId)
          }
        })
      })
      .addCase(createTaskOnServer.fulfilled, (state, action) => {
        const newTask = action.payload
        const column = state.boardData.cols.find(col => col.id === newTask.column_id)
        if (column) {
          if (!column.tasks) column.tasks = []
          column.tasks.push(newTask)
        }
      })
      .addCase(createColumnOnServer.fulfilled, (state, action) => {
        if (!state.boardData.cols) state.boardData.cols = []
        state.boardData.cols.push(action.payload)
      })
      .addCase(deleteColumnOnServer.fulfilled, (state, action) => {
        const deletedColumnId = action.payload
        state.boardData.cols = state.boardData.cols.filter(col => col.id !== deletedColumnId)
      })
      .addCase(renameColumnOnServer.fulfilled, (state, action) => {
        const col = state.boardData.cols.find(c => c.id === action.payload.columnId)
        if (col) col.name = action.payload.name
      })
      .addCase(insertColumnOnServer.fulfilled, (state, action) => {
        const newCol = action.payload
        const insertIndex = state.boardData.cols.findIndex(c => c.position >= newCol.position)
        if (insertIndex !== -1) {
          state.boardData.cols.splice(insertIndex, 0, newCol)
        }
        else {
          state.boardData.cols.push(newCol)
        }
      })
      .addCase(clearColumnOnServer.fulfilled, (state, action) => {
        const columnId = action.payload
        const column = state.boardData.cols.find(col => col.id === columnId)
        if (column) {
          column.tasks = []
        }
      })
  },
})

export const { clearBoard, moveTaskOptimistic, moveColumnOptimistic } = boardSlice.actions
export default boardSlice.reducer

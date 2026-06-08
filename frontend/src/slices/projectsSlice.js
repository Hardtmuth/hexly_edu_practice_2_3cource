import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import routes from '../routes.js'

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token')

      if (!token) {
        return rejectWithValue('Токен авторизации отсутствует')
      }

      const response = await axios.get(routes.userProjectsPath(userId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data.projects
    }
    catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error || 'Ошибка загрузки проектов'
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

export const createProjectOnServer = createAsyncThunk(
  'projects/createProjectOnServer',
  async ({ userId, name, description }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token')
      const response = await axios.post(routes.createProjectPath(), { userId, name, description }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data.project
    }
    catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка создания проекта')
    }
  },
)

export const updateProjectOnServer = createAsyncThunk(
  'projects/updateProjectOnServer',
  async ({ id, name, description }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token')
      const response = await axios.put(routes.projectPath(id), { name, description }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data.project
    }
    catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка обновления проекта')
    }
  },
)

export const deleteProjectOnServer = createAsyncThunk(
  'projects/deleteProjectOnServer',
  async (projectId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token')
      await axios.delete(routes.projectPath(projectId), {
        headers: { Authorization: `Bearer ${token}` },
      })
      return projectId
    }
    catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка удаления проекта')
    }
  },
)

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false
        state.projects = action.payload
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createProjectOnServer.fulfilled, (state, action) => {
        state.projects.push(action.payload)
      })
      .addCase(updateProjectOnServer.fulfilled, (state, action) => {
        const updated = action.payload
        const index = state.projects.findIndex(p => p.id === updated.id)
        if (index !== -1) {
          state.projects[index] = updated
        }
      })
      .addCase(deleteProjectOnServer.fulfilled, (state, action) => {
        const deletedId = action.payload
        state.projects = state.projects.filter(p => p.id !== deletedId)
      })
  },
})

export default projectsSlice.reducer

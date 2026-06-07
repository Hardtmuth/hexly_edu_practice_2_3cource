import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import routes from '../routes.js'

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');

      if (!token) {
        return rejectWithValue('Токен авторизации отсутствует');
      }

      const response = await axios.get(routes.userProjectsPath(userId), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      return response.data.projects

    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error || 'Ошибка загрузки проектов'
        return rejectWithValue(errorMessage);
      } else if (error.request) {
        return rejectWithValue('Нет ответа от сервера')
      } else {
        return rejectWithValue('Ошибка сети')
      }
    }
  }
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
  },
})

export default projectsSlice.reducer
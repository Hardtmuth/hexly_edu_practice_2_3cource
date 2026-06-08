import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import routes from '../routes.js'

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(routes.authPath(), credentials)

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userData', JSON.stringify(response.data.user))

      return response.data
    }
    catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error || 'Ошибка авторизации'
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

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(routes.registerPath(), userData)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userData', JSON.stringify(response.data.user))
      return response.data
    }
    catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при регистрации')
    }
  },
)

export const updateAccountOnServer = createAsyncThunk(
  'auth/updateAccountOnServer',
  async ({ column, value }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token')
      const response = await axios.put(routes.updateAccountPath(), { column, value }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      localStorage.setItem('userData', JSON.stringify(response.data.user))
      return response.data.user
    }
    catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при обновлении данных')
    }
  },
)

export const deleteAccountOnServer = createAsyncThunk(
  'auth/deleteAccountOnServer',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token')
      await axios.delete(routes.deleteAccountPath(), {
        headers: { Authorization: `Bearer ${token}` },
      })

      localStorage.removeItem('token')
      localStorage.removeItem('userData')
      return null
    }
    catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при удалении аккаунта')
    }
  },
)

const savedUser = localStorage.getItem('userData')
let parsedUser = null

try {
  parsedUser = savedUser ? JSON.parse(savedUser) : null
}
catch (e) {
  console.error('Ошибка парсинга userData из localStorage', e)
}

const initialState = {
  user: parsedUser,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token')
      localStorage.removeItem('userData')
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user // { id, name, email }
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(updateAccountOnServer.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(deleteAccountOnServer.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer

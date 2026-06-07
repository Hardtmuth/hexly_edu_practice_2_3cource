import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import routes from '../routes.js'

export const fetchBoard = createAsyncThunk(
  'board/fetchBoard',
  async (boardId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');

      if (!token) {
        return rejectWithValue('Токен авторизации отсутствует');
      }

      const response = await axios.get(routes.userBoardPath(boardId), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      return response.data

    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error || 'Ошибка загрузки данных доски'
        return rejectWithValue(errorMessage);
      } else if (error.request) {
        return rejectWithValue('Нет ответа от сервера')
      } else {
        return rejectWithValue('Ошибка сети')
      }
    }
  }
)

const boardSlice = createSlice({
  name: 'board',
  initialState: {
    boardData: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearBoard: (state) => {
      state.boardData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBoard.fulfilled, (state, action) => {
        state.loading = false
        state.boardData = action.payload
      })
      .addCase(fetchBoard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearBoard } = boardSlice.actions
export default boardSlice.reducer

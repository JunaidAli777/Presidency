import { createSlice } from '@reduxjs/toolkit'

const storedUser = localStorage.getItem('facultyData')

const initialState = {
  isLoggedIn: !!storedUser,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.isLoggedIn = true
    },
    logout: (state) => {
      state.isLoggedIn = false
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
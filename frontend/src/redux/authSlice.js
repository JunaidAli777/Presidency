import { createSlice } from '@reduxjs/toolkit'

const storedFaculty = sessionStorage.getItem('facultyToken')
const storedAdmin = sessionStorage.getItem('adminToken')
const storedUser = storedFaculty ? storedFaculty : storedAdmin

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
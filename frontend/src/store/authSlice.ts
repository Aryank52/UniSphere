import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: number
  name: string
  email: string
  role: 'STUDENT' | 'FACULTY' | 'COORDINATOR' | 'ADMIN'
  department: string | null
  academicYear?: number | null
  interests?: string[] | null
  skills?: string[] | null
  preferredCategories?: string[] | null
  xpPoints?: number
  level?: number
  isEmailVerified?: boolean
  isTwoFactorEnabled?: boolean
  profileImage?: string | null
}

interface AuthState {
  user: User | null
  token: string | null
  theme: 'dark'
}

// Sync state from localStorage
const savedToken = localStorage.getItem('unisphere_token')
let savedUser: User | null = null
try {
  const rawUser = localStorage.getItem('unisphere_user')
  if (rawUser) savedUser = JSON.parse(rawUser)
} catch (e) {
  console.error('Failed to parse saved user', e)
}

// Force light theme for white background experience
document.documentElement.classList.remove('dark')

const initialState: AuthState = {
  user: savedUser,
  token: savedToken,
  theme: 'dark'
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('unisphere_token', action.payload.token)
      localStorage.setItem('unisphere_user', JSON.stringify(action.payload.user))
    },
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('unisphere_token')
      localStorage.removeItem('unisphere_user')
    }
  }
})

export const { setAuth, logout } = authSlice.actions
export default authSlice.reducer

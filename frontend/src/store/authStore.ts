import { useAppSelector, useAppDispatch } from './index'
import { setAuth as setAuthAction, logout as logoutAction, type User } from './authSlice'

export type { User }

interface StoreState {
  user: User | null
  token: string | null
  theme: 'dark'
  setAuth: (user: User, token: string) => void
  logout: () => void
  toggleTheme: () => void
}

export function useAuthStore(): StoreState
export function useAuthStore<T>(selector: (state: StoreState) => T): T
export function useAuthStore<T>(selector?: (state: StoreState) => T): T | StoreState {
  const dispatch = useAppDispatch()
  const authState = useAppSelector(state => state.auth)

  const actions = {
    setAuth: (user: User, token: string) => dispatch(setAuthAction({ user, token })),
    logout: () => dispatch(logoutAction()),
    toggleTheme: () => {
      // Theme is locked to premium dark mode
    }
  }

  const mergedStore: StoreState = {
    ...authState,
    ...actions
  }

  if (selector) {
    return selector(mergedStore)
  }

  return mergedStore
}

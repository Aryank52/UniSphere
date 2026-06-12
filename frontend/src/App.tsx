import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './store/authStore'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { EventsPage } from './pages/EventsPage'
import { ClubsPage } from './pages/ClubsPage'
import { Unauthorized } from './pages/Unauthorized'
import { LandingPage } from './pages/LandingPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// Auth Guard Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useAuthStore(state => state.token)
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  const { token } = useAuthStore()

  React.useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Path */}
          <Route 
            path="/" 
            element={
              token ? <Navigate to="/dashboard" replace /> : <LandingPage />
            } 
          />

          {/* Public Authentication Path */}
          <Route 
            path="/login" 
            element={
              token ? <Navigate to="/dashboard" replace /> : <Login />
            } 
          />

          {/* Protected Administrative Paths */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="clubs" element={<ClubsPage />} />
            <Route path="unauthorized" element={<Unauthorized />} />
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './store/authStore'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { ForgotPassword } from './pages/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword'
import { VerifyEmail } from './pages/VerifyEmail'
import { OnboardingWizard } from './pages/OnboardingWizard'
import { Profile } from './pages/Profile'
import { Settings } from './pages/Settings'
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
const ProtectedRoute: React.FC<{ children: React.ReactNode; requireOnboarded?: boolean }> = ({ children, requireOnboarded = true }) => {
  const token = useAuthStore(state => state.token)
  const user = useAuthStore(state => state.user)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  // If student user has completed registration but has no department, force them to onboarding wizard
  if (requireOnboarded && user?.role === 'STUDENT' && !user?.department) {
    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}

export default function App() {
  const { token, user } = useAuthStore()

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

          {/* Public Authentication Paths */}
          <Route 
            path="/login" 
            element={
              token ? (user?.role === 'STUDENT' && !user?.department ? <Navigate to="/onboarding" replace /> : <Navigate to="/dashboard" replace />) : <Login />
            } 
          />
          <Route 
            path="/signup" 
            element={
              token ? <Navigate to="/dashboard" replace /> : <Signup />
            } 
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Onboarding Path */}
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute requireOnboarded={false}>
                <OnboardingWizard />
              </ProtectedRoute>
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
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="unauthorized" element={<Unauthorized />} />
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}


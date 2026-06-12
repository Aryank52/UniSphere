import React from 'react'
import { useAuthStore } from '../store/authStore'
import { StudentDashboard } from './StudentDashboard'
import { FacultyDashboard } from './FacultyDashboard'
import { AdminDashboard } from './AdminDashboard'
import { Navigate } from 'react-router-dom'

// Role-Based Router Dashboard Component
export const Dashboard: React.FC = () => {
  const { user } = useAuthStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  switch (user.role) {
    case 'STUDENT':
      return <StudentDashboard />
    case 'FACULTY':
      return <FacultyDashboard />
    case 'ADMIN':
      return <AdminDashboard />
    default:
      return <Navigate to="/login" replace />
  }
}

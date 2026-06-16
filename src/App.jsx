import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Login from './pages/Login'
import Register from './pages/Register'
import TrackSelection from './pages/TrackSelection'
import Dashboard from './pages/Dashboard'
import LessonPage from './pages/LessonPage'
import AssessmentPage from './pages/AssessmentPage'
import MentorDashboard from './pages/MentorDashboard'
import CertificatePage from './pages/CertificatePage'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tracks" element={<ProtectedRoute><TrackSelection /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/lesson/:id" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
      <Route path="/assessment/:moduleId" element={<ProtectedRoute><AssessmentPage /></ProtectedRoute>} />
      <Route path="/mentor" element={<ProtectedRoute><MentorDashboard /></ProtectedRoute>} />
      <Route path="/certificate" element={<ProtectedRoute><CertificatePage /></ProtectedRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

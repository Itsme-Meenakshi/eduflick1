import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const API_URL = 'http://localhost:8000'

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('eduflick_token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error(errData.detail || 'API request failed')
  }
  return response.json()
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [enrollment, setEnrollment] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshEnrollment = async () => {
    try {
      const active = await apiFetch('/api/enrollment/active')
      setEnrollment(active)
      return active
    } catch (err) {
      setEnrollment(null)
    }
  }

  const initAuth = async () => {
    const token = localStorage.getItem('eduflick_token')
    if (token) {
      try {
        const u = await apiFetch('/api/auth/me')
        setUser(u)
        // If the user is a student, get their active enrollment
        if (u.role === 'student') {
          await refreshEnrollment()
        }
      } catch (err) {
        console.error('Failed to load user session', err)
        localStorage.removeItem('eduflick_token')
        setUser(null)
        setEnrollment(null)
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    initAuth()
  }, [])

  const login = async (email, password) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem('eduflick_token', data.access_token)
    setUser(data.user)
    if (data.user.role === 'student') {
      try {
        const active = await apiFetch('/api/enrollment/active')
        setEnrollment(active)
      } catch (err) {
        setEnrollment(null)
      }
    }
    return data.user
  }

  const register = async (name, email, password, role) => {
    const data = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    })
    localStorage.setItem('eduflick_token', data.access_token)
    setUser(data.user)
    setEnrollment(null)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('eduflick_token')
    setUser(null)
    setEnrollment(null)
  }

  const enroll = (trackData) => {
    setEnrollment(trackData)
  }

  const enrollTrack = async (trackId, mentorId) => {
    await apiFetch('/api/enroll', {
      method: 'POST',
      body: JSON.stringify({ track_id: trackId, mentor_id: mentorId }),
    })
    return refreshEnrollment()
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      enrollment, 
      loading,
      login, 
      register, 
      logout, 
      enroll,
      enrollTrack,
      refreshEnrollment
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

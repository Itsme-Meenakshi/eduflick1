import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [enrollment, setEnrollment] = useState(null)

  const login = (userData) => setUser(userData)
  const logout = () => { setUser(null); setEnrollment(null) }
  const enroll = (trackData) => setEnrollment(trackData)

  return (
    <AuthContext.Provider value={{ user, enrollment, login, logout, enroll }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

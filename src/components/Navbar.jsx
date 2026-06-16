import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-3.5 flex justify-between items-center sticky top-0 z-50 transition-all duration-300">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(user ? (user.role === 'mentor' ? '/mentor' : '/dashboard') : '/')}>
        <div className="w-9 h-9 bg-purple-600 dark:bg-purple-500 rounded-xl flex items-center justify-center shadow-md shadow-purple-500/10 dark:shadow-purple-500/20 transform hover:rotate-12 transition-transform duration-300">
          <span className="text-white font-bold text-base">E</span>
        </div>
        <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">EduFlick <span className="text-purple-600 dark:text-purple-400 font-medium text-sm">AI</span></span>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-lg border border-gray-200/50 dark:border-slate-700/50 transition-all duration-300 active:scale-95"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {user && (
          <div className="flex items-center gap-4">
            {user.role === 'mentor' && (
              <button
                onClick={() => navigate('/mentor')}
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-semibold transition-colors"
              >
                Mentor Dashboard
              </button>
            )}
            <div className="flex items-center gap-2 border-l border-gray-200 dark:border-slate-800 pl-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold text-sm flex items-center justify-center border border-purple-200 dark:border-purple-800">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300 hidden sm:block">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

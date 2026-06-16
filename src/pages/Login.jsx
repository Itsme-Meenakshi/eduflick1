import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    try {
      setError('')
      const loggedInUser = await login(form.email, form.password)
      navigate(loggedInUser.role === 'mentor' ? '/mentor' : '/tracks')
    } catch (err) {
      setError(err.message || 'Login failed')
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 flex items-center justify-center px-4 transition-all duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800/80 w-full max-w-md p-8 sm:p-10 transition-colors duration-300">

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-purple-600 dark:bg-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-500/20 animate-bounce">
            <span className="text-white text-2xl font-bold">E</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Welcome back</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1.5">Sign in to continue your learning journey</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800/60 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-900/40 focus:border-purple-400 dark:focus:border-purple-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800/60 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-900/40 focus:border-purple-400 dark:focus:border-purple-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400 text-white font-bold rounded-xl py-3 text-sm transition-all shadow-lg shadow-purple-500/10 active:scale-95 mt-2"
          >
            Sign in
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-600 dark:text-purple-400 hover:underline font-bold">
            Sign up
          </Link>
        </p>

        <div className="mt-5 p-3.5 bg-gray-50 dark:bg-slate-800/30 border border-gray-100 dark:border-slate-800/40 rounded-xl">
          <p className="text-[11px] text-gray-450 dark:text-slate-500 text-center leading-relaxed font-semibold">Demo: use any email to login as student.<br />Use an email with "mentor" in it for mentor view.</p>
        </div>
      </div>
    </div>
  )
}

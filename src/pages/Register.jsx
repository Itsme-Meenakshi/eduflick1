import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    try {
      setError('')
      const registeredUser = await register(form.name, form.email, form.password, form.role)
      navigate(registeredUser.role === 'mentor' ? '/mentor' : '/tracks')
    } catch (err) {
      setError(err.message || 'Registration failed')
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 flex items-center justify-center px-4 transition-all duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800/80 w-full max-w-md p-8 sm:p-10 transition-colors duration-300">

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-purple-600 dark:bg-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-500/20 animate-pulse">
            <span className="text-white text-2xl font-bold">E</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Create your account</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1.5">Start your AI learning journey today</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">Full name</label>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800/60 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-900/40 focus:border-purple-400 dark:focus:border-purple-500 transition-all"
            />
          </div>
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
          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              {['student', 'mentor'].map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm({ ...form, role })}
                  className={`py-2.5 rounded-xl border text-sm font-bold capitalize transition-all ${
                    form.role === role
                      ? 'bg-purple-600 dark:bg-purple-500 text-white border-purple-600 dark:border-purple-500 shadow-md shadow-purple-500/10'
                      : 'border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:border-purple-300 dark:hover:border-purple-900/50 bg-gray-50 dark:bg-slate-800/20'
                  }`}
                >
                  {role === 'student' ? '🎓 Student' : '👨‍🏫 Mentor'}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400 text-white font-bold rounded-xl py-3 text-sm transition-all shadow-lg shadow-purple-500/10 active:scale-95 mt-2"
          >
            Create account
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/" className="text-purple-600 dark:text-purple-400 hover:underline font-bold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

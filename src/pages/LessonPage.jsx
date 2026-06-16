import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth, apiFetch } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function LessonPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { enrollment, refreshEnrollment } = useAuth()

  if (!state?.lesson) {
    navigate('/dashboard')
    return null
  }

  const { lesson, moduleIndex, lessonIndex } = state

  const handleComplete = async () => {
    try {
      await apiFetch('/api/progress/lessons/complete', {
        method: 'POST',
        body: JSON.stringify({ moduleIndex, lessonIndex })
      })
      await refreshEnrollment()
      navigate('/dashboard')
    } catch (err) {
      alert(err.message || 'Failed to complete lesson')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300 pb-16">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">

        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 mb-6 flex items-center gap-1.5 transition-all group"
        >
          <span className="inline-block transform group-hover:-translate-x-0.5 transition-transform">←</span> Back to Dashboard
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-250/70 dark:border-slate-800/80 shadow-md overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-900/80 dark:to-indigo-950/80 px-8 py-12 text-white border-b border-purple-500/10">
            <p className="text-purple-200 dark:text-purple-300 text-xs sm:text-sm mb-2 uppercase tracking-widest font-extrabold">Lesson {lessonIndex + 1}</p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{lesson.title}</h1>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="prose prose-sm max-w-none">
              {lesson.content.split('\n').map((line, i) => (
                <p key={i} className={`text-gray-700 dark:text-slate-350 leading-relaxed font-medium ${line.startsWith('•') ? 'ml-4' : ''} ${line === '' ? 'mt-4' : 'mt-2'}`}>
                  {line}
                </p>
              ))}
            </div>

            {/* Key takeaways */}
            <div className="mt-8 p-6 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100/50 dark:border-purple-900/50 rounded-2xl">
              <h3 className="font-bold text-purple-950 dark:text-purple-300 text-sm mb-3.5">Key Takeaways</h3>
              <ul className="space-y-3">
                <li className="text-sm text-purple-800 dark:text-purple-400 flex items-start gap-2.5 font-medium">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">✓</span> Understand the core concepts of this lesson
                </li>
                <li className="text-sm text-purple-800 dark:text-purple-400 flex items-start gap-2.5 font-medium">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">✓</span> Apply what you learned to real scenarios
                </li>
                <li className="text-sm text-purple-800 dark:text-purple-400 flex items-start gap-2.5 font-medium">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">✓</span> You're one step closer to completing the module
                </li>
              </ul>
            </div>

            {/* Complete button */}
            <div className="mt-8 flex gap-3">
              <button
                onClick={handleComplete}
                className="flex-1 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400 text-white font-bold rounded-xl py-3.5 transition-all shadow-lg shadow-purple-600/10 active:scale-95 text-sm"
              >
                Mark as complete ✓
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-7 border border-gray-250 dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/60 rounded-xl text-sm font-bold transition-all active:scale-95"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

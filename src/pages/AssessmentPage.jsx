import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth, apiFetch } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { ASSESSMENT_QUESTIONS } from '../data/mockData'

export default function AssessmentPage() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const { enrollment, refreshEnrollment } = useAuth()

  const questions = ASSESSMENT_QUESTIONS[moduleId] || ASSESSMENT_QUESTIONS[1]
  const module = enrollment?.roadmap?.find(m => m.id === parseInt(moduleId))

  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions before submitting.')
      return
    }
    let correct = 0
    questions.forEach(q => {
      if (answers[q.id] === q.answer) correct++
    })
    const pct = Math.round((correct / questions.length) * 100)
    setScore(pct)

    try {
      await apiFetch(`/api/assessments/${moduleId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ score: pct })
      })
      await refreshEnrollment()
      setSubmitted(true)
    } catch (err) {
      alert(err.message || 'Failed to submit assessment')
    }
  }

  const passed = score >= (module?.passingScore || 70)

  if (submitted) return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300 pb-16">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-md ${passed ? 'bg-green-100 dark:bg-green-950/40' : 'bg-red-100 dark:bg-red-950/40'}`}>
          {passed ? '🎉' : '😕'}
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
          {passed ? 'Assessment passed!' : 'Not quite there yet'}
        </h2>
        <p className="text-gray-550 dark:text-slate-400 mb-1 font-semibold text-sm">Your Score</p>
        <p className={`text-5xl font-black mb-2.5 ${passed ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{score}%</p>
        <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 mb-8">Passing score: {module?.passingScore || 70}%</p>

        {passed ? (
          <div className="bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-900/50 rounded-2xl p-5 mb-8 text-left">
            <p className="text-green-700 dark:text-green-400 font-bold text-sm">✓ Module complete — next module is now unlocked</p>
          </div>
        ) : (
          <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 rounded-2xl p-5 mb-8 text-left">
            <p className="text-red-650 dark:text-red-400 text-sm font-semibold">Review the lessons in this module and try again.</p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/dashboard')} className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-600/10 active:scale-95">
            Back to Dashboard
          </button>
          {!passed && (
            <button onClick={() => { setSubmitted(false); setAnswers({}) }} className="border border-gray-250 dark:border-slate-800 text-gray-600 dark:text-slate-400 px-6 py-3.5 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-all active:scale-95">
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300 pb-16">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 mb-6 flex items-center gap-1.5 transition-all group"
        >
          <span className="inline-block transform group-hover:-translate-x-0.5 transition-transform">←</span> Back to Dashboard
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 overflow-hidden shadow-md transition-all duration-300">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-700 px-8 py-10 text-white border-b border-orange-500/10">
            <p className="text-amber-100 dark:text-amber-200 text-xs sm:text-sm mb-1 uppercase tracking-widest font-extrabold">Module Assessment</p>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">{module?.title || 'Assessment'}</h1>
            <p className="text-amber-100 dark:text-amber-200 text-xs mt-1.5 font-medium">Answer all {questions.length} questions · Passing score: {module?.passingScore || 70}%</p>
          </div>

          <div className="px-8 py-8 space-y-8">
            {questions.map((q, qi) => (
              <div key={q.id}>
                <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-4">
                  {qi + 1}. {q.question}
                </p>
                <div className="space-y-2.5">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => setAnswers({ ...answers, [q.id]: oi })}
                      className={`w-full text-left px-5 py-3.5 rounded-xl border text-sm transition-all ${
                        answers[q.id] === oi
                          ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 dark:border-purple-600 text-purple-800 dark:text-purple-300 font-bold'
                          : 'border-gray-250 dark:border-slate-800 text-gray-700 dark:text-slate-350 hover:border-purple-300 dark:hover:border-purple-900/50 hover:bg-purple-50/20 dark:hover:bg-purple-950/10 bg-gray-50/30 dark:bg-slate-900/40'
                      }`}
                    >
                      <span className="font-extrabold text-purple-600 dark:text-purple-400 mr-2.5">{String.fromCharCode(65 + oi)}.</span> {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-5 border-t border-gray-100 dark:border-slate-850">
              <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 mb-4">{Object.keys(answers).length}/{questions.length} questions answered</p>
              <button
                onClick={handleSubmit}
                className="w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-550 text-white font-bold rounded-xl py-3.5 text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-95"
              >
                Submit Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

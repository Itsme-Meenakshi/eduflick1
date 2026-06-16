import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ProgressBar from '../components/ProgressBar'
import { useAuth, apiFetch } from '../context/AuthContext'

export default function MentorDashboard() {
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [submissions, setSubmissions] = useState([])

  const loadData = async () => {
    try {
      const [studentsData, subsData] = await Promise.all([
        apiFetch('/api/mentor/students'),
        apiFetch('/api/mentor/submissions')
      ])
      setStudents(studentsData)
      setSubmissions(subsData)
    } catch (err) {
      console.error('Failed to load mentor dashboard data', err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleReview = async (subId, status) => {
    try {
      await apiFetch(`/api/submissions/${subId}/review`, {
        method: 'POST',
        body: JSON.stringify({ status })
      })
      await loadData()
    } catch (err) {
      alert(err.message || 'Failed to review submission')
    }
  }

  const pendingReviews = submissions.filter(s => s.status === 'pending').length
  const avgProgress = students.length > 0 ? Math.round(students.reduce((a, s) => a + s.progress, 0) / students.length) : 0
  const completed = students.filter(s => s.progress === 100).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300 pb-16">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Mentor Dashboard</h1>
          <p className="text-gray-550 dark:text-slate-400 text-sm mt-1.5">Welcome back, {user?.name} — managing {students.length} students</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total students', value: students.length, color: 'text-purple-600 dark:text-purple-400' },
            { label: 'Avg. progress', value: `${avgProgress}%`, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Completed course', value: completed, color: 'text-green-600 dark:text-green-400' },
            { label: 'Pending reviews', value: pendingReviews, color: 'text-orange-500 dark:text-orange-400' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 mb-1 tracking-wider uppercase">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Project Submissions Review Section */}
        <h2 className="text-base font-extrabold text-gray-805 dark:text-slate-200 mb-5">Project Submissions to Review</h2>
        {submissions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 text-center shadow-sm mb-8">
            <p className="text-xs text-gray-500 dark:text-slate-400">No project submissions found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {submissions.map(sub => (
              <div key={sub.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-5.5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] bg-purple-50 dark:bg-purple-950/45 text-purple-750 dark:text-purple-300 font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-purple-200/20 dark:border-purple-900/30">
                      {sub.trackName || 'Course'} Project
                    </span>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${
                      sub.status === 'pending' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200/20 dark:border-amber-900/30' :
                      sub.status === 'approved' ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-200/20 dark:border-green-900/30' :
                      'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200/20 dark:border-red-900/30'
                    }`}>
                      {sub.status === 'pending' ? 'Pending Review' : sub.status}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight">{sub.title}</h3>
                  <p className="text-xs text-gray-555 dark:text-slate-400 mt-1.5 mb-4 leading-relaxed">{sub.description}</p>
                  
                  <div className="bg-gray-50/50 dark:bg-slate-800/40 border border-gray-150 dark:border-slate-800/60 rounded-xl p-3.5 mb-4 text-[11px] leading-relaxed">
                    <p className="text-gray-650 dark:text-slate-350"><span className="font-bold text-gray-400 dark:text-slate-500">Student:</span> {sub.studentName}</p>
                    <p className="text-gray-650 dark:text-slate-350"><span className="font-bold text-gray-400 dark:text-slate-550">Track:</span> {sub.trackName}</p>
                    <p className="text-gray-650 dark:text-slate-350"><span className="font-bold text-gray-400 dark:text-slate-500">Submitted:</span> {sub.submittedAt}</p>
                    <a href={sub.repoLink} target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 font-bold hover:underline break-all mt-2 block">
                      🔗 Repo Link: {sub.repoLink}
                    </a>
                  </div>
                </div>

                {sub.status === 'pending' && (
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => handleReview(sub.id, 'approved')}
                      className="flex-1 text-xs font-bold bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-450 text-white py-2 rounded-xl transition-all shadow-md shadow-green-600/10 active:scale-95"
                    >
                      Approve ✓
                    </button>
                    <button
                      onClick={() => handleReview(sub.id, 'rejected')}
                      className="flex-1 text-xs font-bold bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-450 text-white py-2 rounded-xl transition-all shadow-md shadow-red-650/10 active:scale-95"
                    >
                      Reject ✕
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Student list */}
        <h2 className="text-base font-extrabold text-gray-800 dark:text-slate-200 mb-5">Students Under Supervision</h2>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 divide-y divide-gray-100 dark:divide-slate-800/60 shadow-sm overflow-hidden">
          {students.map(student => (
            <div key={student.id} className="p-6 hover:bg-gray-50/25 dark:hover:bg-slate-800/10 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border border-purple-200/50 dark:border-purple-900/50 flex items-center justify-center text-sm shadow-inner">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base leading-tight">{student.name}</p>
                    <p className="text-xs text-gray-450 dark:text-slate-500 mt-0.5">{student.track}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 sm:self-center">
                  <span className="text-xs text-gray-400 dark:text-slate-500 font-medium mr-1.5">{student.lastActive}</span>
                  {student.progress === 100 && (
                    <span className="text-[10px] uppercase tracking-wider bg-green-100 dark:bg-green-950/60 border border-green-200/30 dark:border-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full font-extrabold">Completed 🎓</span>
                  )}
                  {student.streak >= 7 && (
                    <span className="text-[10px] uppercase tracking-wider bg-orange-100 dark:bg-orange-950/60 border border-orange-200/30 dark:border-orange-905/30 text-orange-700 dark:text-orange-400 px-2.5 py-1 rounded-full font-extrabold">🔥 {student.streak} day streak</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-2 pt-2">
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-slate-550 mb-1.5 uppercase tracking-wider">Progress</p>
                  <ProgressBar percent={student.progress} color={student.progress === 100 ? 'green' : 'purple'} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-slate-550 mb-1.5 uppercase tracking-wider">Modules Completed</p>
                  <p className="text-sm font-bold text-gray-750 dark:text-slate-300">{student.modulesCompleted} / 3</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-slate-550 mb-1.5 uppercase tracking-wider">Last Assessment Score</p>
                  <p className={`text-sm font-bold ${student.assessmentScore >= 70 ? 'text-green-600 dark:text-green-400' : student.assessmentScore === 0 ? 'text-gray-400 dark:text-slate-650' : 'text-red-500 dark:text-red-400'}`}>
                    {student.assessmentScore === 0 ? 'Not taken yet' : `${student.assessmentScore}%`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

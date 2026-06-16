import Navbar from '../components/Navbar'
import ProgressBar from '../components/ProgressBar'
import { MENTOR_STUDENTS } from '../data/mockData'
import { useAuth } from '../context/AuthContext'

export default function MentorDashboard() {
  const { user } = useAuth()

  const avgProgress = Math.round(MENTOR_STUDENTS.reduce((a, s) => a + s.progress, 0) / MENTOR_STUDENTS.length)
  const completed = MENTOR_STUDENTS.filter(s => s.progress === 100).length
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300 pb-16">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Mentor Dashboard</h1>
          <p className="text-gray-555 dark:text-slate-400 text-sm mt-1.5">Welcome back, {user?.name} — managing {MENTOR_STUDENTS.length} students</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total students', value: MENTOR_STUDENTS.length, color: 'text-purple-600 dark:text-purple-400' },
            { label: 'Avg. progress', value: `${avgProgress}%`, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Completed course', value: completed, color: 'text-green-600 dark:text-green-400' },
            { label: 'Pending reviews', value: '2', color: 'text-orange-500 dark:text-orange-400' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 mb-1 tracking-wider uppercase">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Student list */}
        <h2 className="text-base font-extrabold text-gray-800 dark:text-slate-200 mb-5">Students Under Supervision</h2>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 divide-y divide-gray-100 dark:divide-slate-800/60 shadow-sm overflow-hidden">
          {MENTOR_STUDENTS.map(student => (
            <div key={student.id} className="p-6 hover:bg-gray-50/25 dark:hover:bg-slate-800/10 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border border-purple-200/50 dark:border-purple-900/50 flex items-center justify-center text-sm shadow-inner">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base leading-tight">{student.name}</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{student.track}</p>
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
                  <p className="text-xs font-bold text-gray-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">Progress</p>
                  <ProgressBar percent={student.progress} color={student.progress === 100 ? 'green' : 'purple'} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">Modules Completed</p>
                  <p className="text-sm font-bold text-gray-750 dark:text-slate-300">{student.modulesCompleted} / 3</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">Last Assessment Score</p>
                  <p className={`text-sm font-bold ${student.assessmentScore >= 70 ? 'text-green-600 dark:text-green-400' : student.assessmentScore === 0 ? 'text-gray-400 dark:text-slate-600' : 'text-red-500 dark:text-red-400'}`}>
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

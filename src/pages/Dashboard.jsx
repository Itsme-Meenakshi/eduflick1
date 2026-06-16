import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, apiFetch } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import ProgressBar from '../components/ProgressBar'

export default function Dashboard() {
  const { user, enrollment, refreshEnrollment } = useAuth()
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState([])
  const [activeSubmissionForm, setActiveSubmissionForm] = useState(null)
  const [projectForm, setProjectForm] = useState({ title: '', description: '', repoLink: '' })

  const loadData = async () => {
    try {
      const activeSubs = await apiFetch('/api/submissions/active')
      setSubmissions(activeSubs)
      await refreshEnrollment()
    } catch (err) {
      console.error('Failed to load dashboard data', err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmitProject = async (e, lessonId) => {
    e.preventDefault()
    if (!projectForm.title || !projectForm.description || !projectForm.repoLink) {
      alert('Please fill in all fields.')
      return
    }
    try {
      await apiFetch('/api/submissions', {
        method: 'POST',
        body: JSON.stringify({
          lesson_id: lessonId,
          title: projectForm.title,
          description: projectForm.description,
          repo_link: projectForm.repoLink
        })
      })
      const activeSubs = await apiFetch('/api/submissions/active')
      setSubmissions(activeSubs)
      await refreshEnrollment()
      setActiveSubmissionForm(null)
      setProjectForm({ title: '', description: '', repoLink: '' })
    } catch (err) {
      alert(err.message || 'Submission failed')
    }
  }

  if (!enrollment) return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-500 dark:text-slate-400 mb-4">You haven't enrolled in a track yet.</p>
          <button onClick={() => navigate('/tracks')} className="bg-purple-600 dark:bg-purple-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors shadow-lg shadow-purple-500/20">Choose a track</button>
        </div>
      </div>
    </div>
  )

  const roadmap = enrollment.roadmap || []
  const allLessons = roadmap.flatMap(m => m.lessons)
  const completedLessons = allLessons.filter(l => l.completed).length
  const totalLessons = allLessons.length
  const progressPercent = Math.round((completedLessons / totalLessons) * 100)
  const completedModules = roadmap.filter(m => m.assessmentPassed).length

  const handleCompleteLesson = async (moduleIndex, lessonIndex) => {
    try {
      await apiFetch('/api/progress/lessons/complete', {
        method: 'POST',
        body: JSON.stringify({ moduleIndex, lessonIndex })
      })
      await refreshEnrollment()
    } catch (err) {
      alert(err.message || 'Failed to complete lesson')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-all duration-300 pb-12">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Back navigation */}
        <button
          onClick={() => navigate('/tracks')}
          className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 mb-6 flex items-center gap-1.5 transition-all group"
        >
          <span className="inline-block transform group-hover:-translate-x-1 transition-transform">←</span> Back to Track Selection
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Welcome back, {user?.name} 👋</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1.5">
            Active Track: <span className="font-semibold text-gray-700 dark:text-slate-350">{enrollment.track.name}</span> · Mentor: <span className="font-semibold text-gray-700 dark:text-slate-350">{enrollment.mentor.name}</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Course progress', value: `${progressPercent}%`, color: 'text-purple-600 dark:text-purple-400' },
            { label: 'Lessons done', value: `${completedLessons}/${totalLessons}`, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Modules passed', value: `${completedModules}/${roadmap.length}`, color: 'text-green-600 dark:text-green-400' },
            { label: 'Day streak', value: `🔥 ${enrollment.streak || 1}`, color: 'text-orange-500 dark:text-orange-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800/80 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 mb-1 tracking-wider uppercase">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Overall progress bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-bold text-gray-700 dark:text-slate-300">Overall Progress</p>
            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{progressPercent}%</span>
          </div>
          <ProgressBar percent={progressPercent} showLabel={false} />
          {progressPercent === 100 && (
            <div className="mt-5 p-4 bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-900/50 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300">
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">🎉 Course complete! Your certificate is ready to download.</p>
              <button onClick={() => navigate('/certificate')} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-green-600/10">View Certificate</button>
            </div>
          )}
        </div>

        {/* Roadmap */}
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Your Learning Roadmap</h2>
        <div className="space-y-6">
          {roadmap.map((module, mi) => {
            const projectLesson = module.lessons.find(l => l.title.toLowerCase().includes('project'))

            return (
              <div key={module.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                {/* Module header */}
                <div className={`px-6 py-4.5 flex items-center justify-between ${module.assessmentPassed ? 'bg-green-50/50 dark:bg-green-950/10' : 'bg-gray-50/50 dark:bg-slate-800/30'} border-b border-gray-200 dark:border-slate-800/80`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold ${module.assessmentPassed ? 'bg-green-500 text-white shadow-md shadow-green-500/10' : 'bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>
                      {module.assessmentPassed ? '✓' : mi + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base leading-tight">{module.title}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Assessment Passing score: {module.passingScore}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {module.assessmentPassed && <span className="text-xs bg-green-100 dark:bg-green-950/60 border border-green-200/40 dark:border-green-900/40 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-bold">Passed</span>}
                    {module.assessmentUnlocked && !module.assessmentPassed && (
                      <button
                        onClick={() => navigate(`/assessment/${module.id}`)}
                        className="text-xs bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md shadow-amber-500/10 hover:scale-105 active:scale-95"
                      >
                        Take assessment →
                      </button>
                    )}
                  </div>
                </div>

                {/* Lessons */}
                <div className="divide-y divide-gray-100 dark:divide-slate-800/60">
                  {module.lessons.map((lesson, li) => {
                    const isProject = lesson.title.toLowerCase().includes('project')
                    const sub = isProject ? submissions.find(s => s.lessonId === lesson.id) : null

                    return (
                      <div key={lesson.id} className={`px-6 py-4 flex flex-col ${lesson.locked ? 'opacity-55 bg-gray-50/20 dark:bg-slate-900/20' : 'hover:bg-gray-50/30 dark:hover:bg-slate-800/10'} transition-all duration-300`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3.5">
                            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                              lesson.completed ? 'bg-green-500 border-green-500 text-white shadow-md shadow-green-500/10' :
                              lesson.locked ? 'border-gray-300 dark:border-slate-700 text-gray-400 dark:text-slate-600' :
                              'border-purple-400 dark:border-purple-600 text-purple-500 dark:text-purple-400'
                            }`}>
                              {lesson.completed ? '✓' : lesson.locked ? '🔒' : li + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className={`text-sm font-semibold ${lesson.locked ? 'text-gray-400 dark:text-slate-600' : 'text-gray-800 dark:text-slate-200'}`}>{lesson.title}</p>
                                {isProject && (
                                  <span className="text-[9px] bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border border-purple-200/20 dark:border-purple-900/30">
                                    Project Submission
                                  </span>
                                )}
                                {isProject && sub && (
                                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                                    sub.status === 'pending' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200/20 dark:border-amber-900/30' :
                                    sub.status === 'approved' ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-200/20 dark:border-green-900/30' :
                                    'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200/20 dark:border-red-900/30'
                                  }`}>
                                    {sub.status === 'pending' ? 'Under Review' : sub.status === 'approved' ? 'Approved' : 'Needs Changes'}
                                  </span>
                                )}
                              </div>
                              {!lesson.locked && !lesson.completed && !isProject && (
                                <p className="text-xs text-purple-500 dark:text-purple-400 font-medium mt-0.5">Ready to learn</p>
                              )}
                              {isProject && !lesson.locked && !lesson.completed && !sub && (
                                <p className="text-xs text-amber-500 dark:text-amber-400 font-medium mt-0.5">Project details required to complete</p>
                              )}
                              {lesson.locked && (
                                <p className="text-xs text-gray-400 dark:text-slate-600 mt-0.5">Complete previous lesson to unlock</p>
                              )}
                              {lesson.completed && (
                                <p className="text-xs text-green-500 dark:text-green-400 font-medium mt-0.5">Completed</p>
                              )}
                            </div>
                          </div>

                          {!lesson.locked && (
                            <div className="flex gap-2.5 sm:self-center">
                              <button
                                onClick={() => navigate(`/lesson/${lesson.id}`, { state: { lesson, moduleIndex: mi, lessonIndex: li } })}
                                className="text-xs bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-950/70 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-xl font-bold border border-purple-200/30 dark:border-purple-900/30 transition-all active:scale-95"
                              >
                                Open lesson
                              </button>
                              
                              {!isProject && !lesson.completed && (
                                <button
                                  onClick={() => handleCompleteLesson(mi, li)}
                                  className="text-xs bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-450 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md shadow-purple-600/10 active:scale-95"
                                >
                                  Mark done ✓
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Module-level Project Submission Section */}
                {projectLesson && (
                  <div className="bg-purple-50/10 dark:bg-purple-950/5 border-t border-gray-100 dark:border-slate-800/80 p-6">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <div>
                        <h3 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>📁</span> {projectLesson.title} Submission Space
                        </h3>
                        <p className="text-xs text-gray-450 dark:text-slate-500 mt-0.5">Submit your repository link and project info for mentor review</p>
                      </div>
                      <div>
                        {(() => {
                          const sub = submissions.find(s => s.lessonId === projectLesson.id)
                          if (projectLesson.locked) return <span className="text-[10px] bg-gray-100 dark:bg-slate-800 text-gray-500 px-3 py-1 rounded-full font-bold">Locked</span>
                          if (!sub) return <span className="text-[10px] bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full font-bold">Pending Submission</span>
                          if (sub.status === 'pending') return <span className="text-[10px] bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full font-bold">Under Review</span>
                          if (sub.status === 'approved') return <span className="text-[10px] bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-bold">Approved</span>
                          return <span className="text-[10px] bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 px-3 py-1 rounded-full font-bold">Needs Changes</span>
                        })()}
                      </div>
                    </div>

                    {projectLesson.locked && (
                      <div className="bg-gray-50/50 dark:bg-slate-800/10 rounded-xl p-4 border border-dashed border-gray-200 dark:border-slate-800/60 text-center text-xs text-gray-500 dark:text-slate-500 font-medium">
                        🔒 Please complete all previous lessons in this module to unlock the project submission.
                      </div>
                    )}

                    {!projectLesson.locked && (() => {
                      const sub = submissions.find(s => s.lessonId === projectLesson.id)
                      const showForm = activeSubmissionForm === projectLesson.id || !sub || sub.status === 'rejected'

                      if (showForm) {
                        return (
                          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
                            <h4 className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-3.5">
                              {sub ? 'Update Project Details' : 'Upload Project Details'}
                            </h4>
                            <form onSubmit={(e) => handleSubmitProject(e, projectLesson.id)} className="space-y-4">
                              <div>
                                <input
                                  type="text"
                                  placeholder="Project Title"
                                  value={projectForm.title}
                                  onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                                  className="w-full bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400 dark:focus:ring-purple-500 transition-all"
                                />
                              </div>
                              <div>
                                <textarea
                                  placeholder="Project Description (explain how it works, tools used)"
                                  rows={3}
                                  value={projectForm.description}
                                  onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                                  className="w-full bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400 dark:focus:ring-purple-500 transition-all"
                                />
                              </div>
                              <div>
                                <input
                                  type="url"
                                  placeholder="Repository Link (e.g. GitHub)"
                                  value={projectForm.repoLink}
                                  onChange={e => setProjectForm({ ...projectForm, repoLink: e.target.value })}
                                  className="w-full bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400 dark:focus:ring-purple-500 transition-all"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="submit"
                                  className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400 text-white font-bold rounded-xl px-5 py-2 text-xs transition-all shadow-md shadow-purple-600/10 active:scale-95"
                                >
                                  Submit details
                                </button>
                                {sub && (
                                  <button
                                    type="button"
                                    onClick={() => setActiveSubmissionForm(null)}
                                    className="border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 font-bold rounded-xl px-5 py-2 text-xs hover:bg-gray-50 dark:hover:bg-slate-80 transition-all"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </form>
                          </div>
                        )
                      } else {
                        return (
                          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm text-xs">
                            <div className="font-extrabold text-gray-800 dark:text-slate-250 mb-2.5 text-sm border-b border-gray-100 dark:border-slate-800/40 pb-2 flex items-center justify-between">
                              <span>Uploaded Details</span>
                              {sub.status !== 'approved' && (
                                <button
                                  onClick={() => {
                                    setActiveSubmissionForm(projectLesson.id)
                                    setProjectForm({
                                      title: sub.title,
                                      description: sub.description,
                                      repoLink: sub.repoLink
                                    })
                                  }}
                                  className="text-[10px] bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400 text-white px-3 py-1.5 rounded-lg font-bold transition-all shadow-md shadow-purple-500/10 active:scale-95"
                                >
                                  Update Submission
                                </button>
                              )}
                            </div>
                            <div className="space-y-2.5 text-gray-650 dark:text-slate-400 leading-relaxed font-medium">
                              <p><span className="font-bold text-gray-400 dark:text-slate-550">Title:</span> {sub.title}</p>
                              <p><span className="font-bold text-gray-400 dark:text-slate-550">Description:</span> {sub.description}</p>
                              <p><span className="font-bold text-gray-400 dark:text-slate-550">Submitted at:</span> {sub.submittedAt}</p>
                              <a href={sub.repoLink} target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 font-bold hover:underline break-all mt-1.5 inline-block">
                                🔗 Repo Link: {sub.repoLink}
                              </a>
                            </div>
                          </div>
                        )
                      }
                    })()}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

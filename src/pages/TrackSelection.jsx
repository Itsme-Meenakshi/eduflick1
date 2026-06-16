import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { TRACKS, MENTORS, generateRoadmap } from '../data/mockData'

const colorMap = {
  purple: 'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900/50',
  blue: 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/50',
  teal: 'bg-teal-100 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-900/50',
  green: 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-900/50',
  orange: 'bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-900/50',
  yellow: 'bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900/50',
  red: 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900/50',
}

const selectedBorder = {
  purple: 'border-purple-500 ring-4 ring-purple-100 dark:ring-purple-950/30',
  blue: 'border-blue-500 ring-4 ring-blue-100 dark:ring-blue-950/30',
  teal: 'border-teal-500 ring-4 ring-teal-100 dark:ring-teal-950/30',
  green: 'border-green-500 ring-4 ring-green-100 dark:ring-green-950/30',
  orange: 'border-orange-500 ring-4 ring-orange-100 dark:ring-orange-950/30',
  yellow: 'border-yellow-500 ring-4 ring-yellow-100 dark:ring-yellow-950/30',
  red: 'border-red-500 ring-4 ring-red-100 dark:ring-red-950/30',
}

export default function TrackSelection() {
  const [step, setStep] = useState(1) // 1=track, 2=mentor
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [selectedMentor, setSelectedMentor] = useState(null)
  const { enroll } = useAuth()
  const navigate = useNavigate()

  const mainCourses = TRACKS.filter(t => t.type === 'Main Course')
  const bootcamps = TRACKS.filter(t => t.type === 'Bootcamp')

  const handleConfirm = () => {
    const roadmap = generateRoadmap(selectedTrack.id)
    enroll({ track: selectedTrack, mentor: selectedMentor, roadmap, progress: 0, streak: 1 })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300 pb-16">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-slate-600'}`}>
            <div className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center ${step >= 1 ? 'bg-purple-600 dark:bg-purple-500 text-white shadow-md shadow-purple-500/10' : 'bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-400'}`}>1</div>
            <span className="text-sm font-bold">Choose Track</span>
          </div>
          <div className="h-0.5 w-12 bg-gray-200 dark:bg-slate-800" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-slate-600'}`}>
            <div className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center ${step >= 2 ? 'bg-purple-600 dark:bg-purple-500 text-white shadow-md shadow-purple-500/10' : 'bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-400'}`}>2</div>
            <span className="text-sm font-bold">Choose Mentor</span>
          </div>
        </div>

        {step === 1 && (
          <>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white text-center mb-2 tracking-tight">Choose your learning track</h1>
            <p className="text-gray-500 dark:text-slate-400 text-center mb-10 text-sm sm:text-base">Pick the path that matches your goal and skill level</p>

            <h2 className="text-xs font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">Main Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {mainCourses.map(track => (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrack(track)}
                  className={`text-left p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 transition-all hover:scale-[1.02] duration-300 hover:shadow-md ${
                    selectedTrack?.id === track.id
                      ? selectedBorder[track.color]
                      : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="text-3xl mb-4 transform hover:scale-110 transition-transform inline-block">{track.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base mb-1.5 leading-tight">{track.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">{track.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold uppercase tracking-wider ${colorMap[track.color]}`}>{track.duration}</span>
                    <span className="text-[10px] px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700/50 font-bold uppercase tracking-wider">{track.lessons} lessons</span>
                  </div>
                </button>
              ))}
            </div>

            <h2 className="text-xs font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">Bootcamp Programs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
              {bootcamps.map(track => (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrack(track)}
                  className={`text-left p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 transition-all hover:scale-[1.02] duration-300 hover:shadow-md ${
                    selectedTrack?.id === track.id
                      ? selectedBorder[track.color]
                      : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="text-3xl mb-4 transform hover:scale-110 transition-transform inline-block">{track.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base mb-1.5 leading-tight">{track.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-4 leading-relaxed">{track.description}</p>
                  <div className="flex gap-2">
                    <span className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold uppercase tracking-wider ${colorMap[track.color]}`}>{track.duration}</span>
                    <span className="text-[10px] px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700/50 font-bold uppercase tracking-wider">{track.lessons} lessons</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-slate-900">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedTrack}
                className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400 disabled:bg-gray-200 dark:disabled:bg-slate-900 disabled:text-gray-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-xl px-8 py-3.5 transition-all shadow-lg shadow-purple-500/10 dark:shadow-purple-500/20 active:scale-95"
              >
                Continue →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setStep(1)} className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">← Back</button>
              <div className="text-sm text-gray-400 dark:text-slate-500 border-l border-gray-200 dark:border-slate-800 pl-3">Selected Track: <span className="font-bold text-gray-700 dark:text-slate-300">{selectedTrack?.name}</span></div>
            </div>

            <h1 className="text-3xl font-black text-gray-900 dark:text-white text-center mb-2 tracking-tight">Choose your mentor</h1>
            <p className="text-gray-500 dark:text-slate-400 text-center mb-10 text-sm sm:text-base">Your mentor will guide you, review assessments, and provide key reviews</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-10">
              {MENTORS.map(mentor => (
                <button
                  key={mentor.id}
                  onClick={() => setSelectedMentor(mentor)}
                  className={`text-left p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 transition-all hover:scale-[1.02] duration-300 hover:shadow-md ${
                    selectedMentor?.id === mentor.id
                      ? 'border-purple-500 ring-4 ring-purple-100 dark:ring-purple-950/30'
                      : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-4.5 mb-3">
                    <div className="w-11 h-11 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-900/50 font-bold flex items-center justify-center text-sm shadow-inner">
                      {mentor.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base leading-tight">{mentor.name}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 font-medium">{mentor.specialty}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-3 pt-3 border-t border-gray-50 dark:border-slate-800/40 font-semibold">{mentor.students} active students</p>
                </button>
              ))}
            </div>

            <div className="flex justify-center pt-4 border-t border-gray-100 dark:border-slate-900">
              <button
                onClick={handleConfirm}
                disabled={!selectedMentor}
                className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400 disabled:bg-gray-200 dark:disabled:bg-slate-900 disabled:text-gray-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-xl px-10 py-3.5 transition-all text-sm shadow-lg shadow-purple-500/10 dark:shadow-purple-500/20 hover:scale-105 active:scale-95"
              >
                Start Learning 🚀
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function CertificatePage() {
  const { user, enrollment } = useAuth()
  const navigate = useNavigate()
  const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })

  const handlePrint = () => window.print()
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300 pb-16">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 mb-6 flex items-center gap-1.5 transition-all group"
        >
          <span className="inline-block transform group-hover:-translate-x-0.5 transition-transform">←</span> Back to Dashboard
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Your Certificate</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1.5">Congratulations on completing the course!</p>
        </div>

        {/* Certificate */}
        <div id="certificate" className="bg-white dark:bg-slate-900 rounded-3xl border-4 border-purple-200 dark:border-purple-900/60 p-8 sm:p-12 text-center relative overflow-hidden shadow-lg transition-all duration-300">
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-16 h-16 bg-purple-600 dark:bg-purple-500 rounded-br-full opacity-10" />
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-600 dark:bg-purple-500 rounded-bl-full opacity-10" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-600 dark:bg-purple-500 rounded-tr-full opacity-10" />
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-600 dark:bg-purple-500 rounded-tl-full opacity-10" />

          <div className="relative">
            <div className="w-16 h-16 bg-purple-600 dark:bg-purple-500 rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-lg shadow-purple-500/10">
              <span className="text-white text-2xl font-bold">E</span>
            </div>
            <p className="text-xs font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">EduFlick AI Platform</p>
            <p className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-6">Certificate of Completion</p>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-3">This certifies that</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              {user?.name || 'Student Name'}
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-2">has successfully completed</p>
            <h3 className="text-xl sm:text-2xl font-black text-purple-700 dark:text-purple-400 mb-2">{enrollment?.track?.name || 'AI Foundations'}</h3>
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-8">with a passing grade on all module assessments</p>

            <div className="flex justify-center items-center gap-12 mt-8 pt-8 border-t border-gray-100 dark:border-slate-800/60">
              <div className="text-center">
                <div className="w-24 h-0.5 bg-gray-300 dark:bg-slate-700 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-700 dark:text-slate-350">{enrollment?.mentor?.name || 'Mentor'}</p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Mentor</p>
              </div>
              <div className="text-center">
                <p className="text-2xl mb-1">🏆</p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Verified</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-0.5 bg-gray-300 dark:bg-slate-700 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-700 dark:text-slate-350">{today}</p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Date Issued</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center mt-8">
          <button
            onClick={handlePrint}
            className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-600/10 active:scale-95"
          >
            Download / Print
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="border border-gray-250 dark:border-slate-800 text-gray-650 dark:text-slate-400 px-6 py-3.5 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-all active:scale-95"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

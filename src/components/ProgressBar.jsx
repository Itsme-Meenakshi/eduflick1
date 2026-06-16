export default function ProgressBar({ percent, color = 'purple', showLabel = true }) {
  const colors = {
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
  }
  return (
    <div>
      <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
        <div
          className={`${colors[color]} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1.5 font-semibold">{percent}% complete</p>
      )}
    </div>
  )
}

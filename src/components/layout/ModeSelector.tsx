import { useAppStore } from '../../stores/appStore'

export default function ModeSelector() {
  const setMode = useAppStore((s) => s.setMode)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">FRC Scouting</h1>
        <p className="text-gray-400 mb-10">Choose your role to get started</p>
        <div className="flex gap-6">
          <button
            onClick={() => setMode('admin')}
            className="px-8 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xl font-semibold transition-colors cursor-pointer"
          >
            Admin
            <p className="text-sm font-normal text-blue-200 mt-1">Create forms & view data</p>
          </button>
          <button
            onClick={() => setMode('scout')}
            className="px-8 py-6 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xl font-semibold transition-colors cursor-pointer"
          >
            Scout
            <p className="text-sm font-normal text-green-200 mt-1">Fill out forms</p>
          </button>
        </div>
      </div>
    </div>
  )
}

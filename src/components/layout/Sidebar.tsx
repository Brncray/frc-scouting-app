import { Link, useLocation } from 'react-router-dom'
import { useAppStore } from '../../stores/appStore'

interface NavItem {
  label: string
  path: string
}

const adminNav: NavItem[] = [
  { label: 'Forms', path: '/' },
  { label: 'New Form', path: '/builder' },
]

const scoutNav: NavItem[] = [
  { label: 'Forms', path: '/' },
]

export default function Sidebar() {
  const mode = useAppStore((s) => s.mode)
  const resetMode = useAppStore((s) => s.resetMode)
  const location = useLocation()
  const nav = mode === 'admin' ? adminNav : scoutNav

  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-bold text-white">FRC Scouting</h2>
        <span className={`text-xs uppercase tracking-wide ${
          mode === 'admin' ? 'text-blue-400' : 'text-green-400'
        }`}>
          {mode} mode
        </span>
      </div>
      <nav className="flex-1 p-2">
        {nav.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path === '/' && location.pathname === '/')
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded-lg mb-1 text-sm transition-colors ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={() => {
            if (confirm('Switch mode? You can access the same data from either mode.')) {
              resetMode()
            }
          }}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
        >
          Switch Mode
        </button>
      </div>
    </aside>
  )
}

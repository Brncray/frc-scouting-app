import { Link, useNavigate } from 'react-router-dom'
import type { FormDefinition } from '../../types/form'

interface Props {
  forms: FormDefinition[]
  onDelete: (id: string) => void
  onExport?: (form: FormDefinition) => void
}

export default function FormList({ forms, onDelete, onExport }: Props) {
  const navigate = useNavigate()

  if (forms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No forms yet</p>
        <Link
          to="/builder"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
        >
          Create Your First Form
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {forms.map((form) => (
        <div
          key={form.id}
          className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate">{form.name}</h3>
            <p className="text-xs text-gray-500">
              {form.fields.length} fields &middot; {form.source === 'imported' ? 'Imported' : 'Local'}
              &middot; Updated {new Date(form.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            {onExport && (
              <button
                onClick={() => onExport(form)}
                className="px-3 py-1.5 text-xs bg-green-800/50 hover:bg-green-700/50 text-green-400 rounded transition-colors cursor-pointer"
              >
                QR Export
              </button>
            )}
            <button
              onClick={() => navigate(`/builder/${form.id}`)}
              className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => navigate(`/submissions/${form.id}`)}
              className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors cursor-pointer"
            >
              Submissions
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete "${form.name}"?`)) onDelete(form.id)
              }}
              className="px-3 py-1.5 text-xs bg-red-900/50 hover:bg-red-800/50 text-red-400 rounded transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

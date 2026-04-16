import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForm, useSubmissions } from '../hooks/useDatabase'
import SubmissionViewer from '../components/admin/SubmissionViewer'
import DataDashboard from '../components/admin/DataDashboard'

export default function ViewSubmissionsPage() {
  const { formId } = useParams()
  const { form, loading: formLoading } = useForm(formId)
  const { submissions, loading: subLoading, refresh } = useSubmissions(formId)
  const [tab, setTab] = useState<'table' | 'charts'>('table')

  if (formLoading || subLoading) return <p className="text-gray-500">Loading...</p>
  if (!form) return <p className="text-red-400">Form not found</p>

  const handleDelete = async (id: string) => {
    await window.electronAPI.deleteSubmission(id)
    refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <Link to="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            ← Back to Forms
          </Link>
          <h1 className="text-2xl font-bold mt-1">{form.name}</h1>
          <p className="text-sm text-gray-500">{submissions.length} submissions</p>
        </div>
        <div className="flex gap-1 bg-gray-800 rounded-lg p-0.5">
          <button
            onClick={() => setTab('table')}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
              tab === 'table' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setTab('charts')}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
              tab === 'charts' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Charts
          </button>
        </div>
      </div>

      {tab === 'table' ? (
        <SubmissionViewer form={form} submissions={submissions} onDelete={handleDelete} />
      ) : (
        <DataDashboard form={form} submissions={submissions} />
      )}
    </div>
  )
}

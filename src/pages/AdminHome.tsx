import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForms } from '../hooks/useDatabase'
import FormList from '../components/admin/FormList'
import FormExportQR from '../components/admin/FormExportQR'
import SubmissionImporter from '../components/admin/SubmissionImporter'
import type { FormDefinition } from '../types/form'
import type { QREnvelope } from '../lib/qr-codec'

export default function AdminHome() {
  const { forms, loading, refresh } = useForms()
  const [exportForm, setExportForm] = useState<FormDefinition | null>(null)
  const [showImporter, setShowImporter] = useState(false)

  const handleDelete = async (id: string) => {
    await window.electronAPI.deleteForm(id)
    refresh()
  }

  const handleImport = async (envelope: QREnvelope) => {
    if (envelope.type === 'submission') {
      const sub = envelope.data
      const alreadyImported = await window.electronAPI.checkImported(sub.id)
      if (alreadyImported) {
        alert('This submission has already been imported.')
        return
      }
      sub.source = 'imported'
      await window.electronAPI.saveSubmission(sub)
      await window.electronAPI.markImported(sub.id)
      alert(`Submission imported! (Team ${sub.teamNumber || '?'}, Match ${sub.matchNumber || '?'})`)
    } else if (envelope.type === 'form') {
      const form = envelope.data
      form.source = 'imported'
      await window.electronAPI.saveForm(form)
      refresh()
      alert(`Form "${form.name}" imported!`)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Forms</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImporter(!showImporter)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            {showImporter ? 'Hide Scanner' : 'Scan QR'}
          </button>
          <Link
            to="/builder"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            + New Form
          </Link>
        </div>
      </div>

      {showImporter && (
        <div className="mb-6 p-4 bg-gray-900 rounded-xl border border-gray-800">
          <h2 className="text-sm font-semibold text-gray-300 mb-3">Import via QR</h2>
          <SubmissionImporter onImport={handleImport} />
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <FormList
          forms={forms}
          onDelete={handleDelete}
          onExport={setExportForm}
        />
      )}

      {exportForm && (
        <FormExportQR form={exportForm} onClose={() => setExportForm(null)} />
      )}
    </div>
  )
}

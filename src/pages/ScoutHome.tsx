import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForms } from '../hooks/useDatabase'
import FormImporter from '../components/scout/FormImporter'
import type { QREnvelope } from '../lib/qr-codec'

export default function ScoutHome() {
  const { forms, loading, refresh } = useForms()
  const [showImporter, setShowImporter] = useState(false)

  const handleImport = async (envelope: QREnvelope) => {
    if (envelope.type === 'form') {
      const form = envelope.data
      form.source = 'imported'
      await window.electronAPI.saveForm(form)
      refresh()
      alert(`Form "${form.name}" imported!`)
    } else {
      alert('Expected a form QR code, but got a submission.')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Scout Forms</h1>
        <button
          onClick={() => setShowImporter(!showImporter)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          {showImporter ? 'Hide Scanner' : 'Import Form (QR)'}
        </button>
      </div>

      {showImporter && (
        <div className="mb-6 p-4 bg-gray-900 rounded-xl border border-gray-800">
          <FormImporter onImport={handleImport} />
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : forms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No forms available</p>
          <p className="text-gray-600 text-sm">Import a form by scanning a QR code from an admin.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {forms.map((form) => (
            <Link
              key={form.id}
              to={`/fill/${form.id}`}
              className="block p-4 bg-gray-800/50 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <h3 className="text-white font-medium">{form.name}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {form.fields.length} fields &middot; {form.source === 'imported' ? 'Imported' : 'Local'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

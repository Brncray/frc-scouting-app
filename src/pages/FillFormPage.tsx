import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, useSubmissions } from '../hooks/useDatabase'
import FormFiller from '../components/scout/FormFiller'
import SubmissionList from '../components/scout/SubmissionList'
import type { Submission } from '../types/submission'
import QRDisplay from '../components/qr/QRDisplay'
import { encode } from '../lib/qr-codec'

export default function FillFormPage() {
  const { formId } = useParams()
  const navigate = useNavigate()
  const { form, loading } = useForm(formId)
  const { submissions, refresh } = useSubmissions(formId)
  const [submittedData, setSubmittedData] = useState<string[] | null>(null)

  if (loading) return <p className="text-gray-500">Loading form...</p>
  if (!form) return <p className="text-red-400">Form not found</p>

  const handleSubmit = async (submission: Submission) => {
    await window.electronAPI.saveSubmission(submission)
    const qrStrings = encode({ type: 'submission', data: submission })
    setSubmittedData(qrStrings)
    refresh()
  }

  if (submittedData) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Submission Saved!</h2>
        <p className="text-gray-400 text-sm">Show this QR code to the admin to import your data.</p>
        <QRDisplay qrStrings={submittedData} />
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setSubmittedData(null)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors cursor-pointer"
          >
            Fill Another
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Back to Forms
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <FormFiller form={form} onSubmit={handleSubmit} />
      <SubmissionList form={form} submissions={submissions} />
    </div>
  )
}

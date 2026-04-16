import { useState } from 'react'
import type { Submission } from '../../types/submission'
import type { FormDefinition } from '../../types/form'
import { encode } from '../../lib/qr-codec'
import QRDisplay from '../qr/QRDisplay'

interface Props {
  form: FormDefinition
  submissions: Submission[]
}

export default function SubmissionList({ form, submissions }: Props) {
  const [exportId, setExportId] = useState<string | null>(null)

  if (submissions.length === 0) return null

  const exportSub = submissions.find((s) => s.id === exportId)

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-400">Past Submissions</h3>
      {submissions.map((sub) => (
        <div
          key={sub.id}
          className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-800"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white">
              Match {sub.matchNumber ?? '?'} — Team {sub.teamNumber ?? '?'}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(sub.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => setExportId(exportId === sub.id ? null : sub.id)}
            className="px-3 py-1.5 text-xs bg-green-800/50 hover:bg-green-700/50 text-green-400 rounded transition-colors cursor-pointer"
          >
            {exportId === sub.id ? 'Hide QR' : 'Show QR'}
          </button>
        </div>
      ))}

      {exportSub && (
        <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
          <QRDisplay qrStrings={encode({ type: 'submission', data: exportSub })} />
        </div>
      )}
    </div>
  )
}

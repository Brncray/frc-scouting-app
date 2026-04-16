import { useState } from 'react'
import type { Submission } from '../../types/submission'
import type { FormDefinition } from '../../types/form'

interface Props {
  form: FormDefinition
  submissions: Submission[]
  onDelete: (id: string) => void
}

type SortKey = 'matchNumber' | 'teamNumber' | 'scoutName' | 'createdAt'

export default function SubmissionViewer({ form, submissions, onDelete }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...submissions].sort((a, b) => {
    let av = a[sortKey] ?? ''
    let bv = b[sortKey] ?? ''
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDir === 'asc' ? av - bv : bv - av
    }
    return sortDir === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av))
  })

  if (submissions.length === 0) {
    return <p className="text-gray-500 text-sm">No submissions yet.</p>
  }

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      onClick={() => toggleSort(field)}
      className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase cursor-pointer hover:text-gray-200"
    >
      {label} {sortKey === field ? (sortDir === 'asc' ? '↑' : '↓') : ''}
    </th>
  )

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            <SortHeader label="Match" field="matchNumber" />
            <SortHeader label="Team" field="teamNumber" />
            <SortHeader label="Scout" field="scoutName" />
            {form.fields.map((f) => (
              <th key={f.id} className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                {f.label}
              </th>
            ))}
            <SortHeader label="Date" field="createdAt" />
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((sub) => (
            <tr key={sub.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
              <td className="px-3 py-2 text-gray-300">{sub.matchNumber ?? '-'}</td>
              <td className="px-3 py-2 text-gray-300">{sub.teamNumber ?? '-'}</td>
              <td className="px-3 py-2 text-gray-300">{sub.scoutName || '-'}</td>
              {form.fields.map((f) => (
                <td key={f.id} className="px-3 py-2 text-gray-300">
                  {formatValue(f.type, sub.values[f.id])}
                </td>
              ))}
              <td className="px-3 py-2 text-gray-500 text-xs">
                {new Date(sub.createdAt).toLocaleString()}
              </td>
              <td className="px-3 py-2">
                <button
                  onClick={() => {
                    if (confirm('Delete this submission?')) onDelete(sub.id)
                  }}
                  className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatValue(type: string, value: any): string {
  if (value === undefined || value === null) return '-'
  if (type === 'checkbox') return value ? 'Yes' : 'No'
  if (type === 'stopwatch') return `${Number(value).toFixed(1)}s`
  if (type === 'image_annotation') return value?.objects?.length ? `${value.objects.length} marks` : '-'
  if (type === 'rating') return '★'.repeat(value)
  return String(value)
}

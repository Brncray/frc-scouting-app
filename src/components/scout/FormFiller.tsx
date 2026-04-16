import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { FormDefinition } from '../../types/form'
import type { Submission } from '../../types/submission'
import FieldRenderer from '../fields/FieldRenderer'

interface Props {
  form: FormDefinition
  onSubmit: (submission: Submission) => void
}

export default function FormFiller({ form, onSubmit }: Props) {
  const [values, setValues] = useState<Record<string, any>>({})
  const [matchNumber, setMatchNumber] = useState<string>('')
  const [teamNumber, setTeamNumber] = useState<string>('')
  const [scoutName, setScoutName] = useState<string>('')

  const setValue = (fieldId: string, value: any) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleSubmit = () => {
    // Validate required fields
    for (const field of form.fields) {
      if (field.required) {
        const v = values[field.id]
        if (v === undefined || v === null || v === '') {
          alert(`"${field.label}" is required`)
          return
        }
      }
    }

    const submission: Submission = {
      id: uuid(),
      formId: form.id,
      matchNumber: matchNumber ? parseInt(matchNumber) : null,
      teamNumber: teamNumber ? parseInt(teamNumber) : null,
      scoutName,
      values,
      createdAt: new Date().toISOString(),
      exported: false,
      source: 'local',
    }

    onSubmit(submission)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">{form.name}</h2>
        {form.description && <p className="text-sm text-gray-400 mt-1">{form.description}</p>}
      </div>

      {/* Match metadata */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Match #</label>
          <input
            type="number"
            value={matchNumber}
            onChange={(e) => setMatchNumber(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Team #</label>
          <input
            type="number"
            value={teamNumber}
            onChange={(e) => setTeamNumber(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Scout Name</label>
          <input
            type="text"
            value={scoutName}
            onChange={(e) => setScoutName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-5">
        {form.fields.map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={values[field.id]}
            onChange={(v) => setValue(field.id, v)}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors cursor-pointer"
      >
        Submit
      </button>
    </div>
  )
}

import type { FieldDefinition } from '../../types/form'

interface Props {
  field: FieldDefinition
  value: string
  onChange: (value: string) => void
}

export default function DropdownField({ field, value, onChange }: Props) {
  const options: string[] = field.config.options || []

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
    >
      <option value="">Select...</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}

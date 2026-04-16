import type { FieldDefinition } from '../../types/form'

interface Props {
  field: FieldDefinition
  value: number | null
  onChange: (value: number | null) => void
}

export default function NumberField({ field, value, onChange }: Props) {
  const { min, max } = field.config

  return (
    <input
      type="number"
      value={value ?? ''}
      min={min}
      max={max}
      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
    />
  )
}

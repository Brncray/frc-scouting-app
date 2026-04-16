import type { FieldDefinition } from '../../types/form'

interface Props {
  field: FieldDefinition
  value: boolean
  onChange: (value: boolean) => void
}

export default function CheckboxField({ field, value, onChange }: Props) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={value || false}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
      />
      <span className="text-sm text-gray-300">Yes</span>
    </label>
  )
}

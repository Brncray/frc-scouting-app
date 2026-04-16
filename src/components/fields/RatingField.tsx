import type { FieldDefinition } from '../../types/form'

interface Props {
  field: FieldDefinition
  value: number
  onChange: (value: number) => void
}

export default function RatingField({ field, value, onChange }: Props) {
  const max = field.config.max || 5
  const current = value || 0

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          onClick={() => onChange(star === current ? 0 : star)}
          className={`text-2xl cursor-pointer transition-colors ${
            star <= current ? 'text-yellow-400' : 'text-gray-600'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

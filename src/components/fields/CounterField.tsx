import type { FieldDefinition } from '../../types/form'

interface Props {
  field: FieldDefinition
  value: number
  onChange: (value: number) => void
}

export default function CounterField({ field, value, onChange }: Props) {
  const { min = 0, max = 99, step = 1 } = field.config
  const current = value ?? 0

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, current - step))}
        disabled={current <= min}
        className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg text-lg font-bold transition-colors cursor-pointer disabled:cursor-not-allowed"
      >
        -
      </button>
      <span className="w-12 text-center text-xl font-mono text-white">{current}</span>
      <button
        onClick={() => onChange(Math.min(max, current + step))}
        disabled={current >= max}
        className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg text-lg font-bold transition-colors cursor-pointer disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  )
}

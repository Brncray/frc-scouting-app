import type { FieldType } from '../../types/form'
import { fieldTypeLabels, fieldTypeIcons } from '../../lib/field-defaults'
import { useFormBuilderStore } from '../../stores/formBuilderStore'

const fieldTypes: FieldType[] = [
  'text', 'number', 'counter', 'checkbox',
  'dropdown', 'rating', 'stopwatch', 'image_annotation',
]

export default function FieldPalette() {
  const addField = useFormBuilderStore((s) => s.addField)

  return (
    <div className="w-48 space-y-1">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        Add Field
      </h3>
      {fieldTypes.map((type) => (
        <button
          key={type}
          onClick={() => addField(type)}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-left cursor-pointer"
        >
          <span className="w-6 text-center text-base">{fieldTypeIcons[type]}</span>
          <span>{fieldTypeLabels[type]}</span>
        </button>
      ))}
    </div>
  )
}

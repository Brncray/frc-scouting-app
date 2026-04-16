import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { FieldDefinition } from '../../types/form'
import { fieldTypeLabels, fieldTypeIcons } from '../../lib/field-defaults'
import { useFormBuilderStore } from '../../stores/formBuilderStore'

interface Props {
  field: FieldDefinition
  isSelected: boolean
}

export default function FieldPreviewCard({ field, isSelected }: Props) {
  const selectField = useFormBuilderStore((s) => s.selectField)
  const removeField = useFormBuilderStore((s) => s.removeField)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => selectField(field.id)}
      className={`flex items-center gap-3 px-3 py-3 rounded-lg border cursor-pointer transition-colors ${
        isSelected
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-500 hover:text-gray-300 px-1"
        onClick={(e) => e.stopPropagation()}
      >
        ⠿
      </button>
      <span className="w-6 text-center text-gray-400">{fieldTypeIcons[field.type]}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-white truncate">{field.label}</div>
        <div className="text-xs text-gray-500">{fieldTypeLabels[field.type]}</div>
      </div>
      {field.required && (
        <span className="text-xs text-red-400">*</span>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation()
          removeField(field.id)
        }}
        className="text-gray-600 hover:text-red-400 transition-colors cursor-pointer"
      >
        ✕
      </button>
    </div>
  )
}

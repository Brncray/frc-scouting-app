import { useFormBuilderStore } from '../../stores/formBuilderStore'
import FieldPalette from './FieldPalette'
import FormCanvas from './FormCanvas'
import FieldConfigPanel from './FieldConfigPanel'

interface Props {
  onSave: () => void
}

export default function FormBuilder({ onSave }: Props) {
  const formName = useFormBuilderStore((s) => s.formName)
  const formDescription = useFormBuilderStore((s) => s.formDescription)
  const setFormName = useFormBuilderStore((s) => s.setFormName)
  const setFormDescription = useFormBuilderStore((s) => s.setFormDescription)
  const fields = useFormBuilderStore((s) => s.fields)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Form name..."
            className="w-full text-xl font-bold bg-transparent border-b border-gray-700 focus:border-blue-500 text-white focus:outline-none pb-1"
          />
          <input
            type="text"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full text-sm bg-transparent border-b border-gray-800 focus:border-gray-600 text-gray-400 focus:outline-none pb-1"
          />
        </div>
        <button
          onClick={onSave}
          disabled={fields.length === 0}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          Save Form
        </button>
      </div>

      {/* Builder area */}
      <div className="flex gap-4 flex-1 min-h-0">
        <FieldPalette />
        <FormCanvas />
        <FieldConfigPanel />
      </div>
    </div>
  )
}

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useFormBuilderStore } from '../../stores/formBuilderStore'
import FieldPreviewCard from './FieldPreviewCard'

export default function FormCanvas() {
  const fields = useFormBuilderStore((s) => s.fields)
  const selectedFieldId = useFormBuilderStore((s) => s.selectedFieldId)
  const reorderFields = useFormBuilderStore((s) => s.reorderFields)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id)
      const newIndex = fields.findIndex((f) => f.id === over.id)
      reorderFields(oldIndex, newIndex)
    }
  }

  if (fields.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-xl">
        <p className="text-gray-500">Click a field type on the left to add it</p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-2 overflow-auto">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          {fields.map((field) => (
            <FieldPreviewCard
              key={field.id}
              field={field}
              isSelected={field.id === selectedFieldId}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}

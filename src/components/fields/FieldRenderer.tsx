import type { FieldDefinition } from '../../types/form'
import TextField from './TextField'
import NumberField from './NumberField'
import CounterField from './CounterField'
import CheckboxField from './CheckboxField'
import DropdownField from './DropdownField'
import RatingField from './RatingField'
import StopwatchField from './StopwatchField'
import ImageAnnotationField from './ImageAnnotationField'

interface Props {
  field: FieldDefinition
  value: any
  onChange: (value: any) => void
  readOnly?: boolean
}

export default function FieldRenderer({ field, value, onChange, readOnly }: Props) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-300">
        {field.label}
        {field.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {field.type === 'text' && <TextField field={field} value={value} onChange={onChange} />}
      {field.type === 'number' && <NumberField field={field} value={value} onChange={onChange} />}
      {field.type === 'counter' && <CounterField field={field} value={value ?? 0} onChange={onChange} />}
      {field.type === 'checkbox' && <CheckboxField field={field} value={value} onChange={onChange} />}
      {field.type === 'dropdown' && <DropdownField field={field} value={value} onChange={onChange} />}
      {field.type === 'rating' && <RatingField field={field} value={value ?? 0} onChange={onChange} />}
      {field.type === 'stopwatch' && <StopwatchField field={field} value={value ?? 0} onChange={onChange} />}
      {field.type === 'image_annotation' && (
        <ImageAnnotationField field={field} value={value} onChange={onChange} readOnly={readOnly} />
      )}
    </div>
  )
}

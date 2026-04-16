import type { FieldType } from '../types/form'

export const fieldTypeLabels: Record<FieldType, string> = {
  counter: 'Counter',
  checkbox: 'Checkbox',
  dropdown: 'Dropdown',
  number: 'Number',
  text: 'Text',
  rating: 'Rating',
  stopwatch: 'Stopwatch',
  image_annotation: 'Image Annotation',
}

export const fieldTypeIcons: Record<FieldType, string> = {
  counter: '+/-',
  checkbox: '☑',
  dropdown: '▼',
  number: '#',
  text: 'Aa',
  rating: '★',
  stopwatch: '⏱',
  image_annotation: '🖊',
}

export function getDefaultConfig(type: FieldType): Record<string, any> {
  switch (type) {
    case 'counter':
      return { min: 0, max: 99, step: 1 }
    case 'checkbox':
      return {}
    case 'dropdown':
      return { options: ['Option 1', 'Option 2'] }
    case 'number':
      return { min: 0, max: 9999 }
    case 'text':
      return { placeholder: '', multiline: false }
    case 'rating':
      return { max: 5 }
    case 'stopwatch':
      return {}
    case 'image_annotation':
      return { baseImageBase64: '' }
    default:
      return {}
  }
}

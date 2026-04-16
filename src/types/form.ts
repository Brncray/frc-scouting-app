export type FieldType =
  | 'counter'
  | 'checkbox'
  | 'dropdown'
  | 'number'
  | 'text'
  | 'rating'
  | 'stopwatch'
  | 'image_annotation'

export interface FieldDefinition {
  id: string
  type: FieldType
  label: string
  required: boolean
  order: number
  config: Record<string, any>
}

export interface FormDefinition {
  id: string
  name: string
  description: string
  version: number
  fields: FieldDefinition[]
  createdAt: string
  updatedAt: string
  source: 'local' | 'imported'
}

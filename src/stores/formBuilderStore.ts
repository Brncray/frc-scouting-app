import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import type { FieldDefinition, FieldType, FormDefinition } from '../types/form'
import { getDefaultConfig } from '../lib/field-defaults'

interface FormBuilderState {
  formId: string
  formName: string
  formDescription: string
  fields: FieldDefinition[]
  selectedFieldId: string | null
  isDirty: boolean

  setFormName: (name: string) => void
  setFormDescription: (desc: string) => void
  addField: (type: FieldType) => void
  removeField: (id: string) => void
  reorderFields: (oldIndex: number, newIndex: number) => void
  selectField: (id: string | null) => void
  updateField: (id: string, updates: Partial<FieldDefinition>) => void
  loadForm: (form: FormDefinition) => void
  reset: () => void
  toFormDefinition: () => FormDefinition
}

export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
  formId: uuid(),
  formName: '',
  formDescription: '',
  fields: [],
  selectedFieldId: null,
  isDirty: false,

  setFormName: (name) => set({ formName: name, isDirty: true }),
  setFormDescription: (desc) => set({ formDescription: desc, isDirty: true }),

  addField: (type) => {
    const field: FieldDefinition = {
      id: uuid(),
      type,
      label: `New ${type} field`,
      required: false,
      order: get().fields.length,
      config: getDefaultConfig(type),
    }
    set((s) => ({
      fields: [...s.fields, field],
      selectedFieldId: field.id,
      isDirty: true,
    }))
  },

  removeField: (id) =>
    set((s) => ({
      fields: s.fields.filter((f) => f.id !== id).map((f, i) => ({ ...f, order: i })),
      selectedFieldId: s.selectedFieldId === id ? null : s.selectedFieldId,
      isDirty: true,
    })),

  reorderFields: (oldIndex, newIndex) =>
    set((s) => {
      const fields = [...s.fields]
      const [moved] = fields.splice(oldIndex, 1)
      fields.splice(newIndex, 0, moved)
      return { fields: fields.map((f, i) => ({ ...f, order: i })), isDirty: true }
    }),

  selectField: (id) => set({ selectedFieldId: id }),

  updateField: (id, updates) =>
    set((s) => ({
      fields: s.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
      isDirty: true,
    })),

  loadForm: (form) =>
    set({
      formId: form.id,
      formName: form.name,
      formDescription: form.description,
      fields: form.fields,
      selectedFieldId: null,
      isDirty: false,
    }),

  reset: () =>
    set({
      formId: uuid(),
      formName: '',
      formDescription: '',
      fields: [],
      selectedFieldId: null,
      isDirty: false,
    }),

  toFormDefinition: (): FormDefinition => {
    const s = get()
    const now = new Date().toISOString()
    return {
      id: s.formId,
      name: s.formName || 'Untitled Form',
      description: s.formDescription,
      version: 1,
      fields: s.fields,
      createdAt: now,
      updatedAt: now,
      source: 'local',
    }
  },
}))

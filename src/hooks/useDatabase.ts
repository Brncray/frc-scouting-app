import { useState, useEffect, useCallback } from 'react'
import type { FormDefinition } from '../types/form'
import type { Submission } from '../types/submission'

export function useForms() {
  const [forms, setForms] = useState<FormDefinition[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await window.electronAPI.getForms()
    setForms(data)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return { forms, loading, refresh }
}

export function useForm(id: string | undefined) {
  const [form, setForm] = useState<FormDefinition | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    window.electronAPI.getForm(id).then((data) => {
      setForm(data)
      setLoading(false)
    })
  }, [id])

  return { form, loading }
}

export function useSubmissions(formId: string | undefined) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!formId) { setLoading(false); return }
    setLoading(true)
    const data = await window.electronAPI.getSubmissions(formId)
    setSubmissions(data)
    setLoading(false)
  }, [formId])

  useEffect(() => { refresh() }, [refresh])

  return { submissions, loading, refresh }
}

import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FormBuilder from '../components/admin/FormBuilder'
import { useFormBuilderStore } from '../stores/formBuilderStore'
import { useForm } from '../hooks/useDatabase'

export default function BuilderPage() {
  const { formId } = useParams()
  const navigate = useNavigate()
  const { form, loading } = useForm(formId)
  const loadForm = useFormBuilderStore((s) => s.loadForm)
  const reset = useFormBuilderStore((s) => s.reset)
  const toFormDefinition = useFormBuilderStore((s) => s.toFormDefinition)

  useEffect(() => {
    if (formId && form) {
      loadForm(form)
    } else if (!formId) {
      reset()
    }
  }, [formId, form])

  const handleSave = async () => {
    const formDef = toFormDefinition()
    await window.electronAPI.saveForm(formDef)
    navigate('/')
  }

  if (formId && loading) {
    return <p className="text-gray-500">Loading form...</p>
  }

  return (
    <div className="h-full flex flex-col">
      <FormBuilder onSave={handleSave} />
    </div>
  )
}

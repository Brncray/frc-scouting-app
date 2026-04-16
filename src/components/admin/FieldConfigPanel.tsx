import { useFormBuilderStore } from '../../stores/formBuilderStore'
import { fieldTypeLabels } from '../../lib/field-defaults'

export default function FieldConfigPanel() {
  const fields = useFormBuilderStore((s) => s.fields)
  const selectedFieldId = useFormBuilderStore((s) => s.selectedFieldId)
  const updateField = useFormBuilderStore((s) => s.updateField)

  const field = fields.find((f) => f.id === selectedFieldId)

  if (!field) {
    return (
      <div className="w-64 p-4 text-gray-500 text-sm">
        Select a field to configure it
      </div>
    )
  }

  const updateConfig = (key: string, value: any) => {
    updateField(field.id, { config: { ...field.config, [key]: value } })
  }

  return (
    <div className="w-64 p-4 border-l border-gray-800 space-y-4 overflow-auto">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {fieldTypeLabels[field.type]} Settings
      </h3>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Label</label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => updateField(field.id, { label: e.target.value })}
          className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => updateField(field.id, { required: e.target.checked })}
          className="rounded"
        />
        <label className="text-sm text-gray-300">Required</label>
      </div>

      {/* Type-specific config */}
      {field.type === 'counter' && (
        <>
          <NumberConfigRow label="Min" value={field.config.min} onChange={(v) => updateConfig('min', v)} />
          <NumberConfigRow label="Max" value={field.config.max} onChange={(v) => updateConfig('max', v)} />
          <NumberConfigRow label="Step" value={field.config.step} onChange={(v) => updateConfig('step', v)} />
        </>
      )}

      {field.type === 'number' && (
        <>
          <NumberConfigRow label="Min" value={field.config.min} onChange={(v) => updateConfig('min', v)} />
          <NumberConfigRow label="Max" value={field.config.max} onChange={(v) => updateConfig('max', v)} />
        </>
      )}

      {field.type === 'rating' && (
        <NumberConfigRow label="Max Stars" value={field.config.max} onChange={(v) => updateConfig('max', v)} />
      )}

      {field.type === 'text' && (
        <>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Placeholder</label>
            <input
              type="text"
              value={field.config.placeholder || ''}
              onChange={(e) => updateConfig('placeholder', e.target.value)}
              className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={field.config.multiline || false}
              onChange={(e) => updateConfig('multiline', e.target.checked)}
              className="rounded"
            />
            <label className="text-sm text-gray-300">Multiline</label>
          </div>
        </>
      )}

      {field.type === 'dropdown' && (
        <div>
          <label className="block text-xs text-gray-400 mb-1">Options (one per line)</label>
          <textarea
            value={(field.config.options || []).join('\n')}
            onChange={(e) =>
              updateConfig('options', e.target.value.split('\n').filter((o: string) => o.trim()))
            }
            rows={5}
            className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>
      )}

      {field.type === 'image_annotation' && (
        <div>
          <label className="block text-xs text-gray-400 mb-1">Base Image</label>
          {field.config.baseImageBase64 ? (
            <div className="space-y-2">
              <img
                src={field.config.baseImageBase64}
                alt="Base"
                className="w-full rounded border border-gray-700"
              />
              <button
                onClick={() => updateConfig('baseImageBase64', '')}
                className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
              >
                Remove image
              </button>
            </div>
          ) : (
            <button
              onClick={async () => {
                const result = await window.electronAPI.openFileDialog({
                  filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'webp'] }],
                  properties: ['openFile'],
                })
                if (!result.canceled && result.filePaths[0]) {
                  // Read and downsample in renderer using canvas
                  const img = new Image()
                  img.onload = () => {
                    const canvas = document.createElement('canvas')
                    const maxW = 640, maxH = 480
                    let w = img.width, h = img.height
                    if (w > maxW || h > maxH) {
                      const ratio = Math.min(maxW / w, maxH / h)
                      w = Math.round(w * ratio)
                      h = Math.round(h * ratio)
                    }
                    canvas.width = w
                    canvas.height = h
                    const ctx = canvas.getContext('2d')!
                    ctx.drawImage(img, 0, 0, w, h)
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.5)
                    updateConfig('baseImageBase64', dataUrl)
                  }
                  // Use file:// protocol to load the image
                  img.src = `file://${result.filePaths[0].replace(/\\/g, '/')}`
                }
              }}
              className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-sm text-gray-300 rounded transition-colors cursor-pointer"
            >
              Import Image...
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function NumberConfigRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-blue-500"
      />
    </div>
  )
}

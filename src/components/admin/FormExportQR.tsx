import { useMemo } from 'react'
import type { FormDefinition } from '../../types/form'
import { encode } from '../../lib/qr-codec'
import QRDisplay from '../qr/QRDisplay'

interface Props {
  form: FormDefinition
  onClose: () => void
}

export default function FormExportQR({ form, onClose }: Props) {
  const qrStrings = useMemo(() => encode({ type: 'form', data: form }), [form])

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full space-y-4">
        <h2 className="text-lg font-bold text-white">Export: {form.name}</h2>
        <p className="text-sm text-gray-400">
          {qrStrings.length === 1
            ? 'Scan this QR code on the scout device to import the form.'
            : `This form requires ${qrStrings.length} QR codes. Scan each one on the scout device.`}
        </p>
        <QRDisplay qrStrings={qrStrings} />
        <button
          onClick={onClose}
          className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  )
}

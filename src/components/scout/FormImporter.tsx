import { useState, useRef } from 'react'
import QRScanner from '../qr/QRScanner'
import QRProgressIndicator from '../qr/QRProgressIndicator'
import { QRDecoder, type QREnvelope } from '../../lib/qr-codec'

interface Props {
  onImport: (envelope: QREnvelope) => void
}

export default function FormImporter({ onImport }: Props) {
  const decoderRef = useRef(new QRDecoder())
  const [progress, setProgress] = useState<{ scanned: number; total: number } | null>(null)
  const [error, setError] = useState<string>('')
  const [done, setDone] = useState(false)

  const handleScan = (data: string) => {
    try {
      const result = decoderRef.current.feed(data)
      if (result) {
        setDone(true)
        onImport(result)
      } else {
        const id = decoderRef.current.getActiveId()
        if (id) {
          setProgress(decoderRef.current.getProgress(id))
        }
      }
      setError('')
    } catch (e: any) {
      setError('Invalid QR code: ' + e.message)
    }
  }

  const handleReset = () => {
    decoderRef.current.reset()
    setProgress(null)
    setError('')
    setDone(false)
  }

  if (done) {
    return (
      <div className="text-center space-y-4">
        <p className="text-green-400 font-medium">Form imported successfully!</p>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm cursor-pointer transition-colors"
        >
          Scan Another
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-300">Scan Form QR Code</h3>
      <QRScanner onScan={handleScan} onError={setError} />
      {progress && <QRProgressIndicator scanned={progress.scanned} total={progress.total} />}
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
    </div>
  )
}

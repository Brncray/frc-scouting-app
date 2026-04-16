import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

interface Props {
  onScan: (data: string) => void
  onError?: (error: string) => void
  scanning?: boolean
}

export default function QRScanner({ onScan, onError, scanning = true }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [started, setStarted] = useState(false)
  const lastScanRef = useRef<string>('')

  useEffect(() => {
    if (!scanning || !containerRef.current) return

    const scannerId = 'qr-scanner-' + Date.now()
    containerRef.current.id = scannerId

    const scanner = new Html5Qrcode(scannerId)
    scannerRef.current = scanner

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // Deduplicate rapid-fire scans of same code
          if (decodedText !== lastScanRef.current) {
            lastScanRef.current = decodedText
            onScan(decodedText)
            // Reset after a short delay to allow re-scanning same code
            setTimeout(() => { lastScanRef.current = '' }, 1500)
          }
        },
        () => {} // ignore scan failures (expected while searching)
      )
      .then(() => setStarted(true))
      .catch((err) => {
        onError?.(err?.message || 'Camera access denied')
      })

    return () => {
      if (scannerRef.current && started) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [scanning])

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="w-full max-w-md mx-auto rounded-lg overflow-hidden bg-gray-900"
        style={{ minHeight: 300 }}
      />
      {!started && scanning && (
        <p className="text-center text-sm text-gray-500">Starting camera...</p>
      )}
    </div>
  )
}

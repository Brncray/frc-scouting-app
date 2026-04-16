import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface Props {
  qrStrings: string[]
}

export default function QRDisplay({ qrStrings }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dataUrl, setDataUrl] = useState<string>('')
  const [autoPlay, setAutoPlay] = useState(qrStrings.length > 1)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)

  useEffect(() => {
    QRCode.toDataURL(qrStrings[currentIndex], {
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#000000', light: '#ffffff' },
    }).then(setDataUrl)
  }, [currentIndex, qrStrings])

  useEffect(() => {
    if (autoPlay && qrStrings.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((i) => (i + 1) % qrStrings.length)
      }, 2000)
      return () => clearInterval(intervalRef.current)
    }
  }, [autoPlay, qrStrings.length])

  return (
    <div className="flex flex-col items-center gap-3">
      {dataUrl && (
        <img src={dataUrl} alt="QR Code" className="rounded-lg" />
      )}
      {qrStrings.length > 1 && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setAutoPlay(false)
              setCurrentIndex((i) => (i - 1 + qrStrings.length) % qrStrings.length)
            }}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm cursor-pointer"
          >
            ←
          </button>
          <span className="text-sm text-gray-400">
            {currentIndex + 1} / {qrStrings.length}
          </span>
          <button
            onClick={() => {
              setAutoPlay(false)
              setCurrentIndex((i) => (i + 1) % qrStrings.length)
            }}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm cursor-pointer"
          >
            →
          </button>
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-2 py-1 text-sm rounded cursor-pointer ${
              autoPlay ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            {autoPlay ? 'Pause' : 'Auto'}
          </button>
        </div>
      )}
    </div>
  )
}

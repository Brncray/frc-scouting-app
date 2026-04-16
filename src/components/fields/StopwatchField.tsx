import { useState, useRef, useCallback } from 'react'
import type { FieldDefinition } from '../../types/form'

interface Props {
  field: FieldDefinition
  value: number
  onChange: (value: number) => void
}

export default function StopwatchField({ field, value, onChange }: Props) {
  const [running, setRunning] = useState(false)
  const [display, setDisplay] = useState(value || 0)
  const startRef = useRef<number>(0)
  const rafRef = useRef<number>(0)

  const tick = useCallback(() => {
    const elapsed = (Date.now() - startRef.current) / 1000
    setDisplay(elapsed)
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const start = () => {
    startRef.current = Date.now() - display * 1000
    setRunning(true)
    rafRef.current = requestAnimationFrame(tick)
  }

  const stop = () => {
    cancelAnimationFrame(rafRef.current)
    setRunning(false)
    onChange(display)
  }

  const reset = () => {
    cancelAnimationFrame(rafRef.current)
    setRunning(false)
    setDisplay(0)
    onChange(0)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 10)
    return `${m}:${s.toString().padStart(2, '0')}.${ms}`
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-2xl font-mono text-white w-24">{formatTime(display)}</span>
      <div className="flex gap-2">
        {!running ? (
          <button
            onClick={start}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-colors cursor-pointer"
          >
            Start
          </button>
        ) : (
          <button
            onClick={stop}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg transition-colors cursor-pointer"
          >
            Stop
          </button>
        )}
        <button
          onClick={reset}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

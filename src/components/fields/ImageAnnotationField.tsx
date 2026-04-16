import { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Image as KonvaImage, Line, Arrow, Circle, Text } from 'react-konva'
import type { FieldDefinition } from '../../types/form'

type Tool = 'freehand' | 'arrow' | 'circle'
type DrawObj =
  | { type: 'line'; points: number[]; stroke: string; strokeWidth: number }
  | { type: 'arrow'; points: number[]; stroke: string }
  | { type: 'circle'; x: number; y: number; radius: number; fill: string }

interface AnnotationValue {
  objects: DrawObj[]
}

interface Props {
  field: FieldDefinition
  value: AnnotationValue | null
  onChange: (value: AnnotationValue) => void
  readOnly?: boolean
}

const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308']

export default function ImageAnnotationField({ field, value, onChange, readOnly }: Props) {
  const [tool, setTool] = useState<Tool>('freehand')
  const [color, setColor] = useState(COLORS[0])
  const [objects, setObjects] = useState<DrawObj[]>(value?.objects || [])
  const [isDrawing, setIsDrawing] = useState(false)
  const [arrowStart, setArrowStart] = useState<{ x: number; y: number } | null>(null)
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null)
  const stageRef = useRef<any>(null)

  const baseImage = field.config.baseImageBase64

  useEffect(() => {
    if (baseImage) {
      const img = new window.Image()
      img.onload = () => setBgImage(img)
      img.src = baseImage
    }
  }, [baseImage])

  useEffect(() => {
    if (value?.objects) setObjects(value.objects)
  }, [value])

  const stageWidth = bgImage ? Math.min(bgImage.width, 640) : 640
  const stageHeight = bgImage ? Math.min(bgImage.height, 480) : 480

  const commit = (objs: DrawObj[]) => {
    setObjects(objs)
    onChange({ objects: objs })
  }

  const handlePointerDown = (e: any) => {
    if (readOnly) return
    const pos = e.target.getStage().getPointerPosition()
    if (!pos) return

    if (tool === 'freehand') {
      setIsDrawing(true)
      setObjects([...objects, { type: 'line', points: [pos.x, pos.y], stroke: color, strokeWidth: 3 }])
    } else if (tool === 'arrow') {
      if (!arrowStart) {
        setArrowStart(pos)
      } else {
        const newObj: DrawObj = { type: 'arrow', points: [arrowStart.x, arrowStart.y, pos.x, pos.y], stroke: color }
        commit([...objects, newObj])
        setArrowStart(null)
      }
    } else if (tool === 'circle') {
      const newObj: DrawObj = { type: 'circle', x: pos.x, y: pos.y, radius: 12, fill: color }
      commit([...objects, newObj])
    }
  }

  const handlePointerMove = (e: any) => {
    if (!isDrawing || tool !== 'freehand' || readOnly) return
    const pos = e.target.getStage().getPointerPosition()
    if (!pos) return
    const updated = [...objects]
    const last = updated[updated.length - 1]
    if (last && last.type === 'line') {
      last.points = [...last.points, pos.x, pos.y]
      setObjects([...updated])
    }
  }

  const handlePointerUp = () => {
    if (isDrawing) {
      setIsDrawing(false)
      commit(objects)
    }
  }

  const undo = () => {
    const updated = objects.slice(0, -1)
    commit(updated)
  }

  const clearAll = () => commit([])

  if (!baseImage) {
    return <p className="text-gray-500 text-sm">No base image configured for this field.</p>
  }

  return (
    <div className="space-y-2">
      {!readOnly && (
        <div className="flex items-center gap-2 flex-wrap">
          {(['freehand', 'arrow', 'circle'] as Tool[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTool(t); setArrowStart(null) }}
              className={`px-3 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                tool === t ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {t === 'freehand' ? 'Draw' : t === 'arrow' ? 'Arrow' : 'Marker'}
            </button>
          ))}
          <div className="w-px h-5 bg-gray-700 mx-1" />
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                color === c ? 'border-white' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
          <div className="w-px h-5 bg-gray-700 mx-1" />
          <button
            onClick={undo}
            className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors cursor-pointer"
          >
            Undo
          </button>
          <button
            onClick={clearAll}
            className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors cursor-pointer"
          >
            Clear
          </button>
          {arrowStart && (
            <span className="text-xs text-yellow-400">Click endpoint for arrow</span>
          )}
        </div>
      )}
      <div className="border border-gray-700 rounded-lg overflow-hidden inline-block">
        <Stage
          ref={stageRef}
          width={stageWidth}
          height={stageHeight}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <Layer>
            <KonvaImage image={bgImage ?? undefined} width={stageWidth} height={stageHeight} />
          </Layer>
          <Layer>
            {objects.map((obj, i) => {
              if (obj.type === 'line') {
                return (
                  <Line
                    key={i}
                    points={obj.points}
                    stroke={obj.stroke}
                    strokeWidth={obj.strokeWidth}
                    lineCap="round"
                    lineJoin="round"
                  />
                )
              }
              if (obj.type === 'arrow') {
                return (
                  <Arrow
                    key={i}
                    points={obj.points}
                    stroke={obj.stroke}
                    fill={obj.stroke}
                    strokeWidth={3}
                    pointerLength={10}
                    pointerWidth={8}
                  />
                )
              }
              if (obj.type === 'circle') {
                return (
                  <Circle
                    key={i}
                    x={obj.x}
                    y={obj.y}
                    radius={obj.radius}
                    fill={obj.fill}
                    opacity={0.7}
                  />
                )
              }
              return null
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

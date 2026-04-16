import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import type { FormDefinition } from '../../types/form'
import type { Submission } from '../../types/submission'

interface Props {
  form: FormDefinition
  submissions: Submission[]
}

const CHART_COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7', '#f97316', '#06b6d4', '#ec4899']

export default function DataDashboard({ form, submissions }: Props) {
  if (submissions.length === 0) {
    return <p className="text-gray-500 text-sm">No data to display.</p>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {form.fields.map((field) => {
        const values = submissions
          .map((s) => s.values[field.id])
          .filter((v) => v !== undefined && v !== null)

        if (values.length === 0) return null

        return (
          <div key={field.id} className="p-4 bg-gray-800/50 rounded-xl border border-gray-800">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">{field.label}</h3>
            {(field.type === 'counter' || field.type === 'number' || field.type === 'stopwatch' || field.type === 'rating') && (
              <NumericChart values={values as number[]} unit={field.type === 'stopwatch' ? 's' : ''} />
            )}
            {field.type === 'checkbox' && <BooleanChart values={values as boolean[]} />}
            {field.type === 'dropdown' && <CategoricalChart values={values as string[]} />}
            {field.type === 'text' && (
              <p className="text-xs text-gray-500">{values.length} responses (text data)</p>
            )}
            {field.type === 'image_annotation' && (
              <p className="text-xs text-gray-500">{values.length} annotations</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

function NumericChart({ values, unit }: { values: number[]; unit?: string }) {
  const avg = values.reduce((a, b) => a + b, 0) / values.length
  const min = Math.min(...values)
  const max = Math.max(...values)

  // Create histogram buckets
  const bucketCount = Math.min(10, max - min + 1)
  const bucketSize = bucketCount > 0 ? (max - min) / bucketCount || 1 : 1
  const buckets: { label: string; count: number }[] = []
  for (let i = 0; i < bucketCount; i++) {
    const lo = min + i * bucketSize
    const hi = lo + bucketSize
    const label = `${lo.toFixed(1)}`
    const count = values.filter((v) => v >= lo && (i === bucketCount - 1 ? v <= hi : v < hi)).length
    buckets.push({ label, count })
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-4 text-xs text-gray-400">
        <span>Avg: <span className="text-white">{avg.toFixed(1)}{unit}</span></span>
        <span>Min: <span className="text-white">{min}{unit}</span></span>
        <span>Max: <span className="text-white">{max}{unit}</span></span>
        <span>n={values.length}</span>
      </div>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={buckets}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} />
          <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
            labelStyle={{ color: '#d1d5db' }}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function BooleanChart({ values }: { values: boolean[] }) {
  const trueCount = values.filter(Boolean).length
  const falseCount = values.length - trueCount
  const data = [
    { name: 'Yes', value: trueCount },
    { name: 'No', value: falseCount },
  ]
  const pct = ((trueCount / values.length) * 100).toFixed(0)

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={120} height={120}>
        <PieChart>
          <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={50}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === 0 ? '#22c55e' : '#6b7280'} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="text-sm text-gray-400">
        <p><span className="text-white font-medium">{pct}%</span> Yes</p>
        <p className="text-xs">n={values.length}</p>
      </div>
    </div>
  )
}

function CategoricalChart({ values }: { values: string[] }) {
  const counts = new Map<string, number>()
  for (const v of values) {
    counts.set(v, (counts.get(v) || 0) + 1)
  }
  const data = Array.from(counts.entries()).map(([name, value]) => ({ name, value }))

  return (
    <ResponsiveContainer width="100%" height={150}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} />
        <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#9ca3af' }} width={80} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
          labelStyle={{ color: '#d1d5db' }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

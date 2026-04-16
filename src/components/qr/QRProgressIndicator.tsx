interface Props {
  scanned: number
  total: number
}

export default function QRProgressIndicator({ scanned, total }: Props) {
  const pct = total > 0 ? Math.round((scanned / total) * 100) : 0

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-400">
        <span>Scanned {scanned} of {total} chunks</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

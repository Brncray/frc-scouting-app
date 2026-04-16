import { compress, decompress } from './compression'

const CHUNK_SIZE = 1800

export interface QREnvelope {
  type: 'form' | 'submission'
  data: any
}

/**
 * Encode data into one or more QR code strings.
 * Returns an array of JSON strings — one per QR code.
 */
export function encode(envelope: QREnvelope): string[] {
  const json = JSON.stringify(envelope)
  const compressed = compress(json)

  if (compressed.length <= CHUNK_SIZE) {
    return [JSON.stringify({ t: 's', d: compressed })]
  }

  // Generate a short ID for this payload
  const id = hashCode(compressed).toString(36)
  const chunks: string[] = []
  const n = Math.ceil(compressed.length / CHUNK_SIZE)

  for (let i = 0; i < n; i++) {
    const chunk = compressed.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
    chunks.push(JSON.stringify({ t: 'c', id, i, n, d: chunk }))
  }

  return chunks
}

/**
 * Decode QR data. For single payloads, returns the envelope immediately.
 * For chunked payloads, call repeatedly with each scanned chunk.
 * Returns null until all chunks are collected.
 */
export class QRDecoder {
  private chunks = new Map<string, Map<number, string>>()
  private totals = new Map<string, number>()

  /** Feed a scanned QR string. Returns the decoded envelope when complete, or null. */
  feed(raw: string): QREnvelope | null {
    const parsed = JSON.parse(raw)

    if (parsed.t === 's') {
      const json = decompress(parsed.d)
      return JSON.parse(json)
    }

    if (parsed.t === 'c') {
      const { id, i, n, d } = parsed
      if (!this.chunks.has(id)) {
        this.chunks.set(id, new Map())
        this.totals.set(id, n)
      }
      this.chunks.get(id)!.set(i, d)

      if (this.chunks.get(id)!.size === n) {
        // All chunks collected — reassemble
        let combined = ''
        for (let j = 0; j < n; j++) {
          combined += this.chunks.get(id)!.get(j)
        }
        this.chunks.delete(id)
        this.totals.delete(id)
        const json = decompress(combined)
        return JSON.parse(json)
      }
    }

    return null
  }

  /** Get progress for a given payload ID */
  getProgress(id: string): { scanned: number; total: number } | null {
    if (!this.chunks.has(id)) return null
    return {
      scanned: this.chunks.get(id)!.size,
      total: this.totals.get(id) || 0,
    }
  }

  /** Get the ID of the current in-progress payload, if any */
  getActiveId(): string | null {
    for (const id of this.chunks.keys()) return id
    return null
  }

  reset() {
    this.chunks.clear()
    this.totals.clear()
  }
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return Math.abs(hash)
}

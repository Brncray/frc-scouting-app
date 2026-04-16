export interface QRSinglePayload {
  t: 's'
  d: string
}

export interface QRChunkPayload {
  t: 'c'
  id: string
  i: number
  n: number
  d: string
}

export type QRPayload = QRSinglePayload | QRChunkPayload

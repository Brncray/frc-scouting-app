import pako from 'pako'

export function compress(data: string): string {
  const compressed = pako.deflate(new TextEncoder().encode(data))
  return btoa(String.fromCharCode(...compressed))
}

export function decompress(base64: string): string {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  const decompressed = pako.inflate(bytes)
  return new TextDecoder().decode(decompressed)
}

/* Image checks and resizing for store logos and covers (browser prototype). */

export const ALLOWED_IMAGE_TYPES: ReadonlyArray<string> = ['image/png', 'image/jpeg', 'image/webp']
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export interface ImageRules {
  /** Longest side after resizing, in pixels */
  maxSide: number
}

export const LOGO_RULES: ImageRules = { maxSide: 400 }
export const COVER_RULES: ImageRules = { maxSide: 1600 }

/** Returns a friendly message when the file cannot be used, otherwise undefined. */
export function checkImageFile(file: { type: string; size: number }): string | undefined {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Use a PNG, JPG or WebP image.'
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'This image is larger than 5 MB. Choose a smaller one.'
  }
  if (file.size === 0) return 'This file is empty.'
  return undefined
}

/** Scales (width, height) down so the longest side is at most maxSide. Never scales up. */
export function fitWithin(width: number, height: number, maxSide: number): { width: number; height: number } {
  const longest = Math.max(width, height)
  if (longest <= maxSide) return { width, height }
  const ratio = maxSide / longest
  return { width: Math.max(1, Math.round(width * ratio)), height: Math.max(1, Math.round(height * ratio)) }
}

/**
 * Reads the file, shrinks it and returns a small JPEG data URL, so it fits in
 * browser storage. Rejects with a friendly message when the image can't be read.
 */
export function prepareImage(file: File, rules: ImageRules): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read this file.'))
    reader.onload = () => {
      const source = typeof reader.result === 'string' ? reader.result : ''
      const image = new Image()
      image.onerror = () => reject(new Error('This file is not a readable image.'))
      image.onload = () => {
        const size = fitWithin(image.naturalWidth, image.naturalHeight, rules.maxSide)
        const canvas = document.createElement('canvas')
        canvas.width = size.width
        canvas.height = size.height
        const context = canvas.getContext('2d')
        if (!context) {
          reject(new Error('Could not process this image in your browser.'))
          return
        }
        context.drawImage(image, 0, 0, size.width, size.height)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      image.src = source
    }
    reader.readAsDataURL(file)
  })
}

/** True only for the data URLs this app creates, so stored values can't smuggle in other schemes. */
export function isImageDataUrl(value: unknown): value is string {
  return typeof value === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value)
}

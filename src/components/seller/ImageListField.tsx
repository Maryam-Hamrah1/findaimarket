import { ArrowLeft, ImagePlus, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { ALLOWED_IMAGE_TYPES, checkImageFile, prepareImage } from '../../utils/images'
import { MAX_PRODUCT_IMAGES } from '../../utils/sellerProducts'
import Button from '../ui/Button'

interface ImageListFieldProps {
  id: string
  value: string[]
  error?: string
  onChange: (value: string[]) => void
}

const RULES = { maxSide: 900 }

/** Several product photos with previews. The first one is the main photo. */
export default function ImageListField({ id, value, error, onChange }: ImageListFieldProps) {
  const input = useRef<HTMLInputElement>(null)
  const [problem, setProblem] = useState('')
  const [busy, setBusy] = useState(false)

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (files.length === 0) return

    const room = MAX_PRODUCT_IMAGES - value.length
    setProblem('')
    setBusy(true)

    const added: string[] = []
    let message = ''
    for (const file of files.slice(0, room)) {
      const invalid = checkImageFile(file)
      if (invalid) {
        message = `${file.name}: ${invalid}`
        continue
      }
      try {
        added.push(await prepareImage(file, RULES))
      } catch (failure) {
        message = `${file.name}: ${failure instanceof Error ? failure.message : 'Could not use this image.'}`
      }
    }
    if (files.length > room) message = message || `You can add up to ${MAX_PRODUCT_IMAGES} images.`

    setBusy(false)
    setProblem(message)
    if (added.length > 0) onChange([...value, ...added])
  }

  const remove = (index: number) => onChange(value.filter((_, position) => position !== index))
  const makeMain = (index: number) => {
    const picked = value[index]
    if (picked === undefined) return
    onChange([picked, ...value.filter((_, position) => position !== index)])
  }

  const shown = error || problem

  return (
    <div>
      <p className="text-sm font-semibold text-foreground">
        Product images <span className="ml-1.5 text-xs font-normal text-muted">(optional, up to {MAX_PRODUCT_IMAGES})</span>
      </p>

      {value.length > 0 && (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {value.map((src, index) => (
            <li key={`${index}-${src.slice(-24)}`} className="overflow-hidden rounded-xl border border-brand-border bg-background">
              <img src={src} alt={`Product image ${index + 1}`} className="aspect-square w-full object-cover" />
              <div className="flex items-center justify-between gap-1 p-1.5">
                {index === 0 ? (
                  <span className="px-1.5 text-[11px] font-semibold text-accent">Main</span>
                ) : (
                  <button type="button" onClick={() => makeMain(index)} aria-label={`Make image ${index + 1} the main image`} className="inline-flex min-h-8 items-center gap-1 rounded-lg px-1.5 text-[11px] font-semibold text-foreground hover:text-accent">
                    <ArrowLeft size={12} aria-hidden="true" />Main
                  </button>
                )}
                <button type="button" onClick={() => remove(index)} aria-label={`Remove image ${index + 1}`} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:text-danger">
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3">
        <input
          ref={input}
          id={id}
          type="file"
          multiple
          accept={ALLOWED_IMAGE_TYPES.join(',')}
          onChange={handleFiles}
          className="sr-only"
          aria-describedby={`${id}-hint`}
        />
        <Button variant="outline" size="sm" onClick={() => input.current?.click()} disabled={busy || value.length >= MAX_PRODUCT_IMAGES}>
          <ImagePlus size={16} aria-hidden="true" />
          {busy ? 'Preparing…' : value.length === 0 ? 'Add images' : 'Add more'}
        </Button>
        <p id={`${id}-hint`} className="mt-2 text-xs text-muted">PNG, JPG or WebP, up to 5 MB each. Images are resized and saved in this browser (demo).</p>
      </div>

      <p role="alert" className="mt-2 min-h-4 text-xs text-danger">{shown}</p>
    </div>
  )
}

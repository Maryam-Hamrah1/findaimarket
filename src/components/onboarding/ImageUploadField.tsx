import { ImagePlus, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { ALLOWED_IMAGE_TYPES, checkImageFile, prepareImage, type ImageRules } from '../../utils/images'
import Button from '../ui/Button'

interface ImageUploadFieldProps {
  id: string
  label: string
  hint: string
  value: string
  rules: ImageRules
  /** Shape of the preview */
  shape: 'logo' | 'cover'
  onChange: (value: string) => void
}

/** Choose an image, see a preview, remove it. Optional field. */
export default function ImageUploadField({ id, label, hint, value, rules, shape, onChange }: ImageUploadFieldProps) {
  const input = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    // Allow choosing the same file again later
    event.target.value = ''
    if (!file) return

    const problem = checkImageFile(file)
    if (problem) {
      setError(problem)
      return
    }

    setError('')
    setBusy(true)
    try {
      onChange(await prepareImage(file, rules))
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not use this image.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span id={`${id}-label`} className="text-sm font-semibold text-foreground">
        {label}
        <span className="ml-1.5 text-xs font-normal text-muted">(optional)</span>
      </span>

      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-brand-border bg-surface p-4">
        <div
          className={`flex shrink-0 items-center justify-center overflow-hidden border border-brand-border bg-hero ${
            shape === 'logo' ? 'h-24 w-24 rounded-3xl' : 'h-24 w-44 rounded-2xl'
          }`}
        >
          {value ? (
            <img src={value} alt={`${label} preview`} className="h-full w-full object-cover" />
          ) : (
            <ImagePlus size={26} className="text-muted" aria-hidden="true" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p id={`${id}-hint`} className="text-xs leading-5 text-muted">
            {hint}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => input.current?.click()} disabled={busy} aria-describedby={`${id}-hint`}>
              <ImagePlus size={16} aria-hidden="true" />
              {busy ? 'Preparing…' : value ? 'Replace image' : 'Choose image'}
            </Button>
            {value && (
              <Button variant="ghost" size="sm" onClick={() => { onChange(''); setError('') }}>
                <Trash2 size={16} aria-hidden="true" />
                Remove
              </Button>
            )}
          </div>
        </div>

        <input
          ref={input}
          id={id}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(',')}
          onChange={handleFile}
          className="hidden"
          aria-labelledby={`${id}-label`}
        />
      </div>

      <p role="alert" className="min-h-4 text-xs text-danger">
        {error}
      </p>
    </div>
  )
}

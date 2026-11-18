import { ImageOff } from 'lucide-react'
import { useState } from 'react'

/** Small product photo for tables. Shows an icon when there is no photo or it fails to load. */
export default function ProductThumb({ src, name, size = 'md' }: { src: string; name: string; size?: 'sm' | 'md' }) {
  const [failed, setFailed] = useState(false)
  const box = size === 'sm' ? 'h-10 w-10' : 'h-14 w-14'

  return (
    <span className={`flex ${box} shrink-0 items-center justify-center overflow-hidden rounded-xl border border-brand-border bg-background text-muted`}>
      {src && !failed ? (
        <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      ) : (
        <ImageOff size={18} aria-label={`${name}: no photo`} />
      )}
    </span>
  )
}

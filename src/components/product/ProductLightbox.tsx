import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useDialog } from '../../hooks/useDialog'
import type { ProductImage } from '../../types/productDetails'

interface ProductLightboxProps {
  images: ProductImage[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}

/** Full-screen photo viewer. Arrow keys move between photos, Escape closes. */
export default function ProductLightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: ProductLightboxProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const count = images.length
  const image = images[index]

  useDialog(true, onClose, panelRef)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (count < 2) return
      if (event.key === 'ArrowLeft') onIndexChange((index - 1 + count) % count)
      if (event.key === 'ArrowRight') onIndexChange((index + 1) % count)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [count, index, onIndexChange])

  if (!image) return null

  const arrow =
    'absolute top-1/2 -translate-y-1/2 rounded-full border border-brand-border bg-surface p-3 text-foreground transition-colors hover:border-accent hover:text-accent'

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="drawer-overlay absolute inset-0 bg-background/90 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${image.alt}, photo ${index + 1} of ${count}`}
        tabIndex={-1}
        className="relative flex h-full items-center justify-center p-4 sm:p-10"
      >
        <img
          key={image.full}
          src={image.full}
          alt={image.alt}
          className="fade-in max-h-full max-w-full rounded-2xl object-contain"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close photo viewer"
          className="absolute right-4 top-4 rounded-full border border-brand-border bg-surface p-3 text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          <X size={20} />
        </button>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => onIndexChange((index - 1 + count) % count)}
              aria-label="Previous photo"
              className={`${arrow} left-3 sm:left-6`}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => onIndexChange((index + 1) % count)}
              aria-label="Next photo"
              className={`${arrow} right-3 sm:right-6`}
            >
              <ChevronRight size={22} />
            </button>

            <p
              className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-brand-border bg-surface px-4 py-1.5 text-xs font-semibold text-foreground"
              aria-hidden="true"
            >
              {index + 1} / {count}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

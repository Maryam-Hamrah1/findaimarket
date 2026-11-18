import { X } from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import { useDialog } from '../../hooks/useDialog'
import Button from '../ui/Button'

interface MobileFilterDrawerProps {
  open: boolean
  onClose: () => void
  resultCount: number
  activeCount: number
  onClearAll: () => void
  children: ReactNode
  /** What is being listed, e.g. "product" or "store" */
  noun?: string
}

/** Slide-in filter panel for screens below the lg breakpoint. */
export default function MobileFilterDrawer({
  open,
  onClose,
  resultCount,
  activeCount,
  onClearAll,
  children,
  noun = 'product',
}: MobileFilterDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useDialog(open, onClose, panelRef)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      {/* Backdrop */}
      <div
        className="drawer-overlay absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        tabIndex={-1}
        className="drawer-panel absolute inset-y-0 left-0 flex w-[90%] max-w-sm flex-col border-r border-brand-border bg-surface"
      >
        <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Filters
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="rounded-full p-2 text-foreground transition-colors hover:bg-surface-hover"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

        <div className="flex gap-3 border-t border-brand-border px-5 py-4">
          <Button
            variant="outline"
            onClick={onClearAll}
            disabled={activeCount === 0}
          >
            Clear all
          </Button>

          <Button variant="secondary" fullWidth onClick={onClose}>
            Show {resultCount} {resultCount === 1 ? noun : `${noun}s`}
          </Button>
        </div>
      </div>
    </div>
  )
}

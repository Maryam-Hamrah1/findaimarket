import { useRef } from 'react'
import { useDialog } from '../../hooks/useDialog'
import Button from '../ui/Button'

interface ClearCartDialogProps {
  open: boolean
  itemCount: number
  onConfirm: () => void
  onCancel: () => void
}

/** "Are you sure?" before the whole cart is emptied. */
export default function ClearCartDialog({
  open,
  itemCount,
  onConfirm,
  onCancel,
}: ClearCartDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useDialog(open, onCancel, panelRef)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-5">
      <div
        className="drawer-overlay absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="clear-cart-title"
        aria-describedby="clear-cart-text"
        tabIndex={-1}
        className="fade-in relative w-full max-w-md rounded-3xl border border-brand-border bg-surface p-7 shadow-card"
      >
        <h2 id="clear-cart-title" className="font-display text-3xl font-medium text-foreground">
          Clear your cart?
        </h2>

        <p id="clear-cart-text" className="mt-3 text-sm leading-6 text-muted">
          This removes all {itemCount} {itemCount === 1 ? 'item' : 'items'}, saved items
          included, and any coupon. It cannot be undone.
        </p>

        <div className="mt-7 flex flex-wrap justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Keep my items
          </Button>
          <Button variant="secondary" onClick={onConfirm}>
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  )
}

import { useRef } from 'react'
import { useDialog } from '../../hooks/useDialog'
import Button from '../ui/Button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

/** "Are you sure?" before something cannot be undone. */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  useDialog(open, onCancel, panelRef)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-5">
      <div className="drawer-overlay absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-text"
        tabIndex={-1}
        className="fade-in relative w-full max-w-md rounded-3xl border border-brand-border bg-surface p-7 shadow-card"
      >
        <h2 id="confirm-title" className="font-display text-3xl font-medium text-foreground">{title}</h2>
        <p id="confirm-text" className="mt-3 text-sm leading-6 text-muted">{message}</p>
        <div className="mt-7 flex flex-wrap justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant="secondary" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}

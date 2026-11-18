import { useRef } from 'react'
import { useDialog } from '../../hooks/useDialog'
import Button from '../ui/Button'

interface LeaveDialogProps {
  open: boolean
  onStay: () => void
  onLeave: () => void
}

/** "Leave store setup?" shown before a link takes the seller away mid-form. */
export default function LeaveDialog({ open, onStay, onLeave }: LeaveDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  useDialog(open, onStay, panelRef)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-5">
      <div className="drawer-overlay absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onStay} aria-hidden="true" />

      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="leave-title"
        aria-describedby="leave-text"
        tabIndex={-1}
        className="fade-in relative w-full max-w-md rounded-3xl border border-brand-border bg-surface p-7 shadow-card"
      >
        <h2 id="leave-title" className="font-display text-3xl font-medium text-foreground">
          Leave store setup?
        </h2>
        <p id="leave-text" className="mt-3 text-sm leading-6 text-muted">
          Your store has not been submitted yet. What you entered is saved on this device, so you can
          pick up where you left off.
        </p>
        <div className="mt-7 flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={onStay}>
            Keep editing
          </Button>
          <Button variant="outline" onClick={onLeave}>
            Leave page
          </Button>
        </div>
      </div>
    </div>
  )
}

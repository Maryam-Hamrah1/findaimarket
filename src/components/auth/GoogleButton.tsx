import { useState } from 'react'
import Button from '../ui/Button'

/** Visual demo only: Google sign-in is not connected. */
export default function GoogleButton() {
  const [shown, setShown] = useState(false)

  return (
    <div>
      <Button variant="outline" fullWidth onClick={() => setShown(true)} className="min-h-12">
        <span
          aria-hidden="true"
          className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background"
        >
          G
        </span>
        Continue with Google
      </Button>
      <p aria-live="polite" className="mt-2 min-h-4 text-center text-xs text-muted">
        {shown && 'Google sign-in is not connected in this demo. Use email and password.'}
      </p>
    </div>
  )
}

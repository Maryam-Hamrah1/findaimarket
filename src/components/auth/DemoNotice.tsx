import { Info } from 'lucide-react'

/** Honest reminder shown wherever accounts are used. */
export default function DemoNotice({ className = '' }: { className?: string }) {
  return (
    <p
      className={`flex gap-2.5 rounded-xl border border-brand-border bg-background px-4 py-3 text-xs leading-5 text-muted ${className}`}
    >
      <Info size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
      <span>
        <strong className="font-semibold text-foreground">Demo accounts only.</strong> This is a
        design preview, not secure sign-in. Accounts stay in this browser, no email is sent and
        nothing is verified.
      </span>
    </p>
  )
}

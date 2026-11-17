import { ImageOff } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { OrderLine } from '../../types/checkout'
import { formatMoney } from '../../utils/money'

function Thumb({ image }: { image: string }) {
  const [failed, setFailed] = useState(false)

  return (
    <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-brand-border bg-primary-light text-muted">
      {image !== '' && !failed ? (
        <img
          src={image}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <ImageOff size={20} strokeWidth={1.4} aria-hidden="true" />
      )}
    </span>
  )
}

interface OrderLineListProps {
  lines: readonly OrderLine[]
  /** Link product names to their pages (off on the confirmation screen) */
  linked?: boolean
}

/** Products of one seller: photo, name, choices, quantity and total. */
export default function OrderLineList({ lines, linked = true }: OrderLineListProps) {
  return (
    <ul className="divide-y divide-brand-border">
      {lines.map((line) => (
        <li key={`${line.productId}-${line.choices.map(([, v]) => v).join('-')}`} className="flex gap-4 py-4 first:pt-0 last:pb-0">
          <Thumb image={line.image} />

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground">
              {linked ? (
                <Link to={line.path} className="transition-colors hover:text-accent">
                  {line.name}
                </Link>
              ) : (
                line.name
              )}
            </p>

            {line.choices.length > 0 && (
              <p className="mt-0.5 text-sm text-muted">
                {line.choices.map(([label, value]) => `${label}: ${value}`).join(' · ')}
              </p>
            )}

            <p className="mt-0.5 text-sm text-muted">
              {line.quantity} × {formatMoney(line.unitPriceCents)}
            </p>
          </div>

          <p className="shrink-0 font-bold text-foreground">
            {formatMoney(line.totalCents)}
          </p>
        </li>
      ))}
    </ul>
  )
}

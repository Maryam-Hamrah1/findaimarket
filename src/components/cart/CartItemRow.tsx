import { Bookmark, BookmarkCheck, ImageOff, TriangleAlert, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getProductPath } from '../../data/productDetails'
import type { CartLine } from '../../types/cart'
import { formatMoney } from '../../utils/money'
import QuantityStepper from '../ui/QuantityStepper'

interface CartItemRowProps {
  line: CartLine
  onQuantityChange: (key: string, quantity: number) => void
  onRemove: (key: string) => void
  onToggleSaved: (key: string) => void
}

const STATUS_MESSAGE = {
  'out-of-stock':
    'Out of stock. This item is not counted in your total. Save it for later or remove it.',
  'option-unavailable':
    'The option you chose is no longer available. Remove this item and pick another option on its page.',
} as const

/** One product in the cart, or in the "saved for later" list. */
export default function CartItemRow({
  line,
  onQuantityChange,
  onRemove,
  onToggleSaved,
}: CartItemRowProps) {
  const { item, product, details, status, choices, maxQuantity } = line
  const [imageFailed, setImageFailed] = useState(false)

  const photo = details.gallery[0]
  const showImage = photo !== undefined && !imageFailed
  const available = status === 'ok'
  const atMax = available && item.quantity >= maxQuantity
  const saved = item.savedForLater

  return (
    <li className="py-5 first:pt-0 last:pb-0">
      <div className={`flex gap-4 sm:gap-5 ${available ? '' : 'opacity-80'}`}>
        <Link
          to={getProductPath(product)}
          className="block h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-brand-border bg-surface-hover sm:h-28 sm:w-28"
          aria-label={`View ${product.name}`}
        >
          {showImage ? (
            <img
              src={photo.src}
              alt=""
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-primary-light text-muted">
              <ImageOff size={26} strokeWidth={1.4} aria-hidden="true" />
            </span>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground">
                <Link to={getProductPath(product)} className="transition-colors hover:text-accent">
                  {product.name}
                </Link>
              </h3>

              {choices.length > 0 && (
                <p className="mt-1 text-sm text-muted">
                  {choices.map(([label, value]) => `${label}: ${value}`).join(' · ')}
                </p>
              )}

              <p className="mt-1 text-sm text-muted">
                {formatMoney(line.unitPriceCents)} each
              </p>
            </div>

            {!saved && (
              <p className="shrink-0 text-lg font-bold text-foreground">
                {available ? formatMoney(line.lineTotalCents) : '—'}
                <span className="sr-only"> subtotal</span>
              </p>
            )}
          </div>

          {status !== 'ok' && (
            <p
              role="status"
              className="mt-3 flex items-start gap-2 rounded-xl border border-danger/50 px-3 py-2 text-sm text-foreground"
            >
              <TriangleAlert size={17} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
              {STATUS_MESSAGE[status]}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
            {!saved && (
              <QuantityStepper
                value={item.quantity}
                onChange={(next) => onQuantityChange(item.key, next)}
                max={maxQuantity}
                disabled={!available}
                label={`Quantity of ${product.name}`}
              />
            )}

            <button
              type="button"
              onClick={() => onToggleSaved(item.key)}
              className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-accent"
            >
              {saved ? (
                <BookmarkCheck size={17} aria-hidden="true" />
              ) : (
                <Bookmark size={17} aria-hidden="true" />
              )}
              {saved ? 'Move to cart' : 'Save for later'}
            </button>

            <button
              type="button"
              onClick={() => onRemove(item.key)}
              aria-label={`Remove ${product.name} from ${saved ? 'saved items' : 'cart'}`}
              className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-danger"
            >
              <Trash2 size={17} aria-hidden="true" />
              Remove
            </button>
          </div>

          {atMax && (
            <p className="mt-1 text-xs text-muted">
              You have all {maxQuantity} available units.
            </p>
          )}
        </div>
      </div>
    </li>
  )
}

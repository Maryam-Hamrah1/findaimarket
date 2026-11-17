import { Check, Heart, ShoppingCart, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useWishlistToggle } from '../../hooks/useWishlist'
import type { Product } from '../../types/product'
import type { ProductDetails } from '../../types/productDetails'
import Button from '../ui/Button'
import QuantityStepper from '../ui/QuantityStepper'
import ProductOptions from './ProductOptions'

interface ProductBuyBoxProps {
  product: Product
  details: ProductDetails
}

const NOTICE_MS = 4000

/** Options, quantity and purchase buttons. Adds to the shared cart. */
export default function ProductBuyBox({ product, details }: ProductBuyBoxProps) {
  const navigate = useNavigate()
  const { addItem, getQuantityInCart } = useCart()

  const [selected, setSelected] = useState<Record<string, string>>({})
  const [missing, setMissing] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [notice, setNotice] = useState('')
  const { wished, toggle: toggleWishlist } = useWishlistToggle(product.id)
  const timer = useRef<number>(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const soldOut = details.stock <= 0
  // Units of this exact variation already in the shared cart
  const inCart = getQuantityInCart(product.id, selected)
  // Units that can still be added, counting what is already in the cart
  const remaining = Math.max(0, details.stock - inCart)
  const maxQuantity = Math.max(1, remaining)
  const safeQuantity = Math.min(quantity, maxQuantity)

  const showNotice = (message: string) => {
    setNotice(message)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setNotice(''), NOTICE_MS)
  }

  const findMissing = (): string[] =>
    details.options.filter((option) => !selected[option.id]).map((option) => option.id)

  const handleSelect = (optionId: string, value: string) => {
    setSelected((previous) => ({ ...previous, [optionId]: value }))
    setMissing((previous) => previous.filter((id) => id !== optionId))
  }

  const handleAdd = (): boolean => {
    const unselected = findMissing()

    if (unselected.length > 0) {
      setMissing(unselected)
      showNotice('Choose your options first.')
      return false
    }

    const result = addItem(product.id, selected, safeQuantity)

    if (!result.ok) {
      showNotice(
        result.reason === 'sold-out'
          ? 'Sorry, this item is out of stock.'
          : `Only ${details.stock} available. You already have ${inCart} in your cart.`,
      )
      return false
    }

    setQuantity(1)
    showNotice(`Added ${safeQuantity} × ${product.name} to your cart.`)
    return true
  }

  const handleBuyNow = () => {
    // Already in the cart with these options: go straight to checkout
    if (inCart === 0 && !handleAdd()) return
    navigate('/checkout')
  }

  const stockLabel = soldOut
    ? 'Out of stock'
    : details.stock <= 5
      ? `Only ${details.stock} left`
      : 'In stock'

  return (
    <div className="space-y-6">
      <ProductOptions
        options={details.options}
        selected={selected}
        onSelect={handleSelect}
        missing={missing}
      />

      <p
        className={`inline-flex items-center gap-2 text-sm font-semibold ${
          soldOut ? 'text-danger' : details.stock <= 5 ? 'text-warning' : 'text-success'
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            soldOut ? 'bg-danger' : details.stock <= 5 ? 'bg-warning' : 'bg-success'
          }`}
          aria-hidden="true"
        />
        {stockLabel}
      </p>

      {!soldOut && (
        <div>
          <p id="quantity-label" className="text-sm font-semibold text-foreground">
            Quantity
          </p>

          <div className="mt-2.5">
            <QuantityStepper
              value={safeQuantity}
              onChange={setQuantity}
              max={maxQuantity}
              label={`Quantity of ${product.name}`}
            />
          </div>

          {remaining === 0 && (
            <p className="mt-2 text-xs text-muted">
              You have all {details.stock} available units in your cart.
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          variant="secondary"
          size="lg"
          onClick={handleAdd}
          disabled={soldOut || remaining === 0}
          className="min-h-12 flex-1 sm:flex-none"
        >
          <ShoppingCart size={19} />
          Add to Cart
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={handleBuyNow}
          disabled={soldOut}
          className="min-h-12 flex-1 sm:flex-none"
        >
          <Zap size={19} />
          Buy Now
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={toggleWishlist}
          aria-pressed={wished}
          aria-label={`${wished ? 'Remove' : 'Add'} ${product.name} ${wished ? 'from' : 'to'} wishlist`}
          className="min-h-12 px-4"
        >
          <Heart size={20} className={wished ? 'fill-accent text-accent' : ''} />
        </Button>
      </div>

      <div aria-live="polite" className="min-h-6">
        {notice && (
          <p className="fade-in inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <Check size={17} className="text-success" aria-hidden="true" />
            {notice}
            {notice.startsWith('Added') && (
              <Link to="/cart" className="text-accent underline hover:text-accent-hover">
                View cart
              </Link>
            )}
          </p>
        )}
      </div>

      <p className="text-xs leading-5 text-muted">
        Stock, ratings and reviews on this page are sample data for design preview.
        No payment is taken and nothing is ordered.
      </p>
    </div>
  )
}

import { useState } from 'react'
import Button from './Button'
import Input from './Input'

interface PriceRangeProps {
  /** Makes element ids unique when the form is mounted more than once */
  idPrefix: string
  minPrice: number | null
  maxPrice: number | null
  onApply: (min: number | null, max: number | null) => void
}

/** Minimum and maximum price inputs with an "Apply" button. */
export default function PriceRange({
  idPrefix,
  minPrice,
  maxPrice,
  onApply,
}: PriceRangeProps) {
  const [min, setMin] = useState(minPrice === null ? '' : String(minPrice))
  const [max, setMax] = useState(maxPrice === null ? '' : String(maxPrice))
  const [previous, setPrevious] = useState({ minPrice, maxPrice })

  // Follow external changes (Clear all, removing a chip)
  if (previous.minPrice !== minPrice || previous.maxPrice !== maxPrice) {
    setPrevious({ minPrice, maxPrice })
    setMin(minPrice === null ? '' : String(minPrice))
    setMax(maxPrice === null ? '' : String(maxPrice))
  }

  const toNumber = (value: string): number | null => {
    if (value.trim() === '') return null
    const parsed = Number(value)
    return Number.isFinite(parsed) ? Math.max(0, parsed) : null
  }

  const apply = () => {
    let low = toNumber(min)
    let high = toNumber(max)

    if (low !== null && high !== null && low > high) {
      ;[low, high] = [high, low]
    }

    onApply(low, high)
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        apply()
      }}
      className="space-y-3"
    >
      <div className="grid grid-cols-2 gap-3">
        <Input
          id={`${idPrefix}-min-price`}
          label="Min ($)"
          type="number"
          min={0}
          inputMode="decimal"
          placeholder="0"
          value={min}
          onChange={(event) => setMin(event.target.value)}
        />
        <Input
          id={`${idPrefix}-max-price`}
          label="Max ($)"
          type="number"
          min={0}
          inputMode="decimal"
          placeholder="Any"
          value={max}
          onChange={(event) => setMax(event.target.value)}
        />
      </div>

      <Button type="submit" variant="outline" size="sm" fullWidth>
        Apply price
      </Button>
    </form>
  )
}

import type { Coupon, CouponResult } from '../types/cart'

/** Demo coupons. There is no server check yet. */
export const COUPONS: ReadonlyArray<Coupon> = [
  { code: 'SAVE10', label: '10% off your items', percent: 10 },
  { code: 'FREESHIP', label: 'Free estimated shipping', freeShipping: true },
]

export function findCoupon(code: string | null): Coupon | undefined {
  if (code === null) return undefined
  const normalised = code.trim().toUpperCase()
  return COUPONS.find((coupon) => coupon.code === normalised)
}

export function validateCoupon(input: string): CouponResult {
  const code = input.trim()

  if (code === '') {
    return { ok: false, message: 'Enter a coupon code first.' }
  }

  const coupon = findCoupon(code)

  return coupon
    ? { ok: true, coupon }
    : { ok: false, message: `"${code}" is not a valid code. Check it and try again.` }
}

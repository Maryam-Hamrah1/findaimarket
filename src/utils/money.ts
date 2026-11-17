/** Prices are added up in whole cents so totals never show 0.1 + 0.2 errors. */
export function toCents(amount: number): number {
  return Math.round(amount * 100)
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatMoney(cents: number): string {
  return formatter.format(cents / 100)
}

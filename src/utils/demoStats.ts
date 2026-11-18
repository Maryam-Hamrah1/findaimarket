import { seededRandom } from './sellerOrders'

/*
  Demonstration statistics. Nothing here is measured: the numbers are made up
  from the store id so the charts have something to show, and every screen that
  uses them says so. The same store always gets the same numbers.
*/

export interface DayStat {
  /** ISO date YYYY-MM-DD */
  date: string
  salesCents: number
  orders: number
  views: number
  wishlistAdds: number
}

export interface Bucket {
  label: string
  salesCents: number
  orders: number
  views: number
}

export type SalesRange = 'daily' | 'weekly' | 'monthly'

const DAY_MS = 86_400_000

function isoDay(time: number): string {
  return new Date(time).toISOString().slice(0, 10)
}

/** `days` days ending today, oldest first. */
export function makeDemoSeries(seed: number, days: number, now: Date = new Date()): DayStat[] {
  const random = seededRandom(seed * 104729 + 17)
  // Each store has its own scale and slow growth, with weekly ups and downs
  const scale = 0.6 + random() * 0.9
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())

  return Array.from({ length: days }, (_, index) => {
    const time = end - (days - 1 - index) * DAY_MS
    const weekday = new Date(time).getUTCDay()
    const weekend = weekday === 0 || weekday === 6 ? 1.25 : 1
    const trend = 0.75 + (index / days) * 0.5
    const noise = 0.7 + random() * 0.6
    const orders = Math.max(0, Math.round(3 * scale * weekend * trend * noise))
    const views = Math.round(80 * scale * weekend * trend * (0.8 + random() * 0.4))

    return {
      date: isoDay(time),
      orders,
      views,
      salesCents: orders * Math.round((2400 + random() * 5200) * scale),
      wishlistAdds: Math.round(views * (0.03 + random() * 0.03)),
    }
  })
}

export function sumDays(series: readonly DayStat[]) {
  return series.reduce(
    (total, day) => ({
      salesCents: total.salesCents + day.salesCents,
      orders: total.orders + day.orders,
      views: total.views + day.views,
      wishlistAdds: total.wishlistAdds + day.wishlistAdds,
    }),
    { salesCents: 0, orders: 0, views: 0, wishlistAdds: 0 },
  )
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function label(date: string): string {
  const [, month, day] = date.split('-')
  return `${MONTHS[Number(month) - 1] ?? ''} ${Number(day)}`
}

/** Groups days into buckets of `size` days, newest bucket last. */
export function bucketize(series: readonly DayStat[], size: number): Bucket[] {
  const buckets: Bucket[] = []
  for (let end = series.length; end > 0; end -= size) {
    const slice = series.slice(Math.max(0, end - size), end)
    const first = slice[0]
    if (!first) continue
    const totals = sumDays(slice)
    buckets.unshift({ label: label(first.date), salesCents: totals.salesCents, orders: totals.orders, views: totals.views })
  }
  return buckets
}

export const SALES_RANGES: ReadonlyArray<{ value: SalesRange; label: string; days: number; size: number }> = [
  { value: 'daily', label: 'Daily', days: 14, size: 1 },
  { value: 'weekly', label: 'Weekly', days: 84, size: 7 },
  { value: 'monthly', label: 'Monthly', days: 180, size: 30 },
]

export function salesBuckets(seed: number, range: SalesRange, now: Date = new Date()): Bucket[] {
  const config = SALES_RANGES.find((item) => item.value === range) ?? SALES_RANGES[0]!
  return bucketize(makeDemoSeries(seed, config.days, now), config.size)
}

export const ANALYTICS_RANGES: ReadonlyArray<{ value: 7 | 30 | 90; label: string }> = [
  { value: 7, label: 'Last 7 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
]

/** Longer ranges are grouped so charts stay readable. */
export function analyticsBuckets(seed: number, days: 7 | 30 | 90, now: Date = new Date()): Bucket[] {
  const series = makeDemoSeries(seed, days, now)
  return bucketize(series, days === 90 ? 6 : 1)
}

/** Made-up units sold for one product over a period. Same product, same number. */
export function demoUnits(productId: number, days: number): number {
  const random = seededRandom(productId * 31337 + 5)
  return Math.round((1 + random() * 9) * (days / 7))
}

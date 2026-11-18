import type { DemoOrder } from '../types/checkout'
import { buildSellerOrders } from '../utils/sellerOrders'
import { productRegistry } from './productRegistry'
import { sellerOrders } from './sellerOrders'
import { storeRegistry } from './storeRegistry'

/**
 * Called by checkout. Gives every seller-created store in the order its own
 * seller order and lowers the stock of its products. Sample stores have no
 * owner, so they get nothing.
 */
export function recordSellerOrders(order: DemoOrder, buyerId?: string): void {
  const records = buildSellerOrders(
    order,
    (slug) => (slug === undefined ? undefined : storeRegistry.getBySlug(slug)?.store.id),
    buyerId,
  )

  sellerOrders.add(records)
  productRegistry.sell(records.flatMap((record) => record.lines.map((line) => ({ productId: line.productId, quantity: line.quantity }))))
}

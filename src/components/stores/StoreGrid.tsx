import type { Store } from '../../types/store'
import StoreCard from './StoreCard'

interface StoreGridProps {
  stores: Store[]
}

export default function StoreGrid({ stores }: StoreGridProps) {
  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {stores.map((store, index) => (
        <div
          key={store.id}
          className="rise-in"
          style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
        >
          <StoreCard store={store} />
        </div>
      ))}
    </div>
  )
}

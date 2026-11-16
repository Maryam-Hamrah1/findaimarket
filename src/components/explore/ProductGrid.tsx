import type { Product } from '../../types/product'
import ProductCard from '../ui/ProductCard'

interface ProductGridProps {
  products: Product[]
  /** Ids that get a "Top match" highlight (only used for search results) */
  topMatchIds: ReadonlySet<number>
}

export default function ProductGrid({ products, topMatchIds }: ProductGridProps) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="rise-in"
          style={{ animationDelay: `${Math.min(index, 11) * 35}ms` }}
        >
          <ProductCard
            name={product.name}
            image={product.image}
            price={product.price}
            oldPrice={product.oldPrice}
            rating={product.rating}
            reviews={product.reviews}
            isNew={product.isNew}
            isFeatured={product.isFeatured}
            store={product.store}
            matchLabel={topMatchIds.has(product.id) ? 'Top match' : undefined}
          />
        </div>
      ))}
    </div>
  )
}

import { getProductPath } from '../../data/productDetails'
import { PRODUCTS } from '../../data/products'
import { getStoreByName } from '../../data/stores'
import ProductCard from '../ui/ProductCard'
import SectionHeading from '../ui/SectionHeading'

/** Catalogue ids shown on the home page. Everything else comes from the catalogue. */
const FEATURED_IDS = [1, 16, 17, 38]

const featured = FEATURED_IDS.flatMap((id) => {
  const product = PRODUCTS.find((item) => item.id === id)
  return product ? [product] : []
})

export default function FeaturedProducts() {
  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-7xl">

        <SectionHeading
          eyebrow="Carefully Selected"
          title="Featured Products"
          description="Discover popular products from independent stores around the world."
          linkText="Explore All"
          linkTo="/explore"
        />

        {/* Products */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              productId={product.id}
              name={product.name}
              image={product.image}
              price={product.price}
              oldPrice={product.oldPrice}
              rating={product.rating}
              reviews={product.reviews}
              isNew={product.isNew}
              isFeatured={product.isFeatured}
              store={product.store}
              storeSlug={getStoreByName(product.store)?.slug}
              to={getProductPath(product)}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

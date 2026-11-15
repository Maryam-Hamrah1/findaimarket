import ProductCard from '../ui/ProductCard'
import SectionHeading from '../ui/SectionHeading'

const products = [
  {
    id: 1,
    name: 'Elegant Leather Handbag',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600',
    price: 49.99,
    oldPrice: 69.99,
    rating: 4.8,
    reviews: 124,
    isNew: true,
    isFeatured: true,
  },
  {
    id: 2,
    name: 'Classic Minimalist Wrist Watch',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    price: 35,
    rating: 4.6,
    reviews: 87,
  },
  {
    id: 3,
    name: 'Modern Fashion Sunglasses',
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600',
    price: 24.99,
    oldPrice: 39.99,
    rating: 4.9,
    reviews: 215,
  },
  {
    id: 4,
    name: 'Premium Running Shoes',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    price: 59.99,
    rating: 4.7,
    reviews: 96,
    isNew: true,
  },
]

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
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              image={product.image}
              price={product.price}
              oldPrice={product.oldPrice}
              rating={product.rating}
              reviews={product.reviews}
              isNew={product.isNew}
              isFeatured={product.isFeatured}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import ProductBuyBox from '../components/product/ProductBuyBox'
import ProductDescription from '../components/product/ProductDescription'
import ProductGallery from '../components/product/ProductGallery'
import ProductInfo from '../components/product/ProductInfo'
import ProductNotFound from '../components/product/ProductNotFound'
import ProductReviews from '../components/product/ProductReviews'
import SellerCard from '../components/product/SellerCard'
import ProductGrid from '../components/explore/ProductGrid'
import Badge from '../components/ui/Badge'
import Breadcrumb from '../components/ui/Breadcrumb'
import { getCategoryName } from '../data/categories'
import {
  getProductBySlug,
  getProductDetails,
  getRelatedProducts,
} from '../data/productDetails'
import { getProductReviewSummary } from '../data/productReviews'
import { getStoreByName } from '../data/stores'
import type { Product } from '../types/product'

function ProductView({ product }: { product: Product }) {
  const details = useMemo(() => getProductDetails(product), [product])
  const reviewSummary = useMemo(() => getProductReviewSummary(product), [product])
  const related = useMemo(() => getRelatedProducts(product), [product])
  const store = getStoreByName(product.store)

  useEffect(() => {
    document.title = `${product.name} · Findaimarket`
  }, [product.name])

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  return (
    <main>
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-6 lg:pt-8">
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Explore', to: '/explore' },
            {
              label: getCategoryName(product.category),
              to: `/explore?category=${product.category}`,
            },
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-2 lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductGallery
              name={product.name}
              images={details.gallery}
              video={details.video}
              badges={
                <>
                  {product.isNew && <Badge variant="new">New</Badge>}
                  {product.isFeatured && <Badge variant="featured">Featured</Badge>}
                  {discount > 0 && <Badge variant="sale">{discount}% OFF</Badge>}
                </>
              }
            />
          </div>

          <div className="space-y-8">
            <ProductInfo product={product} details={details} />

            <div className="border-t border-brand-border pt-8">
              <ProductBuyBox product={product} details={details} />
            </div>

            {store && <SellerCard store={store} />}
          </div>
        </div>

        <div className="mt-16 border-t border-brand-border pt-12">
          <ProductDescription name={product.name} details={details} />
        </div>

        <div className="mt-16 border-t border-brand-border pt-12">
          <ProductReviews product={product} summary={reviewSummary} />
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-16 border-t border-brand-border pt-12">
            <h2 id="related-heading" className="font-display text-3xl font-medium text-foreground">
              You may also like
            </h2>
            <ProductGrid products={related} />
          </section>
        )}
      </div>
    </main>
  )
}

export default function ProductPage() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)

  useEffect(() => {
    if (!product) document.title = 'Product not found · Findaimarket'
  }, [product])

  if (!product) return <ProductNotFound />

  // Keyed so gallery, options and cart start fresh for every product
  return <ProductView key={product.id} product={product} />
}

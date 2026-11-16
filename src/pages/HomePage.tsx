import CategoriesSection from '../components/common/CategoriesSection'
import FeaturedProducts from '../components/common/FeaturedProducts'
import HeroSection from '../components/common/HeroSection'
import HowItWorks from '../components/common/HowItWorks'
import NewsletterSection from '../components/common/NewsletterSection'
import PopularStores from '../components/common/PopularStores'
import SellerBanner from '../components/common/SellerBanner'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <PopularStores />
      <HowItWorks />
      <SellerBanner />
      <NewsletterSection />
    </main>
  )
}

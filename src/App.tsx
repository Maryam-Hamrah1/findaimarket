import HeroSection from './components/common/HeroSection'
import Navbar from './components/common/Navbar'
import './App.css'
import CategoriesSection from './components/common/CategoriesSection'
import FeaturedProducts from './components/common/FeaturedProducts'
import SellerBanner from './components/common/SellerBanner'
import PopularStores from './components/common/PopularStores'
import HowItWorks from './components/common/HowItWorks'
import NewsletterSection from './components/common/NewsletterSection'
import Footer from './components/common/Footer'

function App() {

  return (
   <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <CategoriesSection/>
      <FeaturedProducts/>
      <PopularStores/>
      <HowItWorks/>
      <SellerBanner/>
      <NewsletterSection/>
      <Footer/>
    </div>
  )
}

export default App

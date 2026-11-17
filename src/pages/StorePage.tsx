import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import StoreAbout from '../components/store/StoreAbout'
import StoreContactModal from '../components/store/StoreContactModal'
import StoreCover from '../components/store/StoreCover'
import StoreHome from '../components/store/StoreHome'
import StoreIdentity from '../components/store/StoreIdentity'
import StoreNavigation, { panelId, tabId } from '../components/store/StoreNavigation'
import StoreNotFound from '../components/store/StoreNotFound'
import StoreProductSection from '../components/store/StoreProductSection'
import StoreReviews from '../components/store/StoreReviews'
import StoreStats from '../components/store/StoreStats'
import Breadcrumb from '../components/ui/Breadcrumb'
import { getStoreDetails } from '../data/storeDetails'
import { getStoreProducts, getStoreSections } from '../data/storeProducts'
import { getStoreBySlug } from '../data/stores'
import type { Store, StoreDetails, StoreTab } from '../types/store'

const TABS: ReadonlyArray<StoreTab> = ['home', 'products', 'about', 'reviews']

function isStoreTab(value: string | null): value is StoreTab {
  return TABS.some((tab) => tab === value)
}

interface StoreViewProps {
  store: Store
  details: StoreDetails
}

function StoreView({ store, details }: StoreViewProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const tab: StoreTab = isStoreTab(tabParam) ? tabParam : 'home'

  const [following, setFollowing] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [initialSection, setInitialSection] = useState<string | null>(null)

  const products = useMemo(() => getStoreProducts(store.name), [store.name])
  const sections = useMemo(() => getStoreSections(products), [products])

  useEffect(() => {
    document.title = `${store.name} · Findaimarket`
  }, [store.name])

  const selectTab = (next: StoreTab) => {
    const params = new URLSearchParams(searchParams)
    if (next === 'home') params.delete('tab')
    else params.set('tab', next)
    setSearchParams(params)
  }

  const openTab = (next: StoreTab) => {
    setInitialSection(null)
    selectTab(next)
  }

  const openSection = (section: string) => {
    setInitialSection(section)
    selectTab('products')
  }

  return (
    <main>
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-6 lg:pt-8">
        <Breadcrumb
          className="mb-5"
          items={[
            { label: 'Home', to: '/' },
            { label: 'Stores', to: '/stores' },
            { label: store.name },
          ]}
        />

        <StoreCover src={store.coverImage} />

        <StoreIdentity
          store={store}
          following={following}
          onToggleFollow={() => setFollowing(!following)}
          onContact={() => setContactOpen(true)}
        />

        <StoreStats store={store} followers={store.followers + (following ? 1 : 0)} />

        <StoreNavigation
          active={tab}
          onSelect={openTab}
          counts={{ products: products.length, reviews: store.reviewCount }}
        />

        <div
          key={tab}
          role="tabpanel"
          id={panelId(tab)}
          aria-labelledby={tabId(tab)}
          tabIndex={0}
          className="rise-in pt-10 outline-none"
        >
          {tab === 'home' && (
            <StoreHome
              store={store}
              details={details}
              products={products}
              sections={sections}
              onOpenTab={openTab}
              onOpenSection={openSection}
            />
          )}
          {tab === 'products' && (
            <StoreProductSection
              products={products}
              sections={sections}
              initialSection={initialSection}
            />
          )}
          {tab === 'about' && <StoreAbout store={store} details={details} />}
          {tab === 'reviews' && (
            <StoreReviews store={store} reviews={details.reviews} />
          )}
        </div>
      </div>

      <StoreContactModal
        storeName={store.name}
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </main>
  )
}

export default function StorePage() {
  const { slug } = useParams()
  const store = getStoreBySlug(slug)
  const details = store ? getStoreDetails(store.slug) : undefined

  useEffect(() => {
    if (!store) document.title = 'Store not found · Findaimarket'
  }, [store])

  if (!store || !details) return <StoreNotFound />

  // Keyed by slug so follow state, filters and tab start fresh for each store
  return <StoreView key={store.slug} store={store} details={details} />
}

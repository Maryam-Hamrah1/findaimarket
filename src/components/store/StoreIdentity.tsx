import {
  BadgeCheck,
  Calendar,
  Check,
  Heart,
  Link2,
  MapPin,
  MessageSquare,
  Share2,
  Tag,
} from 'lucide-react'
import { useShareLink } from '../../hooks/useShareLink'
import type { Store } from '../../types/store'
import { formatMonthYear, getStoreCategoryLabel } from '../../utils/stores'
import Button from '../ui/Button'
import StoreLogo from '../ui/StoreLogo'

interface StoreIdentityProps {
  store: Store
  following: boolean
  onToggleFollow: () => void
  onContact: () => void
}

export default function StoreIdentity({
  store,
  following,
  onToggleFollow,
  onContact,
}: StoreIdentityProps) {
  const { status, share } = useShareLink(store.name, store.description)

  const shareLabel =
    status === 'shared' ? 'Shared' : status === 'copied' ? 'Link copied' : 'Share'

  return (
    <div className="flex flex-col gap-6 px-1 pb-2 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        <StoreLogo
          name={store.name}
          logo={store.logo}
          size="lg"
          className="-mt-14 ml-4 sm:-mt-16 sm:ml-0"
        />

        <div className="min-w-0 sm:pt-3">
          <h1 className="flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-4xl font-medium leading-tight text-foreground sm:text-5xl">
            {store.name}
            {store.verified && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 px-3 py-1 text-xs font-semibold text-accent">
                <BadgeCheck size={15} aria-hidden="true" />
                Verified store
              </span>
            )}
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
            {store.description}
          </p>

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            <li className="flex items-center gap-1.5">
              <Tag size={15} aria-hidden="true" />
              {getStoreCategoryLabel(store)}
            </li>
            <li className="flex items-center gap-1.5">
              <MapPin size={15} aria-hidden="true" />
              {store.city}, {store.country}
            </li>
            <li className="flex items-center gap-1.5">
              <Calendar size={15} aria-hidden="true" />
              Joined {formatMonthYear(store.createdAt)}
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 lg:shrink-0">
        <Button
          variant={following ? 'outline' : 'secondary'}
          onClick={onToggleFollow}
          aria-pressed={following}
          className="min-h-11"
        >
          {following ? <Check size={17} /> : <Heart size={17} />}
          {following ? 'Following' : 'Follow'}
        </Button>

        <Button variant="outline" onClick={share} className="min-h-11">
          {status === 'idle' ? <Share2 size={17} /> : <Link2 size={17} />}
          <span aria-live="polite">{shareLabel}</span>
        </Button>

        <Button variant="primary" onClick={onContact} className="min-h-11">
          <MessageSquare size={17} />
          Contact Seller
        </Button>
      </div>

      {status === 'manual' && (
        <p role="status" className="text-sm text-muted lg:basis-full">
          Copy the link from your browser&rsquo;s address bar to share this store.
        </p>
      )}
    </div>
  )
}

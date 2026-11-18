import {
  Clock,
  CreditCard,
  Globe,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Truck,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import type { Store, StoreDetails } from '../../types/store'

interface StoreAboutProps {
  store: Store
  details: StoreDetails
}

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-brand-border bg-surface p-6">
      <h3 className="flex items-center gap-2.5 font-display text-2xl font-semibold text-foreground">
        <Icon size={20} className="text-accent" aria-hidden="true" />
        {title}
      </h3>
      <div className="mt-3 text-sm leading-7 text-muted">{children}</div>
    </section>
  )
}

export default function StoreAbout({ store, details }: StoreAboutProps) {
  const { seller, contact, policies } = details

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-8">
        <section>
          <h2 className="font-display text-3xl font-medium text-foreground">
            Our story
          </h2>
          <div className="mt-4 space-y-4 text-base leading-8 text-muted">
            {details.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-brand-border bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            Meet the seller
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">
            {seller.name}
          </h3>
          <p className="text-sm text-muted">{seller.role}</p>
          {seller.bio !== '' && <p className="mt-3 text-sm leading-7 text-muted">{seller.bio}</p>}
        </section>

        <div className="grid gap-5 sm:grid-cols-2">
          <Card icon={Truck} title="Shipping">
            {policies.shipping}
          </Card>
          <Card icon={RotateCcw} title="Returns">
            {policies.returns}
          </Card>
        </div>

        {policies.payments.length > 0 && (
        <Card icon={CreditCard} title="Accepted payments">
          <ul className="flex flex-wrap gap-2">
            {policies.payments.map((payment) => (
              <li
                key={payment}
                className="rounded-full border border-brand-border px-3 py-1 text-xs font-semibold text-foreground"
              >
                {payment}
              </li>
            ))}
          </ul>
        </Card>
        )}
      </div>

      <aside className="space-y-5 self-start">
        <Card icon={MapPin} title="Location">
          <p className="text-foreground">
            {store.city}, {store.country}
          </p>
          {details.established !== undefined && (
            <p className="mt-1">Established {details.established}</p>
          )}
        </Card>

        <Card icon={Mail} title="Contact">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Mail size={15} aria-hidden="true" />
              <a href={`mailto:${contact.email}`} className="hover:text-accent">
                {contact.email}
              </a>
            </li>
            {contact.phone && (
              <li className="flex items-center gap-2">
                <Phone size={15} aria-hidden="true" />
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-accent">
                  {contact.phone}
                </a>
              </li>
            )}
            <li className="flex items-center gap-2">
              <Clock size={15} aria-hidden="true" />
              {contact.hours}
            </li>
          </ul>
        </Card>

        {details.socials.length > 0 && (
          <Card icon={Globe} title="Find us online">
            <ul className="flex flex-wrap gap-2">
              {details.socials.map((link) => (
                <li key={link.platform}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center rounded-full border border-brand-border px-4 text-xs font-semibold capitalize text-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    {link.platform === 'x' ? 'X' : link.platform}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <p className="px-1 text-xs leading-5 text-muted">
          {details.userCreated
            ? 'Demo store made with seller onboarding. Nothing here has been verified.'
            : 'Sample content for design preview. This is not a real business.'}
        </p>
      </aside>
    </div>
  )
}

import { Check, RotateCcw, Truck } from 'lucide-react'
import type { ProductDetails } from '../../types/productDetails'

interface ProductDescriptionProps {
  name: string
  details: ProductDetails
}

/** Description, key features, specifications, shipping and returns. Empty parts are left out. */
export default function ProductDescription({ name, details }: ProductDescriptionProps) {
  const { summary, description, features, specs, shipping, returns } = details

  return (
    <section aria-labelledby="details-heading" className="space-y-10">
      <h2 id="details-heading" className="font-display text-3xl font-medium text-foreground">
        Product details
      </h2>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">
            Description
          </h3>
          <p className="mt-3 text-base leading-7 text-muted">{summary}</p>
          {description && (
            <p className="mt-3 whitespace-pre-line text-base leading-7 text-muted">{description}</p>
          )}

          {features.length > 0 && (
            <>
              <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-accent">
                Key features
              </h3>
              <ul className="mt-3 space-y-2.5">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-foreground">
                    <Check size={17} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {specs.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">
              Specifications
            </h3>
            <dl className="mt-3 overflow-hidden rounded-2xl border border-brand-border bg-surface">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="grid grid-cols-[9rem_1fr] gap-4 border-b border-brand-border px-5 py-3.5 text-sm last:border-b-0 sm:grid-cols-[11rem_1fr]"
                >
                  <dt className="text-muted">{spec.label}</dt>
                  <dd className="text-foreground">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      {(shipping || returns) && (
        <div className="grid gap-4 md:grid-cols-2">
          {shipping && (
            <div className="rounded-2xl border border-brand-border bg-surface p-5">
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                <Truck size={18} className="text-accent" aria-hidden="true" />
                Shipping
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">{shipping}</p>
            </div>
          )}

          {returns && (
            <div className="rounded-2xl border border-brand-border bg-surface p-5">
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                <RotateCcw size={18} className="text-accent" aria-hidden="true" />
                Returns
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">{returns}</p>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-muted">
        Product information for {name} is sample content for design preview.
      </p>
    </section>
  )
}

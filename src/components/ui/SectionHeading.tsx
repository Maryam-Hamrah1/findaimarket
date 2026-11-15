import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  linkText?: string
  linkTo?: string
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  linkText,
  linkTo,
}: SectionHeadingProps) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>

        <h2 className="font-display text-4xl font-medium leading-tight text-foreground sm:text-5xl">
          {title}
        </h2>

        {description && (
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">
            {description}
          </p>
        )}
      </div>

      {linkText && linkTo && (
        <Link
          to={linkTo}
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-accent"
        >
          {linkText}
          <ArrowRight size={17} />
        </Link>
      )}
    </div>
  )
}

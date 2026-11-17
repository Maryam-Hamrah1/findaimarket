import CoverImage from '../ui/CoverImage'

interface StoreCoverProps {
  src: string
}

export default function StoreCover({ src }: StoreCoverProps) {
  return (
    <div className="relative">
      <CoverImage
        src={src}
        className="h-44 rounded-3xl border border-brand-border sm:h-60 lg:h-72"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-background/60 to-transparent"
      />
    </div>
  )
}

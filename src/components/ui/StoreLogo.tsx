import { useState } from 'react'
import { getInitials } from '../../utils/stores'

type LogoSize = 'sm' | 'md' | 'lg'

interface StoreLogoProps {
  name: string
  /** Image URL. Empty (or a broken image) shows the store's initials instead. */
  logo: string
  size?: LogoSize
  className?: string
}

const SIZES: Record<LogoSize, string> = {
  sm: 'h-14 w-14 rounded-xl text-xl',
  md: 'h-20 w-20 rounded-2xl text-3xl',
  lg: 'h-24 w-24 rounded-3xl text-4xl sm:h-28 sm:w-28',
}

export default function StoreLogo({
  name,
  logo,
  size = 'md',
  className = '',
}: StoreLogoProps) {
  const [failed, setFailed] = useState(false)
  const showImage = logo !== '' && !failed

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden border-4 border-surface bg-primary-light font-display font-semibold text-accent shadow-card ${SIZES[size]} ${className}`}
    >
      {showImage ? (
        <img
          src={logo}
          alt={`${name} logo`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span role="img" aria-label={`${name} logo`}>
          {getInitials(name)}
        </span>
      )}
    </div>
  )
}

import { useState } from 'react'

interface CoverImageProps {
  /** Image URL. Empty (or a broken image) shows the brand background instead. */
  src: string
  className?: string
  imageClassName?: string
}

/** Decorative cover photo with a brand-colour fallback. */
export default function CoverImage({
  src,
  className = '',
  imageClassName = '',
}: CoverImageProps) {
  const [failed, setFailed] = useState(false)
  const showImage = src !== '' && !failed

  return (
    <div className={`relative overflow-hidden bg-hero ${className}`}>
      {showImage && (
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imageClassName}`}
        />
      )}
    </div>
  )
}

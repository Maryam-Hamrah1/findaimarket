import { ImageOff, Play, ZoomIn } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import type { ProductImage, ProductVideo } from '../../types/productDetails'
import ProductLightbox from './ProductLightbox'

interface ProductGalleryProps {
  name: string
  images: ProductImage[]
  video?: ProductVideo
  /** Badges drawn over the main photo */
  badges?: ReactNode
}

/** Main photo, thumbnails, optional video, and a full-screen viewer. */
export default function ProductGallery({
  name,
  images,
  video,
  badges,
}: ProductGalleryProps) {
  // Index 0..n-1 are photos; index n is the video when there is one
  const videoIndex = video ? images.length : -1
  const total = images.length + (video ? 1 : 0)

  const [selected, setSelected] = useState(0)
  const [failed, setFailed] = useState<ReadonlySet<string>>(new Set())
  const [viewerOpen, setViewerOpen] = useState(false)

  const showingVideo = selected === videoIndex
  const current = showingVideo ? undefined : images[selected]
  const currentFailed = current ? failed.has(current.src) : false

  const markFailed = (src: string) => setFailed((previous) => new Set(previous).add(src))

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-brand-border bg-surface-hover">
        {showingVideo && video ? (
          <video
            key={video.src}
            src={video.src}
            poster={video.poster}
            controls
            playsInline
            preload="metadata"
            aria-label={`${name}, product video`}
            className="fade-in h-full w-full object-contain"
          />
        ) : current && !currentFailed ? (
          <button
            type="button"
            onClick={() => setViewerOpen(true)}
            aria-label={`Enlarge photo of ${name}`}
            className="group/zoom block h-full w-full cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
          >
            <img
              key={current.src}
              src={current.src}
              alt={current.alt}
              onError={() => markFailed(current.src)}
              className="fade-in h-full w-full object-cover transition-transform duration-500 group-hover/zoom:scale-105"
            />
            <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur-md">
              <ZoomIn size={14} aria-hidden="true" />
              Zoom
            </span>
          </button>
        ) : (
          <div
            role="img"
            aria-label={`No photo available for ${name}`}
            className="flex h-full w-full flex-col items-center justify-center gap-3 bg-primary-light text-muted"
          >
            <ImageOff size={42} strokeWidth={1.4} />
            <span className="text-sm">Photo coming soon</span>
          </div>
        )}

        {badges && <div className="absolute left-4 top-4 flex flex-col gap-2">{badges}</div>}
      </div>

      {total > 1 && (
        <ul className="mt-4 flex gap-3 overflow-x-auto pb-1 no-scrollbar" aria-label="Product media">
          {images.map((image, index) => (
            <li key={image.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setSelected(index)}
                aria-label={`Show photo ${index + 1} of ${images.length}`}
                aria-current={selected === index}
                className={`h-20 w-20 overflow-hidden rounded-xl border-2 bg-surface-hover transition-colors sm:h-24 sm:w-24 ${
                  selected === index
                    ? 'border-accent'
                    : 'border-brand-border hover:border-accent/60'
                }`}
              >
                <img
                  src={image.src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
            </li>
          ))}

          {video && (
            <li className="shrink-0">
              <button
                type="button"
                onClick={() => setSelected(videoIndex)}
                aria-label="Play product video"
                aria-current={showingVideo}
                className={`flex h-20 w-20 items-center justify-center rounded-xl border-2 bg-primary-light text-accent transition-colors sm:h-24 sm:w-24 ${
                  showingVideo ? 'border-accent' : 'border-brand-border hover:border-accent/60'
                }`}
              >
                <Play size={26} aria-hidden="true" />
              </button>
            </li>
          )}
        </ul>
      )}

      {viewerOpen && images.length > 0 && (
        <ProductLightbox
          images={images}
          index={Math.min(selected, images.length - 1)}
          onIndexChange={setSelected}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  photos: string[]
  title: string
}

export function ImageGallery({ photos, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (photos.length === 0) {
    return (
      <div className="aspect-[16/9] w-full rounded-2xl bg-muted flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No photos available</p>
      </div>
    )
  }

  const current = photos[activeIndex]

  function prev() {
    setActiveIndex((i) => (i === 0 ? photos.length - 1 : i - 1))
  }

  function next() {
    setActiveIndex((i) => (i === photos.length - 1 ? 0 : i + 1))
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
          <Image
            key={current}
            src={current}
            alt={`${title} — photo ${activeIndex + 1}`}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority={activeIndex === 0}
          />

          {/* Expand button */}
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
            aria-label="View fullscreen"
          >
            <Expand className="h-4 w-4" />
          </button>

          {/* Nav arrows — only if multiple photos */}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
                aria-label="Next photo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Dot indicator */}
          {photos.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-200',
                    i === activeIndex
                      ? 'w-4 bg-white'
                      : 'w-1.5 bg-white/60 hover:bg-white/80'
                  )}
                  aria-label={`Go to photo ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnails — shown when > 1 photo */}
        {photos.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {photos.map((photo, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={cn(
                  'relative h-16 w-24 flex-none overflow-hidden rounded-lg transition-all duration-150',
                  i === activeIndex
                    ? 'ring-2 ring-primary ring-offset-1'
                    : 'opacity-60 hover:opacity-100'
                )}
                aria-label={`Select photo ${i + 1}`}
              >
                <Image
                  src={photo}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
              <Image
                src={current}
                alt={`${title} — photo ${activeIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-10 right-4 text-white/70 hover:text-white text-sm font-medium transition-colors"
            >
              Close ✕
            </button>

            {/* Lightbox nav */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-6 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-6 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <p className="mt-3 text-center text-sm text-white/60">
              {activeIndex + 1} / {photos.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toggleFavorite, useIsFavorite } from '@/lib/favorites'

interface FavoriteButtonProps {
  listingId: string
  className?: string
  variant?: 'floating' | 'inline'
}

export function FavoriteButton({
  listingId,
  className,
  variant = 'inline',
}: FavoriteButtonProps) {
  const favorited = useIsFavorite(listingId)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(listingId)
  }

  if (variant === 'floating') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={favorited ? 'Remove from saved' : 'Save listing'}
        className={cn(
          'absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full',
          'bg-white/90 backdrop-blur-sm shadow-sm',
          'transition-all duration-200 hover:scale-110 hover:bg-white',
          className
        )}
      >
        <Heart
          className={cn(
            'h-4 w-4 transition-colors duration-200',
            favorited ? 'fill-red-500 text-red-500' : 'fill-transparent text-slate-500'
          )}
        />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={favorited ? 'Remove from saved' : 'Save listing'}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200',
        favorited
          ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100'
          : 'border-border text-muted-foreground hover:text-red-500 hover:bg-red-50 hover:border-red-200',
        className
      )}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-colors duration-200',
          favorited ? 'fill-red-500 text-red-500' : 'fill-transparent'
        )}
      />
    </button>
  )
}

export default FavoriteButton

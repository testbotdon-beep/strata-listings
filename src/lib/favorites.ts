'use client'

import { useState, useEffect } from 'react'

const KEY = 'strata-favorites'

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id)
}

export function toggleFavorite(id: string): boolean {
  const current = getFavorites()
  const next = current.includes(id)
    ? current.filter((x) => x !== id)
    : [...current, id]
  localStorage.setItem(KEY, JSON.stringify(next))
  window.dispatchEvent(new Event('favorites-changed'))
  return next.includes(id)
}

export function useFavorites(): string[] {
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    setIds(getFavorites())
    const handler = () => setIds(getFavorites())
    window.addEventListener('favorites-changed', handler)
    return () => window.removeEventListener('favorites-changed', handler)
  }, [])

  return ids
}

export function useIsFavorite(id: string): boolean {
  const ids = useFavorites()
  return ids.includes(id)
}

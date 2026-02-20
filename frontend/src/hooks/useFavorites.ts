import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'puma-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch {
        setFavorites([])
      }
    }
  }, [])

  const saveFavorites = useCallback((newFavorites: string[]) => {
    setFavorites(newFavorites)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites))
  }, [])

  const addFavorite = useCallback((id: string) => {
    saveFavorites([...favorites, id])
  }, [favorites, saveFavorites])

  const removeFavorite = useCallback((id: string) => {
    saveFavorites(favorites.filter(f => f !== id))
  }, [favorites, saveFavorites])

  const toggleFavorite = useCallback((id: string) => {
    if (favorites.includes(id)) {
      removeFavorite(id)
    } else {
      addFavorite(id)
    }
  }, [favorites, addFavorite, removeFavorite])

  const isFavorite = useCallback((id: string) => {
    return favorites.includes(id)
  }, [favorites])

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  }
}

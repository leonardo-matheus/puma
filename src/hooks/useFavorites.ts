'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'puma_favorites'

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setFavoriteIds(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds))
      } catch (error) {
        console.error('Error saving favorites:', error)
      }
    }
  }, [favoriteIds, isLoaded])

  const addFavorite = useCallback((vehicleId: string) => {
    setFavoriteIds((prev) => {
      if (prev.includes(vehicleId)) return prev
      return [...prev, vehicleId]
    })
  }, [])

  const removeFavorite = useCallback((vehicleId: string) => {
    setFavoriteIds((prev) => prev.filter((id) => id !== vehicleId))
  }, [])

  const toggleFavorite = useCallback((vehicleId: string) => {
    setFavoriteIds((prev) => {
      if (prev.includes(vehicleId)) {
        return prev.filter((id) => id !== vehicleId)
      }
      return [...prev, vehicleId]
    })
  }, [])

  const isFavorite = useCallback(
    (vehicleId: string) => favoriteIds.includes(vehicleId),
    [favoriteIds]
  )

  const clearFavorites = useCallback(() => {
    setFavoriteIds([])
  }, [])

  return {
    favoriteIds,
    isLoaded,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count: favoriteIds.length,
  }
}

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { VehicleCard } from '@/components/VehicleCard'
import { useFavorites } from '@/hooks/useFavorites'
import type { Vehicle } from '@/types'

export default function FavoritesPage() {
  const { favoriteIds, clearFavorites, isLoaded } = useFavorites()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded) {
      if (favoriteIds.length > 0) {
        fetchFavoriteVehicles()
      } else {
        setVehicles([])
        setLoading(false)
      }
    }
  }, [favoriteIds, isLoaded])

  const fetchFavoriteVehicles = async () => {
    setLoading(true)
    try {
      // Fetch all vehicles and filter by favorites
      const res = await fetch('/api/vehicles')
      if (res.ok) {
        const data = await res.json()
        const allVehicles = data.vehicles || []
        const favoriteVehicles = allVehicles.filter((v: Vehicle) =>
          favoriteIds.includes(v.id)
        )
        setVehicles(favoriteVehicles)
      }
    } catch (error) {
      console.error('Error fetching favorite vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClearFavorites = () => {
    if (confirm('Deseja remover todos os favoritos?')) {
      clearFavorites()
    }
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-700">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Meus <span className="text-gradient">Favoritos</span>
              </h1>
              <p className="text-dark-400">
                {!isLoaded || loading
                  ? 'Carregando...'
                  : vehicles.length === 0
                  ? 'Você ainda não adicionou nenhum veículo aos favoritos.'
                  : `${vehicles.length} veículo${vehicles.length > 1 ? 's' : ''} salvo${vehicles.length > 1 ? 's' : ''}`}
              </p>
            </div>
            {vehicles.length > 0 && (
              <Button variant="outline" onClick={handleClearFavorites}>
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading || !isLoaded ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-dark-800 rounded-2xl animate-pulse">
                <div className="aspect-[3/4] bg-dark-700 rounded-t-2xl" />
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-dark-700 rounded w-3/4" />
                  <div className="h-4 bg-dark-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : vehicles.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {vehicles.map((vehicle, index) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-dark-800 border border-dark-700 rounded-2xl"
          >
            <Heart className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">Nenhum favorito</h2>
            <p className="text-dark-400 mb-6 max-w-md mx-auto">
              Explore nosso estoque e clique no coração para salvar seus veículos favoritos.
            </p>
            <Link href="/carros">
              <Button>Ver veículos</Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}

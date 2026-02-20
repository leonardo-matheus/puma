import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ArrowRight } from 'lucide-react'
import { VehicleCard } from '@/components/VehicleCard'
import { Button } from '@/components/ui'
import { vehicleService } from '@/services/vehicleService'
import { useFavorites } from '@/hooks/useFavorites'
import type { Vehicle } from '@/types'

export function Favorites() {
  const { favorites } = useFavorites()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (favorites.length === 0) {
      setVehicles([])
      setIsLoading(false)
      return
    }

    vehicleService.getAll()
      .then(allVehicles => {
        const favVehicles = allVehicles.filter(v => favorites.includes(v.id))
        setVehicles(favVehicles)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [favorites])

  return (
    <div className="py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white">
            Meus <span className="text-primary-500">Favoritos</span>
          </h1>
          <p className="text-dark-400 mt-2">
            {favorites.length} {favorites.length === 1 ? 'veiculo salvo' : 'veiculos salvos'}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-dark-800 rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        ) : vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-dark-600" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Nenhum favorito ainda
            </h2>
            <p className="text-dark-400 mb-6 max-w-md mx-auto">
              Clique no coracao nos veiculos que voce gostou para salva-los aqui
            </p>
            <Link to="/carros">
              <Button>
                Ver veiculos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

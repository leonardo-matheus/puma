import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Fuel, Calendar, Gauge, Settings2 } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { useFavorites } from '@/hooks/useFavorites'
import type { Vehicle } from '@/types'

interface VehicleCardProps {
  vehicle: Vehicle
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(vehicle.id)

  const mainImage = vehicle.images?.[0]?.url || '/placeholder-car.jpg'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card hover className="group">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Link to={`/carros/${vehicle.id}`}>
            <img
              src={mainImage}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {vehicle.featured && (
              <Badge variant="primary">Destaque</Badge>
            )}
            {vehicle.condition === 'new' && (
              <Badge variant="success">Novo</Badge>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleFavorite(vehicle.id)
            }}
            className="absolute top-3 right-3 w-10 h-10 bg-dark-900/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:bg-primary-500"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                favorite ? 'text-primary-500 fill-primary-500' : 'text-white'
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <Link to={`/carros/${vehicle.id}`}>
            <h3 className="text-lg font-semibold text-white group-hover:text-primary-500 transition-colors">
              {vehicle.brand} {vehicle.model}
            </h3>
            {vehicle.version && (
              <p className="text-sm text-dark-400 mt-1">{vehicle.version}</p>
            )}
          </Link>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="flex items-center gap-2 text-dark-400 text-sm">
              <Calendar className="w-4 h-4" />
              {vehicle.year}{vehicle.yearModel && vehicle.yearModel !== vehicle.year ? `/${vehicle.yearModel}` : ''}
            </div>
            <div className="flex items-center gap-2 text-dark-400 text-sm">
              <Gauge className="w-4 h-4" />
              {formatNumber(vehicle.mileage)} km
            </div>
            <div className="flex items-center gap-2 text-dark-400 text-sm">
              <Fuel className="w-4 h-4" />
              {vehicle.fuel}
            </div>
            <div className="flex items-center gap-2 text-dark-400 text-sm">
              <Settings2 className="w-4 h-4" />
              {vehicle.transmission}
            </div>
          </div>

          {/* Price */}
          <div className="mt-4 pt-4 border-t border-dark-700">
            <p className="text-2xl font-bold text-primary-500">
              {formatCurrency(vehicle.price)}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

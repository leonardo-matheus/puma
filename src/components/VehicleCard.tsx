'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, Fuel, Gauge, Settings2, Calendar } from 'lucide-react'
import { formatCurrency, formatNumber, getVehicleTitle } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { useFavorites } from '@/hooks/useFavorites'
import type { Vehicle } from '@/types'
import { useState } from 'react'

interface VehicleCardProps {
  vehicle: Vehicle
  index?: number
}

export function VehicleCard({ vehicle, index = 0 }: VehicleCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [imageError, setImageError] = useState(false)

  const mainImage = vehicle.images?.[0]?.url || '/images/placeholder-car.jpg'
  const title = getVehicleTitle(vehicle)
  const isVehicleFavorite = isFavorite(vehicle.id)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(vehicle.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/carros/${vehicle.id}`}>
        <div className="group bg-dark-900 border border-dark-800 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-1 sm:hover:-translate-y-2">
          {/* Image Container - vertical/portrait ratio */}
          <div className="relative aspect-[3/4] overflow-hidden bg-dark-800">
            <Image
              src={imageError ? '/images/placeholder-car.jpg' : mainImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ objectPosition: 'center center' }}
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Gradient Overlay - lighter */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950/70 via-transparent to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-wrap gap-1 sm:gap-2">
              {vehicle.featured && (
                <Badge variant="primary" className="text-xs">Destaque</Badge>
              )}
              {vehicle.sold && (
                <Badge variant="danger" className="text-xs">Vendido</Badge>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleToggleFavorite}
              className={`absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isVehicleFavorite
                  ? 'bg-red-500 text-white'
                  : 'bg-dark-950/70 text-dark-300 hover:bg-dark-950 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isVehicleFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Price Tag */}
            <div className="absolute bottom-2 left-2 right-2">
              <div className="bg-primary-500 text-white px-2 py-1 rounded-lg font-bold text-xs sm:text-sm shadow-lg text-center">
                {formatCurrency(vehicle.price)}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4">
            {/* Title */}
            <h3 className="text-white font-semibold text-xs sm:text-sm mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
              {title}
            </h3>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-1 sm:gap-2 mb-2 sm:mb-3">
              <div className="flex items-center gap-1 text-dark-400 text-[10px] sm:text-xs">
                <Calendar className="w-3 h-3 text-primary-500 flex-shrink-0" />
                <span>{vehicle.year}</span>
              </div>
              <div className="flex items-center gap-1 text-dark-400 text-[10px] sm:text-xs">
                <Gauge className="w-3 h-3 text-primary-500 flex-shrink-0" />
                <span>{formatNumber(vehicle.mileage)} km</span>
              </div>
              <div className="flex items-center gap-1 text-dark-400 text-[10px] sm:text-xs">
                <Fuel className="w-3 h-3 text-primary-500 flex-shrink-0" />
                <span className="capitalize truncate">{vehicle.fuel}</span>
              </div>
              <div className="flex items-center gap-1 text-dark-400 text-[10px] sm:text-xs">
                <Settings2 className="w-3 h-3 text-primary-500 flex-shrink-0" />
                <span className="capitalize truncate">{vehicle.transmission}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2 border-t border-dark-800">
              <span className="text-primary-500 font-medium text-[10px] sm:text-xs group-hover:translate-x-1 transition-transform inline-block">
                Ver detalhes →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

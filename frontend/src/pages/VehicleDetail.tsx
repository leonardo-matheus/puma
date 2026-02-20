import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs, FreeMode } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import {
  Heart, Share2, ChevronLeft, Calendar, Gauge, Fuel, Settings2,
  Car, Palette, DoorOpen, Phone, MessageCircle, Check
} from 'lucide-react'
import { Button, Badge, Card, CardContent } from '@/components/ui'
import { formatCurrency, formatNumber, getWhatsAppLink } from '@/lib/utils'
import { vehicleService } from '@/services/vehicleService'
import { useFavorites } from '@/hooks/useFavorites'
import type { Vehicle } from '@/types'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'

export function VehicleDetail() {
  const { id } = useParams<{ id: string }>()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const { isFavorite, toggleFavorite } = useFavorites()

  useEffect(() => {
    if (id) {
      vehicleService.getById(id)
        .then(setVehicle)
        .catch(console.error)
        .finally(() => setIsLoading(false))
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="container">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-dark-800 rounded mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-[4/3] bg-dark-800 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-10 bg-dark-800 rounded w-3/4" />
                <div className="h-6 bg-dark-800 rounded w-1/2" />
                <div className="h-12 bg-dark-800 rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="py-16 text-center">
        <div className="container">
          <h2 className="text-2xl font-bold text-white mb-4">Veiculo nao encontrado</h2>
          <Link to="/carros">
            <Button variant="outline">Voltar para veiculos</Button>
          </Link>
        </div>
      </div>
    )
  }

  const favorite = isFavorite(vehicle.id)
  const whatsappMessage = `Ola! Tenho interesse no veiculo: ${vehicle.brand} ${vehicle.model} ${vehicle.year} - ${formatCurrency(vehicle.price)}`

  const specs = [
    { icon: Calendar, label: 'Ano', value: `${vehicle.year}${vehicle.yearModel && vehicle.yearModel !== vehicle.year ? `/${vehicle.yearModel}` : ''}` },
    { icon: Gauge, label: 'Quilometragem', value: `${formatNumber(vehicle.mileage)} km` },
    { icon: Fuel, label: 'Combustivel', value: vehicle.fuel },
    { icon: Settings2, label: 'Cambio', value: vehicle.transmission },
    { icon: Car, label: 'Carroceria', value: vehicle.bodyType || '-' },
    { icon: Palette, label: 'Cor', value: vehicle.color || '-' },
    { icon: DoorOpen, label: 'Portas', value: vehicle.doors?.toString() || '-' },
  ]

  return (
    <div className="py-8">
      <div className="container">
        {/* Back button */}
        <Link
          to="/carros"
          className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Voltar
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            {vehicle.images && vehicle.images.length > 0 ? (
              <>
                <Swiper
                  modules={[Navigation, Thumbs]}
                  navigation
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  className="rounded-2xl overflow-hidden mb-4"
                >
                  {vehicle.images.map((image, index) => (
                    <SwiperSlide key={image.id || index}>
                      <div className="aspect-[4/3]">
                        <img
                          src={image.url}
                          alt={`${vehicle.brand} ${vehicle.model} - Imagem ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {vehicle.images.length > 1 && (
                  <Swiper
                    modules={[FreeMode, Thumbs]}
                    onSwiper={setThumbsSwiper}
                    spaceBetween={8}
                    slidesPerView={4}
                    freeMode
                    watchSlidesProgress
                    className="thumbs-swiper"
                  >
                    {vehicle.images.map((image, index) => (
                      <SwiperSlide key={image.id || index}>
                        <div className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                          <img
                            src={image.url}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </>
            ) : (
              <div className="aspect-[4/3] bg-dark-800 rounded-2xl flex items-center justify-center">
                <Car className="w-16 h-16 text-dark-600" />
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {vehicle.featured && <Badge variant="primary">Destaque</Badge>}
                  {vehicle.condition === 'new' && <Badge variant="success">Novo</Badge>}
                </div>
                <h1 className="text-3xl font-display font-bold text-white">
                  {vehicle.brand} {vehicle.model}
                </h1>
                {vehicle.version && (
                  <p className="text-lg text-dark-400 mt-1">{vehicle.version}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(vehicle.id)}
                  className="w-12 h-12 bg-dark-800 rounded-lg flex items-center justify-center hover:bg-dark-700 transition-colors"
                >
                  <Heart className={`w-6 h-6 ${favorite ? 'text-primary-500 fill-primary-500' : 'text-dark-400'}`} />
                </button>
                <button
                  onClick={() => navigator.share?.({ title: `${vehicle.brand} ${vehicle.model}`, url: window.location.href })}
                  className="w-12 h-12 bg-dark-800 rounded-lg flex items-center justify-center hover:bg-dark-700 transition-colors"
                >
                  <Share2 className="w-6 h-6 text-dark-400" />
                </button>
              </div>
            </div>

            <p className="text-4xl font-bold text-primary-500 mb-6">
              {formatCurrency(vehicle.price)}
            </p>

            {/* Specs Grid */}
            <Card className="mb-6">
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center">
                        <spec.icon className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-xs text-dark-400">{spec.label}</p>
                        <p className="text-sm font-medium text-white">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Optionals */}
            {vehicle.optionals && vehicle.optionals.length > 0 && (
              <Card className="mb-6">
                <CardContent>
                  <h3 className="text-lg font-semibold text-white mb-4">Opcionais</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {vehicle.optionals.map((optional) => (
                      <div key={optional.id} className="flex items-center gap-2 text-sm text-dark-300">
                        <Check className="w-4 h-4 text-green-500" />
                        {optional.name}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {vehicle.description && (
              <Card className="mb-6">
                <CardContent>
                  <h3 className="text-lg font-semibold text-white mb-4">Descricao</h3>
                  <p className="text-dark-300 whitespace-pre-line">{vehicle.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={getWhatsAppLink('16992537016', whatsappMessage)} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
              </a>
              <a href="tel:+551620162615" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Phone className="w-5 h-5 mr-2" />
                  Ligar
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Heart, Share2, ChevronLeft, ChevronRight, Phone,
  Calendar, Gauge, Fuel, Settings2, Palette, DoorOpen,
  Car, MapPin, Check, ZoomIn, MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ImageLightbox } from '@/components/ImageLightbox'
import { useFavorites } from '@/hooks/useFavorites'
import { formatCurrency, formatNumber, getVehicleTitle, getWhatsAppLink } from '@/lib/utils'
import type { Vehicle } from '@/types'

export default function VehicleDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { isFavorite, toggleFavorite } = useFavorites()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    fetchVehicle()
  }, [id])

  const fetchVehicle = async () => {
    try {
      const res = await fetch(`/api/vehicles/${id}`)
      if (res.ok) {
        const data = await res.json()
        setVehicle(data)
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <Car className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Veículo não encontrado</h2>
          <p className="text-dark-400 mb-6">O veículo que você procura não existe ou foi removido.</p>
          <Link href="/carros">
            <Button>Ver todos os veículos</Button>
          </Link>
        </div>
      </div>
    )
  }

  const title = getVehicleTitle(vehicle)
  const images = vehicle.images.length > 0
    ? vehicle.images
    : [{ id: 'placeholder', url: '/images/placeholder-car.jpg', order: 0, vehicleId: '' }]

  const whatsappMessage = `Olá! Tenho interesse no veículo: ${title} - ${formatCurrency(vehicle.price)}`
  const whatsappLink = getWhatsAppLink('16992537016', whatsappMessage)

  const specs = [
    { icon: Calendar, label: 'Ano', value: vehicle.yearModel ? `${vehicle.year}/${vehicle.yearModel}` : vehicle.year },
    { icon: Gauge, label: 'Quilometragem', value: `${formatNumber(vehicle.mileage)} km` },
    { icon: Fuel, label: 'Combustível', value: vehicle.fuel },
    { icon: Settings2, label: 'Câmbio', value: vehicle.transmission },
    { icon: Car, label: 'Carroceria', value: vehicle.bodyType || '-' },
    { icon: Palette, label: 'Cor', value: vehicle.color || '-' },
    { icon: DoorOpen, label: 'Portas', value: vehicle.doors || '-' },
  ]

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Confira este ${title} na Puma Multimarcas!`,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado!')
    }
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Breadcrumb */}
      <div className="bg-dark-800 border-b border-dark-700">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-dark-400 hover:text-white transition-colors">Home</Link>
            <span className="text-dark-600">/</span>
            <Link href="/carros" className="text-dark-400 hover:text-white transition-colors">Veículos</Link>
            <span className="text-dark-600">/</span>
            <span className="text-primary-400">{title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {/* Main Image - vertical/portrait ratio */}
            <div
              className="relative aspect-[3/4] max-h-[70vh] rounded-2xl overflow-hidden bg-dark-800 cursor-pointer group"
              onClick={() => setLightboxOpen(true)}
            >
              <Image
                src={images[currentImage].url}
                alt={`${title} - Imagem ${currentImage + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Zoom overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <div className="bg-dark-900/80 rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100">
                  <ZoomIn className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      prevImage()
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-dark-900/80 hover:bg-dark-900 rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-dark-900/80 hover:bg-dark-900 rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-dark-900/80 px-4 py-2 rounded-full text-sm text-white">
                  {currentImage + 1} / {images.length}
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {vehicle.featured && <Badge variant="primary">Destaque</Badge>}
                {vehicle.sold && <Badge variant="danger">Vendido</Badge>}
              </div>

              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(vehicle.id)
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isFavorite(vehicle.id) ? 'bg-red-500 text-white' : 'bg-dark-900/80 text-white hover:bg-dark-900'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite(vehicle.id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleShare()
                  }}
                  className="w-10 h-10 bg-dark-900/80 hover:bg-dark-900 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnails - vertical ratio */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentImage(index)}
                    className={`flex-shrink-0 relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImage === index
                        ? 'border-primary-500'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </button>
                ))}
              </div>
            )}

            <p className="text-dark-500 text-sm text-center mt-3">
              Clique na imagem para ampliar e dar zoom
            </p>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Title & Price */}
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                {title}
              </h1>
              {vehicle.version && (
                <p className="text-dark-400 text-lg mb-4">{vehicle.version}</p>
              )}
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-primary-400">
                  {formatCurrency(vehicle.price)}
                </span>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">Especificações</h2>
              <div className="grid grid-cols-2 gap-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center">
                      <spec.icon className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-dark-400 text-xs">{spec.label}</p>
                      <p className="text-white font-medium capitalize">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {vehicle.description && (
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
                <h2 className="text-white font-semibold text-lg mb-4">Descrição</h2>
                <p className="text-dark-300 leading-relaxed whitespace-pre-line">
                  {vehicle.description}
                </p>
              </div>
            )}

            {/* Optionals */}
            {vehicle.optionals && vehicle.optionals.length > 0 && (
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
                <h2 className="text-white font-semibold text-lg mb-4">Opcionais</h2>
                <div className="grid grid-cols-2 gap-2">
                  {vehicle.optionals.map((opt) => (
                    <div key={opt.id} className="flex items-center gap-2 text-dark-300">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{opt.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">Interessado?</h2>
              <p className="text-dark-400 mb-4">
                Entre em contato com um de nossos vendedores e faça o melhor negócio!
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={whatsappLink} target="_blank" className="flex-1">
                  <Button className="w-full bg-green-600 hover:bg-green-500 text-white">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </Button>
                </Link>
                <Link href="tel:+551620162615" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Phone className="w-5 h-5 mr-2" />
                    Ligar
                  </Button>
                </Link>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 text-dark-400">
              <MapPin className="w-5 h-5" />
              <span>Av. Rincão, 471 – Jardim Buscardi, Matão – SP</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      <ImageLightbox
        images={images}
        initialIndex={currentImage}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  )
}

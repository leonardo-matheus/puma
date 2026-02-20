'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Car, Shield, Truck, CreditCard, ChevronRight, Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { VehicleCard } from '@/components/VehicleCard'
import { BannerCarousel } from '@/components/BannerCarousel'
import type { Vehicle } from '@/types'

const features = [
  {
    icon: Shield,
    title: 'Garantia de Qualidade',
    description: 'Todos os veículos passam por rigorosa inspeção técnica.',
  },
  {
    icon: CreditCard,
    title: 'Financiamento Facilitado',
    description: 'As melhores taxas do mercado com aprovação rápida.',
  },
  {
    icon: Truck,
    title: 'CarDelivery',
    description: 'Entregamos seu veículo na sua casa com segurança.',
  },
  {
    icon: Star,
    title: '+20 Anos de Experiência',
    description: 'Equipe especializada no mercado automotivo.',
  },
]

export default function HomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/vehicles?featured=true&limit=6')
      const data = await res.json()
      setVehicles(data.vehicles || [])
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Banner Carousel */}
      <section className="bg-dark-950">
        <div className="container mx-auto px-4 pt-4 sm:pt-6">
          <BannerCarousel autoPlayInterval={4000} />
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 sm:py-12 bg-dark-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-3 sm:mb-4">
              Encontre o <span className="text-gradient">carro perfeito</span>
            </h1>
            <p className="text-dark-400 mb-6 sm:mb-8 text-sm sm:text-base">
              Os melhores seminovos de Matão e região com as melhores condições
            </p>

            {/* Search Bar */}
            <div className="bg-dark-900 border border-dark-800 rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por marca, modelo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={<Search className="w-4 h-4 sm:w-5 sm:h-5" />}
                  />
                </div>
                <Link href={`/carros${searchTerm ? `?search=${searchTerm}` : ''}`} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Buscar
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex justify-center flex-wrap gap-6 sm:gap-10 mt-6 sm:mt-8">
              {[
                { value: '500+', label: 'Veículos vendidos' },
                { value: '20+', label: 'Anos de experiência' },
                { value: '100%', label: 'Satisfação' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-primary-500">{stat.value}</div>
                  <div className="text-dark-500 text-xs sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-dark-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-900 border border-dark-800 rounded-xl p-4 sm:p-6 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" />
                </div>
                <h3 className="text-white font-semibold text-sm sm:text-base mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-xs sm:text-sm leading-relaxed hidden sm:block">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-12 sm:py-20 bg-dark-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-10 gap-4"
          >
            <div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-2">
                Veículos em <span className="text-gradient">Destaque</span>
              </h2>
              <p className="text-dark-400 text-sm sm:text-base">
                Os melhores veículos selecionados para você
              </p>
            </div>
            <Link href="/carros">
              <Button variant="outline" className="w-full sm:w-auto">
                Ver todos
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-dark-900 rounded-xl animate-pulse">
                  <div className="aspect-[3/4] bg-dark-800 rounded-t-xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-dark-800 rounded w-3/4" />
                    <div className="h-4 bg-dark-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : vehicles.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {vehicles.map((vehicle, index) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-dark-900 rounded-xl border border-dark-800">
              <Car className="w-12 h-12 text-dark-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Nenhum veículo em destaque</h3>
              <p className="text-dark-400 text-sm">Confira todos os veículos disponíveis.</p>
              <Link href="/carros" className="inline-block mt-4">
                <Button>Ver veículos</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-3 sm:mb-4">
              Quer vender ou trocar seu veículo?
            </h2>
            <p className="text-white/80 text-sm sm:text-lg mb-6">
              Avaliamos seu veículo pelo valor justo de mercado!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/avaliacao">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-100">
                  Avaliar meu veículo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="https://wa.me/5516992537016" target="_blank">
                <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white border-0">
                  WhatsApp
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

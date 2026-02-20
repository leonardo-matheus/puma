import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Car, Shield, ThumbsUp, Clock } from 'lucide-react'
import { BannerCarousel } from '@/components/BannerCarousel'
import { VehicleCard } from '@/components/VehicleCard'
import { Button } from '@/components/ui'
import { vehicleService } from '@/services/vehicleService'
import type { Vehicle } from '@/types'

const features = [
  {
    icon: Shield,
    title: 'Veiculos Revisados',
    description: 'Todos os veiculos passam por rigorosa inspecao mecanica.',
  },
  {
    icon: ThumbsUp,
    title: 'Garantia',
    description: 'Garantia de 90 dias para motor e cambio.',
  },
  {
    icon: Car,
    title: 'Financiamento',
    description: 'Facilitamos seu financiamento com as melhores taxas.',
  },
  {
    icon: Clock,
    title: 'Atendimento',
    description: 'Equipe especializada para melhor atende-lo.',
  },
]

export function Home() {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    vehicleService.getAll({ featured: true, limit: 6 })
      .then(setFeaturedVehicles)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div>
      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Features */}
      <section className="py-16 bg-dark-900">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-dark-400 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-white">
                Veiculos em <span className="text-primary-500">Destaque</span>
              </h2>
              <p className="text-dark-400 mt-2">
                Confira nossas melhores ofertas
              </p>
            </div>
            <Link to="/carros">
              <Button variant="outline" className="hidden sm:inline-flex">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-dark-800 rounded-2xl h-96 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>

              {featuredVehicles.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-dark-400">
                    Nenhum veiculo em destaque no momento.
                  </p>
                </div>
              )}
            </>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link to="/carros">
              <Button variant="outline">
                Ver todos os veiculos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-500">
        <div className="container text-center">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
            Quer vender seu carro?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Fazemos uma avaliacao justa e transparente do seu veiculo.
            Entre em contato e receba uma proposta!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/avaliacao">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-dark-100">
                Solicitar Avaliacao
              </Button>
            </Link>
            <a href="https://wa.me/5516992537016" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

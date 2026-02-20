'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function LocationPage() {
  const address = 'Av. Rincão, 471 – Jardim Buscardi, Matão – SP, 15991-210'
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  const mapsEmbed = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.8!2d-48.365!3d-21.603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDM2JzEwLjgiUyA0OMKwMjEnNTQuMCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890`

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Nossa <span className="text-gradient">Localização</span>
            </h1>
            <p className="text-xl text-dark-300 leading-relaxed">
              Venha nos visitar! Estamos localizados em Matão, interior de São Paulo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
                <div className="aspect-[16/9]">
                  <iframe
                    src={mapsEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Address Card */}
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Endereço</h3>
                    <p className="text-dark-400">{address}</p>
                  </div>
                </div>

                <a href={mapsUrl} target="_blank">
                  <Button className="w-full">
                    <Navigation className="w-5 h-5 mr-2" />
                    Abrir no Google Maps
                  </Button>
                </a>
              </div>

              {/* Hours Card */}
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-3">Horário de Funcionamento</h3>
                    <div className="space-y-2 text-dark-400">
                      <div className="flex justify-between">
                        <span>Segunda a Sexta</span>
                        <span className="text-white">09:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sábado</span>
                        <span className="text-white">09:00 - 13:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Domingo</span>
                        <span className="text-red-400">Fechado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Telefone</h3>
                    <a href="tel:+551620162615" className="text-primary-400 hover:underline">
                      (16) 2016-2615
                    </a>
                  </div>
                </div>

                <Link href="https://wa.me/5516992537016" target="_blank">
                  <Button className="w-full bg-green-600 hover:bg-green-500">
                    <Phone className="w-5 h-5 mr-2" />
                    WhatsApp
                  </Button>
                </Link>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-6 text-center">
                <h3 className="text-dark-900 font-bold text-xl mb-2">
                  Venha nos visitar!
                </h3>
                <p className="text-dark-800 mb-4">
                  Confira nosso estoque presencialmente.
                </p>
                <Link href="/carros">
                  <Button variant="secondary" size="sm">
                    Ver veículos
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

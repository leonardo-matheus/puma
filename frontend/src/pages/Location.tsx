import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, Navigation } from 'lucide-react'
import { Card, CardContent, Button } from '@/components/ui'

export function Location() {
  const address = 'Av. Rincao, 471 - Jardim Buscardi, Matao - SP, 15991-210'
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  const mapsEmbed = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3714.8371!2d-48.3657!3d-21.6014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDM2JzA1LjAiUyA0OMKwMjEnNTYuNSJX!5e0!3m2!1spt-BR!2sbr!4v1234567890`

  return (
    <div className="py-8">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Nossa <span className="text-primary-500">Localizacao</span>
          </h1>
          <p className="text-dark-400 max-w-2xl mx-auto">
            Venha nos visitar! Estamos localizados em um ponto de facil acesso
            em Matao, SP.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Cards */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Endereco</h3>
                      <p className="text-dark-400 text-sm">
                        Av. Rincao, 471<br />
                        Jardim Buscardi<br />
                        Matao - SP, 15991-210
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Horario de Funcionamento</h3>
                      <p className="text-dark-400 text-sm">
                        Segunda a Sexta: 09:00 - 18:00<br />
                        Sabado: 09:00 - 13:00<br />
                        Domingo: Fechado
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Contato</h3>
                      <p className="text-dark-400 text-sm">
                        Telefone: (16) 2016-2615<br />
                        WhatsApp: (16) 99253-7016<br />
                        Email: pumamultimarcas@yahoo.com
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <Button className="w-full" size="lg">
                  <Navigation className="w-5 h-5 mr-2" />
                  Abrir no Google Maps
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden h-full min-h-[400px]">
              <iframe
                src={mapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 400 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localizacao Puma Multimarcas"
              />
            </Card>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Card>
            <CardContent className="p-6 lg:p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-4">
                Como chegar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-white mb-2">De carro</h3>
                  <p className="text-dark-400 text-sm">
                    Estamos localizados na Avenida Rincao, uma das principais vias de Matao.
                    Amplo estacionamento disponivel para clientes.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Pontos de referencia</h3>
                  <p className="text-dark-400 text-sm">
                    Proximo ao Jardim Buscardi, facil acesso pela rodovia Washington Luis (SP-310).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

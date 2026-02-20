'use client'

import { motion } from 'framer-motion'
import { Shield, Award, Truck, Users, Target, Eye, Heart, Phone } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const values = [
  {
    icon: Shield,
    title: 'Confiança',
    description: 'Transparência e honestidade em todas as negociações.',
  },
  {
    icon: Award,
    title: 'Qualidade',
    description: 'Veículos rigorosamente inspecionados e aprovados.',
  },
  {
    icon: Users,
    title: 'Atendimento',
    description: 'Equipe especializada focada na sua satisfação.',
  },
  {
    icon: Truck,
    title: 'CarDelivery',
    description: 'Entregamos seu veículo onde você estiver.',
  },
]

const team = [
  { name: 'Maylon', phone: '(16) 99253-7016', role: 'Vendedor' },
  { name: 'Diego', phone: '(16) 99317-6275', role: 'Vendedor' },
  { name: 'Vinicius', phone: '(16) 99622-1011', role: 'Vendedor' },
  { name: 'Deyvis', phone: '(16) 99312-3344', role: 'Vendedor' },
  { name: 'Marcelo', phone: '(16) 99747-9719', role: 'Vendedor' },
  { name: 'Leo', phone: '(16) 99265-5601', role: 'Vendedor' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Sobre a <span className="text-gradient">Puma Multimarcas</span>
            </h1>
            <p className="text-xl text-dark-300 leading-relaxed">
              Desde 2021, a Puma Multimarcas é referência em qualidade e confiança no mercado de veículos seminovos em Matão e região.
            </p>
          </motion.div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 bg-dark-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold text-white mb-6">
                Nossa História
              </h2>
              <div className="space-y-4 text-dark-300 leading-relaxed">
                <p>
                  A Puma Multimarcas nasceu com o objetivo de oferecer uma experiência diferenciada na compra de veículos seminovos. Com uma equipe que acumula mais de 20 anos de experiência no mercado automotivo, entendemos as necessidades de cada cliente.
                </p>
                <p>
                  Nossa missão é proporcionar tranquilidade e satisfação, oferecendo veículos de qualidade com as melhores condições de pagamento do mercado.
                </p>
                <p>
                  Localizada em Matão, interior de São Paulo, atendemos toda a região com profissionalismo e dedicação, incluindo nosso exclusivo serviço CarDelivery - entrega do veículo na sua casa.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-primary-400 mb-2">2021</div>
                <p className="text-dark-400">Ano de Fundação</p>
              </div>
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-primary-400 mb-2">20+</div>
                <p className="text-dark-400">Anos de Experiência</p>
              </div>
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-primary-400 mb-2">500+</div>
                <p className="text-dark-400">Veículos Vendidos</p>
              </div>
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-primary-400 mb-2">100%</div>
                <p className="text-dark-400">Satisfação</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8">
              <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Missão</h3>
              <p className="text-dark-400 leading-relaxed">
                Proporcionar a melhor experiência na compra de veículos, com transparência, qualidade e condições acessíveis.
              </p>
            </div>

            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8">
              <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center mb-4">
                <Eye className="w-7 h-7 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Visão</h3>
              <p className="text-dark-400 leading-relaxed">
                Ser a principal referência em revenda de veículos seminovos na região, reconhecida pela excelência no atendimento.
              </p>
            </div>

            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8">
              <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-7 h-7 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Valores</h3>
              <p className="text-dark-400 leading-relaxed">
                Ética, transparência, respeito ao cliente, compromisso com a qualidade e busca constante pela satisfação.
              </p>
            </div>
          </motion.div>

          {/* Values Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Por que nos escolher?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-800 border border-dark-700 rounded-2xl p-6 text-center hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-dark-400 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-dark-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Nossa <span className="text-gradient">Equipe</span>
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Profissionais experientes prontos para ajudá-lo a encontrar o veículo ideal.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-800 border border-dark-700 rounded-2xl p-6 flex items-center gap-4"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-dark-900 font-bold text-xl">{member.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold">{member.name}</h3>
                  <p className="text-dark-400 text-sm">{member.role}</p>
                  <a
                    href={`https://wa.me/55${member.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    className="text-primary-400 text-sm hover:underline flex items-center gap-1 mt-1"
                  >
                    <Phone className="w-3 h-3" />
                    {member.phone}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-4">
              Pronto para encontrar seu próximo carro?
            </h2>
            <p className="text-dark-800 text-lg mb-8 max-w-2xl mx-auto">
              Visite nossa loja ou entre em contato. Estamos prontos para atendê-lo!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/carros">
                <Button size="lg" variant="secondary">
                  Ver veículos
                </Button>
              </Link>
              <Link href="/contato">
                <Button size="lg" className="bg-dark-900 hover:bg-dark-800 text-white">
                  Fale conosco
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

import { motion } from 'framer-motion'
import { Shield, Award, Users, Clock, Target, Heart } from 'lucide-react'

const values = [
  {
    icon: Shield,
    title: 'Transparencia',
    description: 'Trabalhamos com total honestidade e clareza em todas as negociacoes.',
  },
  {
    icon: Award,
    title: 'Qualidade',
    description: 'Todos os veiculos passam por rigorosa inspecao antes da venda.',
  },
  {
    icon: Users,
    title: 'Atendimento',
    description: 'Equipe treinada para oferecer a melhor experiencia ao cliente.',
  },
  {
    icon: Clock,
    title: 'Agilidade',
    description: 'Processos rapidos para que voce saia com seu carro o quanto antes.',
  },
  {
    icon: Target,
    title: 'Compromisso',
    description: 'Comprometidos em encontrar o veiculo ideal para cada cliente.',
  },
  {
    icon: Heart,
    title: 'Paixao',
    description: 'Amamos o que fazemos e isso reflete em nosso trabalho.',
  },
]

export function About() {
  return (
    <div className="py-8">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-dark-900 to-dark-950">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              Sobre a <span className="text-primary-500">Puma Multimarcas</span>
            </h1>
            <p className="text-lg text-dark-300">
              Ha mais de 10 anos no mercado, a Puma Multimarcas e referencia em veiculos seminovos
              em Matao e regiao. Nossa missao e oferecer os melhores carros com transparencia,
              qualidade e preco justo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* History */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold text-white mb-6">
                Nossa Historia
              </h2>
              <div className="space-y-4 text-dark-300">
                <p>
                  A Puma Multimarcas nasceu da paixao por automoveis e do desejo de
                  oferecer uma experiencia diferenciada na compra de veiculos seminovos.
                </p>
                <p>
                  Desde o inicio, nosso compromisso sempre foi com a qualidade e a
                  satisfacao dos nossos clientes. Cada veiculo que passa por nossa loja
                  e cuidadosamente inspecionado e revisado.
                </p>
                <p>
                  Hoje, somos reconhecidos na regiao de Matao pela seriedade e pelo
                  atendimento personalizado que oferecemos a cada cliente que nos procura.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden bg-dark-800">
                <img
                  src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800"
                  alt="Showroom"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary-500 text-white p-6 rounded-2xl">
                <p className="text-4xl font-bold">10+</p>
                <p className="text-sm">Anos de mercado</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-dark-900">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Nossos Valores
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Os principios que guiam nosso trabalho e garantem a satisfacao dos nossos clientes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-800 rounded-2xl p-6 border border-dark-700"
              >
                <div className="w-14 h-14 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-dark-400">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '1000+', label: 'Veiculos vendidos' },
              { value: '98%', label: 'Clientes satisfeitos' },
              { value: '10+', label: 'Anos de experiencia' },
              { value: '50+', label: 'Veiculos em estoque' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl lg:text-5xl font-bold text-primary-500 mb-2">
                  {stat.value}
                </p>
                <p className="text-dark-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

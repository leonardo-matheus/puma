'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Facebook, Instagram } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const schema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone é obrigatório'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
})

type FormData = z.infer<typeof schema>

const contactInfo = [
  {
    icon: Phone,
    title: 'Telefone',
    value: '(16) 2016-2615',
    link: 'tel:+551620162615',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'pumamultimarcas@yahoo.com',
    link: 'mailto:pumamultimarcas@yahoo.com',
  },
  {
    icon: MapPin,
    title: 'Endereço',
    value: 'Av. Rincão, 471 – Jardim Buscardi, Matão – SP, 15991-210',
    link: 'https://maps.google.com/?q=Av.+Rincão,+471+Jardim+Buscardi+Matão+SP',
  },
  {
    icon: Clock,
    title: 'Horário',
    value: 'Seg-Sex: 09h-18h | Sáb: 09h-13h',
    link: null,
  },
]

const sellers = [
  { name: 'Maylon', phone: '16992537016' },
  { name: 'Diego', phone: '16993176275' },
  { name: 'Vinicius', phone: '16996221011' },
]

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error('Error submitting contact:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
              Entre em <span className="text-gradient">Contato</span>
            </h1>
            <p className="text-xl text-dark-300 leading-relaxed">
              Estamos prontos para ajudá-lo a encontrar o veículo ideal. Fale conosco!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-2xl font-display font-bold text-white mb-8">
                Informações de Contato
              </h2>

              <div className="space-y-6 mb-10">
                {contactInfo.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">{item.title}</h3>
                      {item.link ? (
                        <a
                          href={item.link}
                          target={item.link.startsWith('http') ? '_blank' : undefined}
                          className="text-dark-400 hover:text-primary-400 transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-dark-400">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="mb-10">
                <h3 className="text-white font-medium mb-4">Redes Sociais</h3>
                <div className="flex gap-3">
                  <a
                    href="https://www.facebook.com/PumaMultimarcas"
                    target="_blank"
                    className="w-12 h-12 bg-dark-800 hover:bg-primary-500 rounded-xl flex items-center justify-center text-dark-400 hover:text-dark-900 transition-all duration-300"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/puma_multimarcas_"
                    target="_blank"
                    className="w-12 h-12 bg-dark-800 hover:bg-primary-500 rounded-xl flex items-center justify-center text-dark-400 hover:text-dark-900 transition-all duration-300"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* WhatsApp Sellers */}
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
                <h3 className="text-white font-medium mb-4">Fale pelo WhatsApp</h3>
                <div className="space-y-3">
                  {sellers.map((seller) => (
                    <a
                      key={seller.name}
                      href={`https://wa.me/55${seller.phone}`}
                      target="_blank"
                      className="flex items-center justify-between bg-dark-700 hover:bg-green-600 px-4 py-3 rounded-xl transition-all duration-300 group"
                    >
                      <span className="text-white">{seller.name}</span>
                      <Phone className="w-5 h-5 text-green-400 group-hover:text-white" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {isSubmitted ? (
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 text-center">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    Mensagem Enviada!
                  </h2>
                  <p className="text-dark-400 mb-6">
                    Obrigado pelo contato! Nossa equipe responderá em breve.
                  </p>
                  <Link href="/">
                    <Button variant="outline">Voltar ao início</Button>
                  </Link>
                </div>
              ) : (
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8">
                  <h2 className="text-2xl font-display font-bold text-white mb-2">
                    Envie uma Mensagem
                  </h2>
                  <p className="text-dark-400 mb-8">
                    Preencha o formulário e entraremos em contato.
                  </p>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                      label="Seu nome *"
                      placeholder="Nome completo"
                      error={errors.name?.message}
                      {...register('name')}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Email *"
                        type="email"
                        placeholder="seu@email.com"
                        error={errors.email?.message}
                        {...register('email')}
                      />
                      <Input
                        label="Telefone *"
                        placeholder="(00) 00000-0000"
                        error={errors.phone?.message}
                        {...register('phone')}
                      />
                    </div>
                    <Textarea
                      label="Mensagem *"
                      placeholder="Como podemos ajudá-lo?"
                      rows={5}
                      error={errors.message?.message}
                      {...register('message')}
                    />
                    <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Mensagem
                    </Button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

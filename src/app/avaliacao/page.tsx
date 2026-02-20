'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Car, CheckCircle, Phone } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { popularBrands } from '@/lib/utils'
import Link from 'next/link'

const schema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone é obrigatório'),
  brand: z.string().min(1, 'Selecione a marca'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  year: z.string().min(4, 'Ano é obrigatório'),
  mileage: z.string().min(1, 'Quilometragem é obrigatória'),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function EvaluationPage() {
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
      const res = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          year: parseInt(data.year),
          mileage: parseInt(data.mileage.replace(/\D/g, '')),
        }),
      })

      if (res.ok) {
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error('Error submitting evaluation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  }))

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Solicitação Enviada!
          </h2>
          <p className="text-dark-400 mb-8">
            Recebemos sua solicitação de avaliação. Nossa equipe entrará em contato em breve para dar continuidade ao processo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="outline">Voltar ao início</Button>
            </Link>
            <Link href="https://wa.me/5516992537016" target="_blank">
              <Button className="bg-green-600 hover:bg-green-500">
                <Phone className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
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
              Avalie seu <span className="text-gradient">Veículo</span>
            </h1>
            <p className="text-xl text-dark-300 leading-relaxed">
              Preencha o formulário abaixo e nossa equipe fará uma avaliação justa do seu veículo.
              Trabalhamos com os melhores valores de mercado!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-dark-800 border border-dark-700 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-xl">Dados do Veículo</h2>
                  <p className="text-dark-400 text-sm">Informe os dados para avaliação</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Seu nome *"
                    placeholder="Nome completo"
                    error={errors.name?.message}
                    {...register('name')}
                  />
                  <Input
                    label="Telefone *"
                    placeholder="(00) 00000-0000"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                </div>

                <Input
                  label="Email *"
                  type="email"
                  placeholder="seu@email.com"
                  error={errors.email?.message}
                  {...register('email')}
                />

                {/* Vehicle Info */}
                <div className="pt-6 border-t border-dark-700">
                  <h3 className="text-white font-medium mb-4">Informações do Veículo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Marca *"
                      placeholder="Selecione a marca"
                      options={popularBrands.map(b => ({ value: b, label: b }))}
                      error={errors.brand?.message}
                      {...register('brand')}
                    />
                    <Input
                      label="Modelo *"
                      placeholder="Ex: Civic LXS"
                      error={errors.model?.message}
                      {...register('model')}
                    />
                    <Select
                      label="Ano *"
                      placeholder="Selecione o ano"
                      options={years}
                      error={errors.year?.message}
                      {...register('year')}
                    />
                    <Input
                      label="Quilometragem *"
                      placeholder="Ex: 50000"
                      type="number"
                      error={errors.mileage?.message}
                      {...register('mileage')}
                    />
                  </div>
                </div>

                <Textarea
                  label="Observações"
                  placeholder="Descreva o estado do veículo, opcionais, etc."
                  rows={4}
                  {...register('description')}
                />

                <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                  Solicitar Avaliação
                </Button>

                <p className="text-dark-500 text-sm text-center">
                  Ao enviar, você concorda em ser contatado pela nossa equipe.
                </p>
              </form>
            </motion.div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {[
                { title: 'Avaliação Gratuita', desc: 'Sem compromisso' },
                { title: 'Resposta Rápida', desc: 'Em até 24 horas' },
                { title: 'Valor Justo', desc: 'Preço de mercado' },
              ].map((item) => (
                <div key={item.title} className="bg-dark-800 border border-dark-700 rounded-xl p-4 text-center">
                  <h4 className="text-white font-medium">{item.title}</h4>
                  <p className="text-dark-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

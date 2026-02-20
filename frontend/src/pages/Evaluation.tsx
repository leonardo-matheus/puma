import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Car, CheckCircle, Send } from 'lucide-react'
import { Input, Textarea, Select, Button, Card, CardContent } from '@/components/ui'
import { evaluationService, type EvaluationFormData } from '@/services/evaluationService'

const brands = [
  'Chevrolet', 'Fiat', 'Ford', 'Honda', 'Hyundai', 'Jeep', 'Nissan',
  'Renault', 'Toyota', 'Volkswagen', 'Outros'
]

const evaluationSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email invalido'),
  phone: z.string().min(10, 'Telefone invalido'),
  brand: z.string().min(1, 'Selecione a marca'),
  model: z.string().min(1, 'Informe o modelo'),
  year: z.coerce.number().min(1990, 'Ano invalido').max(new Date().getFullYear() + 1, 'Ano invalido'),
  mileage: z.coerce.number().min(0, 'Quilometragem invalida'),
  description: z.string().optional(),
})

type EvaluationFormValues = z.infer<typeof evaluationSchema>

export function Evaluation() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationSchema),
  })

  const onSubmit = async (data: EvaluationFormValues) => {
    setIsLoading(true)
    try {
      await evaluationService.create(data as EvaluationFormData)
      setIsSubmitted(true)
      reset()
    } catch (error) {
      console.error('Erro ao enviar avaliacao:', error)
      alert('Erro ao enviar solicitacao. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const brandOptions = [
    { value: '', label: 'Selecione a marca' },
    ...brands.map(b => ({ value: b, label: b }))
  ]

  const currentYear = new Date().getFullYear()
  const yearOptions = [
    { value: '', label: 'Selecione o ano' },
    ...Array.from({ length: 35 }, (_, i) => ({
      value: String(currentYear - i),
      label: String(currentYear - i),
    })),
  ]

  return (
    <div className="py-8">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Venda seu <span className="text-primary-500">Veiculo</span>
          </h1>
          <p className="text-dark-400 max-w-2xl mx-auto">
            Preencha o formulario abaixo com as informacoes do seu veiculo
            e nossa equipe entrara em contato para fazer uma avaliacao.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card>
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Car className="w-7 h-7 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Por que vender conosco?
                </h3>
                <ul className="space-y-3">
                  {[
                    'Avaliacao rapida e justa',
                    'Pagamento a vista ou parcelado',
                    'Toda documentacao por nossa conta',
                    'Processo simples e transparente',
                    'Anos de experiencia no mercado',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-dark-300">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Como funciona?
                </h3>
                <ol className="space-y-4">
                  {[
                    'Preencha o formulario com os dados do veiculo',
                    'Nossa equipe entrara em contato',
                    'Agendamos uma visita para avaliacao',
                    'Receba uma proposta justa',
                    'Fechando negocio, cuidamos de tudo!',
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-dark-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardContent className="p-6 lg:p-8">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Solicitacao enviada!
                    </h3>
                    <p className="text-dark-400 mb-6">
                      Recebemos sua solicitacao de avaliacao. Nossa equipe entrara
                      em contato em ate 24 horas uteis.
                    </p>
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                      Enviar outra avaliacao
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Seus dados
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Nome"
                        placeholder="Seu nome completo"
                        error={errors.name?.message}
                        {...register('name')}
                      />
                      <Input
                        label="E-mail"
                        type="email"
                        placeholder="seu@email.com"
                        error={errors.email?.message}
                        {...register('email')}
                      />
                    </div>
                    <Input
                      label="Telefone"
                      placeholder="(00) 00000-0000"
                      error={errors.phone?.message}
                      {...register('phone')}
                    />

                    <hr className="border-dark-700" />

                    <h3 className="text-lg font-semibold text-white mb-4">
                      Dados do veiculo
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Select
                        label="Marca"
                        options={brandOptions}
                        error={errors.brand?.message}
                        {...register('brand')}
                      />
                      <Input
                        label="Modelo"
                        placeholder="Ex: Onix, Civic, Gol..."
                        error={errors.model?.message}
                        {...register('model')}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Select
                        label="Ano"
                        options={yearOptions}
                        error={errors.year?.message}
                        {...register('year')}
                      />
                      <Input
                        label="Quilometragem"
                        type="number"
                        placeholder="Ex: 50000"
                        error={errors.mileage?.message}
                        {...register('mileage')}
                      />
                    </div>
                    <Textarea
                      label="Observacoes (opcional)"
                      placeholder="Informacoes adicionais sobre o veiculo..."
                      rows={4}
                      {...register('description')}
                    />

                    <Button type="submit" size="lg" isLoading={isLoading}>
                      <Send className="w-5 h-5 mr-2" />
                      Solicitar avaliacao
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

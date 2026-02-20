import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Save, Building2, Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react'
import { Input, Textarea, Button, Card, CardContent, CardHeader } from '@/components/ui'
import { settingsService } from '@/services/settingsService'
import type { Settings } from '@/types'

export function AdminSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const { register, handleSubmit, reset } = useForm<Settings>()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await settingsService.get()
      reset(data)
    } catch (error) {
      console.error('Erro ao carregar configuracoes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: Settings) => {
    setIsSaving(true)
    try {
      await settingsService.update(data)
      alert('Configuracoes salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar configuracoes:', error)
      alert('Erro ao salvar configuracoes')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-dark-800 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Configuracoes</h1>
          <p className="text-dark-400 mt-1">Informacoes da empresa</p>
        </div>
        <Button type="submit" isLoading={isSaving}>
          <Save className="w-5 h-5 mr-2" />
          Salvar
        </Button>
      </div>

      <div className="space-y-6">
        {/* Informacoes Gerais */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary-500" />
              Informacoes Gerais
            </h2>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Input
              label="Nome da Empresa"
              {...register('companyName')}
            />
            <Textarea
              label="Descricao"
              rows={3}
              {...register('description')}
            />
          </CardContent>
        </Card>

        {/* Contato */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary-500" />
              Contato
            </h2>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Telefone"
                icon={<Phone className="w-4 h-4" />}
                {...register('phone')}
              />
              <Input
                label="WhatsApp"
                icon={<Phone className="w-4 h-4" />}
                {...register('whatsapp')}
              />
            </div>
            <Input
              label="E-mail"
              type="email"
              icon={<Mail className="w-4 h-4" />}
              {...register('email')}
            />
          </CardContent>
        </Card>

        {/* Endereco */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-500" />
              Endereco
            </h2>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Textarea
              label="Endereco Completo"
              rows={2}
              {...register('address')}
            />
          </CardContent>
        </Card>

        {/* Horario de Funcionamento */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-500" />
              Horario de Funcionamento
            </h2>
          </CardHeader>
          <CardContent className="p-6">
            <Input
              label="Horarios"
              placeholder="Segunda a Sexta: 09:00 as 18:00 | Sabado: 09:00 as 13:00"
              {...register('workingHours')}
            />
          </CardContent>
        </Card>

        {/* Redes Sociais */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Instagram className="w-5 h-5 text-primary-500" />
              Redes Sociais
            </h2>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Input
              label="Facebook"
              placeholder="https://facebook.com/..."
              icon={<Facebook className="w-4 h-4" />}
              {...register('facebook')}
            />
            <Input
              label="Instagram"
              placeholder="https://instagram.com/..."
              icon={<Instagram className="w-4 h-4" />}
              {...register('instagram')}
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-end">
        <Button type="submit" size="lg" isLoading={isSaving}>
          <Save className="w-5 h-5 mr-2" />
          Salvar Configuracoes
        </Button>
      </div>
    </form>
  )
}

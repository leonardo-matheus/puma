import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, ArrowLeft, Upload, X, Plus } from 'lucide-react'
import { Input, Select, Textarea, Button, Card, CardContent, CardHeader } from '@/components/ui'
import { vehicleService } from '@/services/vehicleService'

const vehicleSchema = z.object({
  brand: z.string().min(1, 'Marca obrigatoria'),
  model: z.string().min(1, 'Modelo obrigatorio'),
  version: z.string().optional(),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  yearModel: z.coerce.number().min(1900).max(new Date().getFullYear() + 1).optional(),
  price: z.coerce.number().min(0, 'Preco obrigatorio'),
  mileage: z.coerce.number().min(0),
  fuel: z.string().min(1, 'Combustivel obrigatorio'),
  transmission: z.string().min(1, 'Cambio obrigatorio'),
  bodyType: z.string().optional(),
  color: z.string().optional(),
  doors: z.coerce.number().optional(),
  plate: z.string().optional(),
  description: z.string().optional(),
  condition: z.string().default('used'),
  featured: z.boolean().default(false),
})

type VehicleFormValues = z.infer<typeof vehicleSchema>

const fuelOptions = [
  { value: 'Flex', label: 'Flex' },
  { value: 'Gasolina', label: 'Gasolina' },
  { value: 'Etanol', label: 'Etanol' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Eletrico', label: 'Eletrico' },
  { value: 'Hibrido', label: 'Hibrido' },
]

const transmissionOptions = [
  { value: 'Manual', label: 'Manual' },
  { value: 'Automatico', label: 'Automatico' },
  { value: 'Automatizado', label: 'Automatizado' },
  { value: 'CVT', label: 'CVT' },
]

const conditionOptions = [
  { value: 'used', label: 'Usado' },
  { value: 'new', label: 'Novo' },
]

export function AdminVehicleForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(!!id)
  const [isSaving, setIsSaving] = useState(false)
  const [images, setImages] = useState<{ id: string; url: string }[]>([])
  const [optionals, setOptionals] = useState<string[]>([])
  const [newOptional, setNewOptional] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      condition: 'used',
      featured: false,
    },
  })

  useEffect(() => {
    if (id) {
      vehicleService.getById(id)
        .then((vehicle) => {
          reset({
            brand: vehicle.brand,
            model: vehicle.model,
            version: vehicle.version || undefined,
            year: vehicle.year,
            yearModel: vehicle.yearModel || vehicle.year,
            price: vehicle.price,
            mileage: vehicle.mileage,
            fuel: vehicle.fuel,
            transmission: vehicle.transmission,
            bodyType: vehicle.bodyType || undefined,
            color: vehicle.color || undefined,
            doors: vehicle.doors || undefined,
            plate: vehicle.plate || undefined,
            description: vehicle.description || undefined,
            condition: vehicle.condition,
            featured: vehicle.featured,
          })
          setImages(vehicle.images || [])
          setOptionals(vehicle.optionals?.map(o => o.name) || [])
        })
        .catch(console.error)
        .finally(() => setIsLoading(false))
    }
  }, [id, reset])

  const onSubmit = async (data: VehicleFormValues) => {
    setIsSaving(true)
    try {
      const payload = {
        ...data,
        optionals: optionals.map(name => ({ name })),
      }

      if (id) {
        await vehicleService.update(id, payload)
      } else {
        const newVehicle = await vehicleService.create(payload)
        if (fileInputRef.current?.files?.length) {
          await vehicleService.uploadImages(newVehicle.id, fileInputRef.current.files)
        }
      }

      alert('Veiculo salvo com sucesso!')
      navigate('/admin/veiculos')
    } catch (error) {
      console.error('Erro ao salvar veiculo:', error)
      alert('Erro ao salvar veiculo')
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!id || !e.target.files?.length) return

    try {
      const result = await vehicleService.uploadImages(id, e.target.files)
      setImages([...images, ...result.images])
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      alert('Erro ao fazer upload das imagens')
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!id) return

    try {
      await vehicleService.deleteImage(id, imageId)
      setImages(images.filter(img => img.id !== imageId))
    } catch (error) {
      console.error('Erro ao excluir imagem:', error)
    }
  }

  const handleAddOptional = () => {
    if (newOptional.trim() && !optionals.includes(newOptional.trim())) {
      setOptionals([...optionals, newOptional.trim()])
      setNewOptional('')
    }
  }

  const handleRemoveOptional = (index: number) => {
    setOptionals(optionals.filter((_, i) => i !== index))
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
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/veiculos')}
            className="p-2 text-dark-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">
              {id ? 'Editar Veiculo' : 'Novo Veiculo'}
            </h1>
          </div>
        </div>
        <Button type="submit" isLoading={isSaving}>
          <Save className="w-5 h-5 mr-2" />
          Salvar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Informacoes Basicas */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">Informacoes Basicas</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Marca" error={errors.brand?.message} {...register('brand')} />
                <Input label="Modelo" error={errors.model?.message} {...register('model')} />
              </div>
              <Input label="Versao" {...register('version')} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Ano Fabricacao" type="number" error={errors.year?.message} {...register('year')} />
                <Input label="Ano Modelo" type="number" {...register('yearModel')} />
              </div>
              <Input label="Preco (R$)" type="number" step="0.01" error={errors.price?.message} {...register('price')} />
            </CardContent>
          </Card>

          {/* Especificacoes */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">Especificacoes</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Quilometragem" type="number" {...register('mileage')} />
                <Select label="Combustivel" options={fuelOptions} error={errors.fuel?.message} {...register('fuel')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Cambio" options={transmissionOptions} error={errors.transmission?.message} {...register('transmission')} />
                <Input label="Cor" {...register('color')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Portas" type="number" {...register('doors')} />
                <Input label="Placa (opcional)" {...register('plate')} />
              </div>
              <Textarea label="Descricao" rows={4} {...register('description')} />
            </CardContent>
          </Card>

          {/* Opcionais */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">Opcionais</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Adicionar opcional..."
                  value={newOptional}
                  onChange={(e) => setNewOptional(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOptional())}
                />
                <Button type="button" onClick={handleAddOptional}>
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {optionals.map((opt, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-dark-700 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {opt}
                    <button type="button" onClick={() => handleRemoveOptional(index)}>
                      <X className="w-4 h-4 text-dark-400 hover:text-red-500" />
                    </button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">Status</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Select label="Condicao" options={conditionOptions} {...register('condition')} />
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded" {...register('featured')} />
                <span className="text-white">Destacar veiculo</span>
              </label>
            </CardContent>
          </Card>

          {/* Imagens */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">Imagens</h2>
            </CardHeader>
            <CardContent className="p-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />

              <div className="grid grid-cols-2 gap-3">
                {images.map((image) => (
                  <div key={image.id} className="relative aspect-video rounded-lg overflow-hidden group">
                    <img src={image.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video border-2 border-dashed border-dark-600 rounded-lg flex flex-col items-center justify-center text-dark-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
                >
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-sm">Adicionar</span>
                </button>
              </div>

              {!id && (
                <p className="text-xs text-dark-500 mt-3">
                  Salve o veiculo primeiro para adicionar imagens
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}

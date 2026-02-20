'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Plus, X, Upload, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { popularBrands, fuelTypes, transmissionTypes, bodyTypes, colorOptions } from '@/lib/utils'

const schema = z.object({
  brand: z.string().min(1, 'Marca é obrigatória'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  version: z.string().optional(),
  year: z.string().min(4, 'Ano é obrigatório'),
  price: z.string().min(1, 'Preço é obrigatório'),
  mileage: z.string().min(1, 'Quilometragem é obrigatória'),
  fuel: z.string().min(1, 'Combustível é obrigatório'),
  transmission: z.string().min(1, 'Câmbio é obrigatório'),
  bodyType: z.string().optional(),
  color: z.string().optional(),
  doors: z.string().optional(),
  plate: z.string().optional(),
  description: z.string().optional(),
  featured: z.boolean().optional(),
  sold: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

export default function EditVehiclePage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [optionals, setOptionals] = useState<string[]>([])
  const [newOptional, setNewOptional] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    fetchVehicle()
  }, [id])

  const fetchVehicle = async () => {
    try {
      const res = await fetch(`/api/vehicles/${id}`)
      if (res.ok) {
        const vehicle = await res.json()
        setValue('brand', vehicle.brand)
        setValue('model', vehicle.model)
        setValue('version', vehicle.version || '')
        setValue('year', String(vehicle.year))
        setValue('price', String(vehicle.price))
        setValue('mileage', String(vehicle.mileage))
        setValue('fuel', vehicle.fuel)
        setValue('transmission', vehicle.transmission)
        setValue('bodyType', vehicle.bodyType || '')
        setValue('color', vehicle.color || '')
        setValue('doors', vehicle.doors ? String(vehicle.doors) : '')
        setValue('plate', vehicle.plate || '')
        setValue('description', vehicle.description || '')
        setValue('featured', vehicle.featured)
        setValue('sold', vehicle.sold)
        setImages(vehicle.images?.map((img: any) => img.url) || [])
        setOptionals(vehicle.optionals?.map((opt: any) => opt.name) || [])
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error)
    } finally {
      setLoading(false)
    }
  }

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()])
      setNewImageUrl('')
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const addOptional = () => {
    if (newOptional.trim()) {
      setOptionals([...optionals, newOptional.trim()])
      setNewOptional('')
    }
  }

  const removeOptional = (index: number) => {
    setOptionals(optionals.filter((_, i) => i !== index))
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este veículo?')) return

    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/admin/veiculos')
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          year: parseInt(data.year),
          price: typeof data.price === 'string' && data.price.includes(',')
            ? parseFloat(data.price.replace(/\D/g, '')) / 100
            : parseFloat(data.price),
          mileage: parseInt(String(data.mileage).replace(/\D/g, '')),
          doors: data.doors ? parseInt(data.doors) : null,
          images,
          optionals,
        }),
      })

      if (res.ok) {
        router.push('/admin/veiculos')
      }
    } catch (error) {
      console.error('Error updating vehicle:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/veiculos">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Editar Veículo</h1>
            <p className="text-dark-400">Atualize as informações do veículo</p>
          </div>
        </div>
        <Button variant="danger" onClick={handleDelete}>
          <Trash2 className="w-5 h-5 mr-2" />
          Excluir
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">Informações Básicas</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Marca *"
                    placeholder="Selecione"
                    options={popularBrands.map(b => ({ value: b, label: b }))}
                    error={errors.brand?.message}
                    {...register('brand')}
                  />
                  <Input
                    label="Modelo *"
                    placeholder="Ex: Civic"
                    error={errors.model?.message}
                    {...register('model')}
                  />
                  <Input
                    label="Versão"
                    placeholder="Ex: LXS 1.8"
                    {...register('version')}
                  />
                  <Select
                    label="Ano *"
                    placeholder="Selecione"
                    options={years}
                    error={errors.year?.message}
                    {...register('year')}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">Especificações</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Combustível *"
                    placeholder="Selecione"
                    options={fuelTypes}
                    error={errors.fuel?.message}
                    {...register('fuel')}
                  />
                  <Select
                    label="Câmbio *"
                    placeholder="Selecione"
                    options={transmissionTypes}
                    error={errors.transmission?.message}
                    {...register('transmission')}
                  />
                  <Select
                    label="Carroceria"
                    placeholder="Selecione"
                    options={bodyTypes}
                    {...register('bodyType')}
                  />
                  <Select
                    label="Cor"
                    placeholder="Selecione"
                    options={colorOptions.map(c => ({ value: c, label: c }))}
                    {...register('color')}
                  />
                  <Select
                    label="Portas"
                    placeholder="Selecione"
                    options={[
                      { value: '2', label: '2 portas' },
                      { value: '4', label: '4 portas' },
                    ]}
                    {...register('doors')}
                  />
                  <Input
                    label="Placa"
                    placeholder="ABC-1234"
                    {...register('plate')}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">Imagens</h2>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="URL da imagem"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                  />
                  <Button type="button" onClick={addImage}>
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-dark-700">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-dark-600 rounded-lg p-8 text-center">
                    <Upload className="w-10 h-10 text-dark-500 mx-auto mb-2" />
                    <p className="text-dark-400">Adicione URLs das imagens do veículo</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">Opcionais</h2>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Ex: Ar condicionado"
                    value={newOptional}
                    onChange={(e) => setNewOptional(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOptional())}
                  />
                  <Button type="button" onClick={addOptional}>
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                {optionals.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {optionals.map((opt, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-dark-700 px-3 py-1 rounded-full text-sm text-white"
                      >
                        {opt}
                        <button type="button" onClick={() => removeOptional(index)}>
                          <X className="w-4 h-4 text-dark-400 hover:text-white" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">Descrição</h2>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Descreva o veículo..."
                  rows={6}
                  {...register('description')}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">Preço e KM</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Preço *"
                  placeholder="R$ 0,00"
                  error={errors.price?.message}
                  {...register('price')}
                />
                <Input
                  label="Quilometragem *"
                  placeholder="0"
                  type="number"
                  error={errors.mileage?.message}
                  {...register('mileage')}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">Status</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded bg-dark-700 border-dark-600 text-primary-500 focus:ring-primary-500"
                    {...register('featured')}
                  />
                  <span className="text-white">Destacar veículo</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded bg-dark-700 border-dark-600 text-red-500 focus:ring-red-500"
                    {...register('sold')}
                  />
                  <span className="text-white">Marcar como vendido</span>
                </label>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Link href="/admin/veiculos" className="flex-1">
                <Button variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" className="flex-1" isLoading={isLoading}>
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

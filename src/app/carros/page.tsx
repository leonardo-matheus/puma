'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X, Car } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { VehicleCard } from '@/components/VehicleCard'
import { popularBrands, fuelTypes, transmissionTypes } from '@/lib/utils'
import type { Vehicle } from '@/types'

export default function VehiclesPage() {
  const searchParams = useSearchParams()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [brand, setBrand] = useState('')
  const [fuel, setFuel] = useState('')
  const [transmission, setTransmission] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minYear, setMinYear] = useState('')
  const [maxYear, setMaxYear] = useState('')

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (brand) params.append('brand', brand)
      if (fuel) params.append('fuel', fuel)
      if (transmission) params.append('transmission', transmission)
      if (minPrice) params.append('minPrice', minPrice)
      if (maxPrice) params.append('maxPrice', maxPrice)
      if (minYear) params.append('minYear', minYear)
      if (maxYear) params.append('maxYear', maxYear)

      const res = await fetch(`/api/vehicles?${params.toString()}`)
      const data = await res.json()
      setVehicles(data.vehicles || [])
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }, [search, brand, fuel, transmission, minPrice, maxPrice, minYear, maxYear])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  const clearFilters = () => {
    setSearch('')
    setBrand('')
    setFuel('')
    setTransmission('')
    setMinPrice('')
    setMaxPrice('')
    setMinYear('')
    setMaxYear('')
  }

  const hasFilters = brand || fuel || transmission || minPrice || maxPrice || minYear || maxYear

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  }))

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-700">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Nossos <span className="text-gradient">Veículos</span>
            </h1>
            <p className="text-dark-400 max-w-2xl">
              Encontre o carro ideal para você entre nossa seleção de veículos seminovos de qualidade.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-semibold text-lg">Filtros</h2>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-primary-400 text-sm hover:underline"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <Input
                  label="Buscar"
                  placeholder="Marca, modelo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />

                <Select
                  label="Marca"
                  placeholder="Todas as marcas"
                  options={popularBrands.map((b) => ({ value: b, label: b }))}
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />

                <Select
                  label="Combustível"
                  placeholder="Todos"
                  options={fuelTypes}
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value)}
                />

                <Select
                  label="Câmbio"
                  placeholder="Todos"
                  options={transmissionTypes}
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Select
                    label="Ano Mín."
                    placeholder="De"
                    options={years}
                    value={minYear}
                    onChange={(e) => setMinYear(e.target.value)}
                  />
                  <Select
                    label="Ano Máx."
                    placeholder="Até"
                    options={years}
                    value={maxYear}
                    onChange={(e) => setMaxYear(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Preço Mín."
                    placeholder="R$ Min"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <Input
                    label="Preço Máx."
                    placeholder="R$ Max"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6 flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Buscar veículos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(true)}
                className="flex-shrink-0"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </Button>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-dark-400">
                {loading ? 'Carregando...' : `${vehicles.length} veículos encontrados`}
              </p>
            </div>

            {/* Vehicle Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-dark-800 rounded-2xl animate-pulse">
                    <div className="aspect-[3/4] bg-dark-700 rounded-t-2xl" />
                    <div className="p-5 space-y-3">
                      <div className="h-6 bg-dark-700 rounded w-3/4" />
                      <div className="h-4 bg-dark-700 rounded w-1/2" />
                      <div className="h-4 bg-dark-700 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : vehicles.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {vehicles.map((vehicle, index) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-dark-800 rounded-2xl">
                <Car className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum veículo encontrado</h3>
                <p className="text-dark-400 mb-4">Tente ajustar os filtros de busca.</p>
                {hasFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute right-0 top-0 h-full w-80 bg-dark-900 border-l border-dark-700 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold text-lg">Filtros</h2>
              <button onClick={() => setShowFilters(false)} className="text-dark-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <Select
                label="Marca"
                placeholder="Todas as marcas"
                options={popularBrands.map((b) => ({ value: b, label: b }))}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />

              <Select
                label="Combustível"
                placeholder="Todos"
                options={fuelTypes}
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
              />

              <Select
                label="Câmbio"
                placeholder="Todos"
                options={transmissionTypes}
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Ano Mín."
                  placeholder="De"
                  options={years}
                  value={minYear}
                  onChange={(e) => setMinYear(e.target.value)}
                />
                <Select
                  label="Ano Máx."
                  placeholder="Até"
                  options={years}
                  value={maxYear}
                  onChange={(e) => setMaxYear(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Preço Mín."
                  placeholder="R$ Min"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <Input
                  label="Preço Máx."
                  placeholder="R$ Max"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              <div className="pt-4 space-y-3">
                <Button className="w-full" onClick={() => setShowFilters(false)}>
                  Aplicar filtros
                </Button>
                {hasFilters && (
                  <Button variant="ghost" className="w-full" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

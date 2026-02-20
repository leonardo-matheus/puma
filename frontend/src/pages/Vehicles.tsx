import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react'
import { VehicleCard } from '@/components/VehicleCard'
import { Input, Select, Button } from '@/components/ui'
import { vehicleService } from '@/services/vehicleService'
import type { Vehicle, FilterOptions } from '@/types'

const fuelOptions = [
  { value: '', label: 'Todos' },
  { value: 'Flex', label: 'Flex' },
  { value: 'Gasolina', label: 'Gasolina' },
  { value: 'Etanol', label: 'Etanol' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Eletrico', label: 'Eletrico' },
  { value: 'Hibrido', label: 'Hibrido' },
]

const transmissionOptions = [
  { value: '', label: 'Todas' },
  { value: 'Manual', label: 'Manual' },
  { value: 'Automatico', label: 'Automatico' },
  { value: 'Automatizado', label: 'Automatizado' },
  { value: 'CVT', label: 'CVT' },
]

const sortOptions = [
  { value: 'recent', label: 'Mais recentes' },
  { value: 'price_asc', label: 'Menor preco' },
  { value: 'price_desc', label: 'Maior preco' },
  { value: 'year_desc', label: 'Mais novos' },
  { value: 'mileage_asc', label: 'Menor km' },
]

export function Vehicles() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState<FilterOptions>({
    brand: searchParams.get('brand') || '',
    search: searchParams.get('search') || '',
    fuel: searchParams.get('fuel') || '',
    transmission: searchParams.get('transmission') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    minYear: searchParams.get('minYear') ? Number(searchParams.get('minYear')) : undefined,
    maxYear: searchParams.get('maxYear') ? Number(searchParams.get('maxYear')) : undefined,
  })

  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    vehicleService.getBrands()
      .then(setBrands)
      .catch(console.error)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    vehicleService.getAll(filters)
      .then(setVehicles)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [filters])

  const sortedVehicles = useMemo(() => {
    const sorted = [...vehicles]
    switch (sortBy) {
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price)
      case 'year_desc':
        return sorted.sort((a, b) => b.year - a.year)
      case 'mileage_asc':
        return sorted.sort((a, b) => a.mileage - b.mileage)
      default:
        return sorted
    }
  }, [vehicles, sortBy])

  const handleFilterChange = (key: keyof FilterOptions, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value || undefined }
    setFilters(newFilters)

    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, String(v))
    })
    setSearchParams(params)
  }

  const clearFilters = () => {
    setFilters({})
    setSearchParams({})
  }

  const hasActiveFilters = Object.values(filters).some(v => v)

  const brandOptions = [
    { value: '', label: 'Todas as marcas' },
    ...brands.map(b => ({ value: b, label: b })),
  ]

  const currentYear = new Date().getFullYear()
  const yearOptions = [
    { value: '', label: 'Qualquer' },
    ...Array.from({ length: 30 }, (_, i) => ({
      value: String(currentYear - i),
      label: String(currentYear - i),
    })),
  ]

  return (
    <div className="py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white">
            Nossos <span className="text-primary-500">Veiculos</span>
          </h1>
          <p className="text-dark-400 mt-2">
            {isLoading ? 'Carregando...' : `${vehicles.length} veiculos encontrados`}
          </p>
        </div>

        {/* Search and Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Buscar por marca, modelo..."
              icon={<Search className="w-5 h-5" />}
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-48"
            />
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <motion.aside
            initial={false}
            animate={{ width: showFilters || window.innerWidth >= 1024 ? 'auto' : 0 }}
            className={`hidden lg:block w-64 flex-shrink-0 ${showFilters ? '!block fixed inset-0 z-50 bg-dark-950 p-4 overflow-auto lg:relative lg:p-0 lg:bg-transparent' : ''}`}
          >
            <div className="bg-dark-800 rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-500 hover:text-primary-400"
                  >
                    Limpar
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-dark-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <Select
                  label="Marca"
                  options={brandOptions}
                  value={filters.brand || ''}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                />

                <Select
                  label="Combustivel"
                  options={fuelOptions}
                  value={filters.fuel || ''}
                  onChange={(e) => handleFilterChange('fuel', e.target.value)}
                />

                <Select
                  label="Cambio"
                  options={transmissionOptions}
                  value={filters.transmission || ''}
                  onChange={(e) => handleFilterChange('transmission', e.target.value)}
                />

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Ano</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      options={yearOptions}
                      value={filters.minYear?.toString() || ''}
                      onChange={(e) => handleFilterChange('minYear', e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="De"
                    />
                    <Select
                      options={yearOptions}
                      value={filters.maxYear?.toString() || ''}
                      onChange={(e) => handleFilterChange('maxYear', e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Ate"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Preco</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice || ''}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Vehicle Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-dark-800 rounded-2xl h-96 animate-pulse"
                  />
                ))}
              </div>
            ) : sortedVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Car className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Nenhum veiculo encontrado
                </h3>
                <p className="text-dark-400 mb-4">
                  Tente ajustar os filtros de busca
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

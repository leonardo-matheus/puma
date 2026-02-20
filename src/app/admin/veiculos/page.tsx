'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Eye, Star, Car } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatNumber } from '@/lib/utils'
import type { Vehicle } from '@/types'

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/vehicles?limit=100')
      const data = await res.json()
      setVehicles(data.vehicles || [])
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este veículo?')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setVehicles((prev) => prev.filter((v) => v.id !== id))
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    } finally {
      setDeleting(null)
    }
  }

  const filteredVehicles = vehicles.filter((v) =>
    `${v.brand} ${v.model} ${v.year}`.toLowerCase().includes(search.toLowerCase())
  )

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Veículos</h1>
          <p className="text-dark-400">{vehicles.length} veículos cadastrados</p>
        </div>
        <Link href="/admin/veiculos/novo">
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            Novo Veículo
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Buscar veículos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-5 h-5" />}
        />
      </div>

      {/* Table */}
      {filteredVehicles.length > 0 ? (
        <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left px-6 py-4 text-dark-400 font-medium">Veículo</th>
                  <th className="text-left px-6 py-4 text-dark-400 font-medium hidden md:table-cell">Ano</th>
                  <th className="text-left px-6 py-4 text-dark-400 font-medium hidden lg:table-cell">KM</th>
                  <th className="text-left px-6 py-4 text-dark-400 font-medium">Preço</th>
                  <th className="text-left px-6 py-4 text-dark-400 font-medium hidden sm:table-cell">Status</th>
                  <th className="text-right px-6 py-4 text-dark-400 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle, index) => (
                  <motion.tr
                    key={vehicle.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-dark-700/50 last:border-0 hover:bg-dark-700/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 bg-dark-700 rounded-lg overflow-hidden flex-shrink-0">
                          {vehicle.images?.[0] ? (
                            <img
                              src={vehicle.images[0].url}
                              alt={vehicle.model}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car className="w-6 h-6 text-dark-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {vehicle.brand} {vehicle.model}
                          </p>
                          <p className="text-dark-400 text-sm">{vehicle.fuel} • {vehicle.transmission}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white hidden md:table-cell">{vehicle.year}</td>
                    <td className="px-6 py-4 text-dark-300 hidden lg:table-cell">
                      {formatNumber(vehicle.mileage)} km
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-primary-400 font-semibold">
                        {formatCurrency(vehicle.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        {vehicle.featured && (
                          <Badge variant="primary">
                            <Star className="w-3 h-3 mr-1" />
                            Destaque
                          </Badge>
                        )}
                        {vehicle.sold ? (
                          <Badge variant="danger">Vendido</Badge>
                        ) : (
                          <Badge variant="success">Disponível</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/carros/${vehicle.id}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/veiculos/${vehicle.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(vehicle.id)}
                          disabled={deleting === vehicle.id}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-12 text-center">
          <Car className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {search ? 'Nenhum veículo encontrado' : 'Nenhum veículo cadastrado'}
          </h3>
          <p className="text-dark-400 mb-6">
            {search ? 'Tente buscar com outros termos.' : 'Comece adicionando seu primeiro veículo.'}
          </p>
          {!search && (
            <Link href="/admin/veiculos/novo">
              <Button>
                <Plus className="w-5 h-5 mr-2" />
                Novo Veículo
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

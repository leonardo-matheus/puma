import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, Eye, Star, StarOff } from 'lucide-react'
import { Input, Button, Badge, Card, CardContent } from '@/components/ui'
import { vehicleService } from '@/services/vehicleService'
import { formatCurrency, formatNumber } from '@/lib/utils'
import type { Vehicle } from '@/types'

export function AdminVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadVehicles()
  }, [])

  const loadVehicles = async () => {
    setIsLoading(true)
    try {
      const data = await vehicleService.getAll({})
      setVehicles(data)
    } catch (error) {
      console.error('Erro ao carregar veiculos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este veiculo?')) return

    try {
      await vehicleService.delete(id)
      setVehicles(vehicles.filter(v => v.id !== id))
    } catch (error) {
      console.error('Erro ao excluir veiculo:', error)
      alert('Erro ao excluir veiculo')
    }
  }

  const handleToggleFeatured = async (vehicle: Vehicle) => {
    try {
      await vehicleService.update(vehicle.id, { featured: !vehicle.featured })
      setVehicles(vehicles.map(v =>
        v.id === vehicle.id ? { ...v, featured: !v.featured } : v
      ))
    } catch (error) {
      console.error('Erro ao atualizar veiculo:', error)
    }
  }

  const handleToggleSold = async (vehicle: Vehicle) => {
    try {
      await vehicleService.update(vehicle.id, { sold: !vehicle.sold })
      setVehicles(vehicles.map(v =>
        v.id === vehicle.id ? { ...v, sold: !v.sold } : v
      ))
    } catch (error) {
      console.error('Erro ao atualizar veiculo:', error)
    }
  }

  const filteredVehicles = vehicles.filter(v =>
    `${v.brand} ${v.model} ${v.version || ''}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Veiculos</h1>
          <p className="text-dark-400 mt-1">{vehicles.length} veiculos cadastrados</p>
        </div>
        <Link to="/admin/veiculos/novo">
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            Novo Veiculo
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <Input
            placeholder="Buscar veiculos..."
            icon={<Search className="w-5 h-5" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-dark-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredVehicles.length > 0 ? (
        <div className="space-y-4">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Image */}
                  <div className="w-24 h-18 rounded-lg overflow-hidden flex-shrink-0 bg-dark-700">
                    {vehicle.images?.[0] ? (
                      <img
                        src={vehicle.images[0].url}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-dark-500">
                        Sem foto
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white truncate">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      {vehicle.featured && <Badge variant="primary">Destaque</Badge>}
                      {vehicle.sold && <Badge variant="danger">Vendido</Badge>}
                    </div>
                    <p className="text-sm text-dark-400 truncate">
                      {vehicle.version} | {vehicle.year} | {formatNumber(vehicle.mileage)} km
                    </p>
                    <p className="text-lg font-bold text-primary-500 mt-1">
                      {formatCurrency(vehicle.price)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleToggleFeatured(vehicle)}
                      className={`p-2 rounded-lg transition-colors ${
                        vehicle.featured
                          ? 'bg-amber-500/20 text-amber-500'
                          : 'bg-dark-700 text-dark-400 hover:text-amber-500'
                      }`}
                      title={vehicle.featured ? 'Remover destaque' : 'Destacar'}
                    >
                      {vehicle.featured ? <Star className="w-5 h-5" /> : <StarOff className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => handleToggleSold(vehicle)}
                      className={`p-2 rounded-lg transition-colors ${
                        vehicle.sold
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-dark-700 text-dark-400 hover:text-green-500'
                      }`}
                      title={vehicle.sold ? 'Marcar como disponivel' : 'Marcar como vendido'}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <Link
                      to={`/admin/veiculos/${vehicle.id}`}
                      className="p-2 bg-dark-700 text-dark-400 rounded-lg hover:text-white transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className="p-2 bg-dark-700 text-dark-400 rounded-lg hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-dark-400">
              {search ? 'Nenhum veiculo encontrado' : 'Nenhum veiculo cadastrado'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

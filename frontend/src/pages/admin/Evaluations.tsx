import { useState, useEffect } from 'react'
import { ClipboardList, Trash2, Phone, Mail, Clock, Car } from 'lucide-react'
import { Button, Badge, Card, CardContent, Select } from '@/components/ui'
import { evaluationService } from '@/services/evaluationService'
import { formatDate, formatNumber } from '@/lib/utils'
import type { Evaluation } from '@/types'

const statusOptions = [
  { value: 'pending', label: 'Pendente' },
  { value: 'contacted', label: 'Contatado' },
  { value: 'scheduled', label: 'Agendado' },
  { value: 'completed', label: 'Concluido' },
  { value: 'cancelled', label: 'Cancelado' },
]

const statusColors: Record<string, 'warning' | 'primary' | 'success' | 'danger' | 'default'> = {
  pending: 'warning',
  contacted: 'primary',
  scheduled: 'primary',
  completed: 'success',
  cancelled: 'danger',
}

export function AdminEvaluations() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null)

  useEffect(() => {
    loadEvaluations()
  }, [])

  const loadEvaluations = async () => {
    setIsLoading(true)
    try {
      const data = await evaluationService.getAll()
      setEvaluations(data)
    } catch (error) {
      console.error('Erro ao carregar avaliacoes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (evaluation: Evaluation, status: string) => {
    try {
      await evaluationService.updateStatus(evaluation.id, status)
      setEvaluations(evaluations.map(e =>
        e.id === evaluation.id ? { ...e, status } : e
      ))
      if (selectedEvaluation?.id === evaluation.id) {
        setSelectedEvaluation({ ...evaluation, status })
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta avaliacao?')) return

    try {
      await evaluationService.delete(id)
      setEvaluations(evaluations.filter(e => e.id !== id))
      if (selectedEvaluation?.id === id) {
        setSelectedEvaluation(null)
      }
    } catch (error) {
      console.error('Erro ao excluir avaliacao:', error)
    }
  }

  const pendingCount = evaluations.filter(e => e.status === 'pending').length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white">Avaliacoes</h1>
        <p className="text-dark-400 mt-1">
          {pendingCount > 0
            ? `${pendingCount} avaliacao(es) pendente(s)`
            : 'Todas as avaliacoes foram processadas'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evaluation List */}
        <div className="lg:col-span-1 space-y-3">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-dark-800 rounded-xl animate-pulse" />
            ))
          ) : evaluations.length > 0 ? (
            evaluations.map((evaluation) => (
              <Card
                key={evaluation.id}
                hover
                className={`cursor-pointer ${selectedEvaluation?.id === evaluation.id ? 'border-primary-500' : ''}`}
                onClick={() => setSelectedEvaluation(evaluation)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white">{evaluation.name}</h3>
                    <Badge variant={statusColors[evaluation.status] || 'default'}>
                      {statusOptions.find(s => s.value === evaluation.status)?.label || evaluation.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-dark-400">
                    {evaluation.brand} {evaluation.model} {evaluation.year}
                  </p>
                  <p className="text-xs text-dark-500 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(evaluation.createdAt)}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-dark-400">Nenhuma avaliacao solicitada</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Evaluation Detail */}
        <div className="lg:col-span-2">
          {selectedEvaluation ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{selectedEvaluation.name}</h2>
                    <p className="text-dark-400">{selectedEvaluation.email}</p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(selectedEvaluation.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-dark-700">
                  <a href={`tel:${selectedEvaluation.phone}`} className="flex items-center gap-2 text-dark-300 hover:text-primary-500 transition-colors">
                    <Phone className="w-4 h-4" />
                    {selectedEvaluation.phone}
                  </a>
                  <span className="text-dark-600">|</span>
                  <span className="text-dark-400 text-sm">
                    Solicitado em {formatDate(selectedEvaluation.createdAt)}
                  </span>
                </div>

                {/* Vehicle Info */}
                <div className="bg-dark-700 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                      <Car className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {selectedEvaluation.brand} {selectedEvaluation.model}
                      </h3>
                      <p className="text-sm text-dark-400">Veiculo para avaliacao</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-dark-400">Ano</p>
                      <p className="text-white">{selectedEvaluation.year}</p>
                    </div>
                    <div>
                      <p className="text-xs text-dark-400">Quilometragem</p>
                      <p className="text-white">{formatNumber(selectedEvaluation.mileage)} km</p>
                    </div>
                  </div>
                </div>

                {selectedEvaluation.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-dark-400 mb-2">Observacoes:</h3>
                    <p className="text-white whitespace-pre-wrap">{selectedEvaluation.description}</p>
                  </div>
                )}

                {/* Status Update */}
                <div className="mb-6 pb-6 border-b border-dark-700">
                  <label className="block text-sm font-medium text-dark-400 mb-2">Status</label>
                  <Select
                    options={statusOptions}
                    value={selectedEvaluation.status}
                    onChange={(e) => handleStatusChange(selectedEvaluation, e.target.value)}
                    className="max-w-xs"
                  />
                </div>

                <div className="flex gap-3">
                  <a href={`tel:${selectedEvaluation.phone}`}>
                    <Button variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      Ligar
                    </Button>
                  </a>
                  <a href={`mailto:${selectedEvaluation.email}`}>
                    <Button variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      E-mail
                    </Button>
                  </a>
                  <a href={`https://wa.me/55${selectedEvaluation.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-green-600 hover:bg-green-700">
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <ClipboardList className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                <p className="text-dark-400">Selecione uma avaliacao para visualizar</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

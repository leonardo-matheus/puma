'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, Car, Eye, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { formatNumber } from '@/lib/utils'
import type { Evaluation } from '@/types'

export default function AdminEvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null)

  useEffect(() => {
    fetchEvaluations()
  }, [])

  const fetchEvaluations = async () => {
    try {
      const res = await fetch('/api/evaluations')
      const data = await res.json()
      setEvaluations(data.evaluations || [])
    } catch (error) {
      console.error('Error fetching evaluations:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pendente</Badge>
      case 'contacted':
        return <Badge variant="primary">Contatado</Badge>
      case 'completed':
        return <Badge variant="success">Concluído</Badge>
      case 'rejected':
        return <Badge variant="danger">Rejeitado</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

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
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Avaliações</h1>
        <p className="text-dark-400">{evaluations.length} solicitações de avaliação</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-4">
          {evaluations.length > 0 ? (
            evaluations.map((evaluation, index) => (
              <motion.div
                key={evaluation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  hover
                  className={`cursor-pointer ${selectedEvaluation?.id === evaluation.id ? 'border-primary-500' : ''}`}
                >
                  <CardContent onClick={() => setSelectedEvaluation(evaluation)}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                          <Car className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">
                            {evaluation.brand} {evaluation.model}
                          </h3>
                          <p className="text-dark-400 text-sm">{evaluation.name}</p>
                        </div>
                      </div>
                      {getStatusBadge(evaluation.status)}
                    </div>
                    <div className="flex items-center gap-4 text-dark-400 text-sm mb-2">
                      <span>Ano: {evaluation.year}</span>
                      <span>{formatNumber(evaluation.mileage)} km</span>
                    </div>
                    <p className="text-dark-500 text-xs">{formatDate(evaluation.createdAt)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <ClipboardList className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhuma avaliação</h3>
                <p className="text-dark-400">As solicitações de avaliação aparecerão aqui.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Detail */}
        <div className="lg:sticky lg:top-24">
          {selectedEvaluation ? (
            <Card>
              <CardContent>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center">
                      <Car className="w-7 h-7 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {selectedEvaluation.brand} {selectedEvaluation.model}
                      </h2>
                      <p className="text-dark-400 text-sm">{formatDate(selectedEvaluation.createdAt)}</p>
                    </div>
                  </div>
                  {getStatusBadge(selectedEvaluation.status)}
                </div>

                {/* Vehicle Info */}
                <div className="bg-dark-700 rounded-xl p-4 mb-6">
                  <h3 className="text-white font-medium mb-3">Dados do Veículo</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-dark-400">Marca</p>
                      <p className="text-white">{selectedEvaluation.brand}</p>
                    </div>
                    <div>
                      <p className="text-dark-400">Modelo</p>
                      <p className="text-white">{selectedEvaluation.model}</p>
                    </div>
                    <div>
                      <p className="text-dark-400">Ano</p>
                      <p className="text-white">{selectedEvaluation.year}</p>
                    </div>
                    <div>
                      <p className="text-dark-400">Quilometragem</p>
                      <p className="text-white">{formatNumber(selectedEvaluation.mileage)} km</p>
                    </div>
                  </div>
                  {selectedEvaluation.description && (
                    <div className="mt-4 pt-4 border-t border-dark-600">
                      <p className="text-dark-400 text-sm">Observações</p>
                      <p className="text-white mt-1">{selectedEvaluation.description}</p>
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <h3 className="text-white font-medium">Contato</h3>
                  <p className="text-dark-300">{selectedEvaluation.name}</p>
                  <a
                    href={`mailto:${selectedEvaluation.email}`}
                    className="flex items-center gap-3 text-dark-300 hover:text-primary-400 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    {selectedEvaluation.email}
                  </a>
                  <a
                    href={`tel:${selectedEvaluation.phone}`}
                    className="flex items-center gap-3 text-dark-300 hover:text-primary-400 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    {selectedEvaluation.phone}
                  </a>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`https://wa.me/55${selectedEvaluation.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    className="flex-1"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-500">
                      <Phone className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                  <a href={`mailto:${selectedEvaluation.email}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-16">
                <Eye className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                <p className="text-dark-400">Selecione uma avaliação para ver os detalhes</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

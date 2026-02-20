import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, MessageSquare, ClipboardList, TrendingUp, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import { settingsService } from '@/services/settingsService'
import type { Stats } from '@/types'

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    settingsService.getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const statCards = [
    {
      title: 'Veiculos Disponiveis',
      value: stats?.vehicles.available ?? 0,
      icon: Car,
      color: 'bg-blue-500',
      href: '/admin/veiculos',
    },
    {
      title: 'Veiculos Vendidos',
      value: stats?.vehicles.sold ?? 0,
      icon: TrendingUp,
      color: 'bg-green-500',
      href: '/admin/veiculos',
    },
    {
      title: 'Contatos Nao Lidos',
      value: stats?.contacts.unread ?? 0,
      icon: MessageSquare,
      color: 'bg-amber-500',
      href: '/admin/contatos',
    },
    {
      title: 'Avaliacoes Pendentes',
      value: stats?.evaluations.pending ?? 0,
      icon: ClipboardList,
      color: 'bg-purple-500',
      href: '/admin/avaliacoes',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white">Dashboard</h1>
        <p className="text-dark-400 mt-1">Visao geral do sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={stat.href}>
              <Card hover>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-dark-400 text-sm">{stat.title}</p>
                      <p className="text-3xl font-bold text-white mt-1">
                        {isLoading ? '-' : stat.value}
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color}/20 rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Acoes Rapidas</h2>
            <div className="space-y-3">
              <Link
                to="/admin/veiculos/novo"
                className="flex items-center justify-between p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-primary-500" />
                  </div>
                  <span className="text-white">Cadastrar novo veiculo</span>
                </div>
                <ArrowRight className="w-5 h-5 text-dark-400" />
              </Link>
              <Link
                to="/admin/contatos"
                className="flex items-center justify-between p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-amber-500" />
                  </div>
                  <span className="text-white">Ver contatos recentes</span>
                </div>
                <ArrowRight className="w-5 h-5 text-dark-400" />
              </Link>
              <Link
                to="/admin/avaliacoes"
                className="flex items-center justify-between p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="text-white">Ver avaliacoes pendentes</span>
                </div>
                <ArrowRight className="w-5 h-5 text-dark-400" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Resumo de Veiculos</h2>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-4 bg-dark-700 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-dark-400">Total de veiculos</span>
                  <span className="text-white font-semibold">{stats?.vehicles.total ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-400">Disponiveis</span>
                  <span className="text-green-400 font-semibold">{stats?.vehicles.available ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-400">Vendidos</span>
                  <span className="text-blue-400 font-semibold">{stats?.vehicles.sold ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-400">Em destaque</span>
                  <span className="text-primary-400 font-semibold">{stats?.vehicles.featured ?? 0}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

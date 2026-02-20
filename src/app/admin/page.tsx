'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Car, MessageSquare, ClipboardList, TrendingUp, Plus, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

interface Stats {
  totalVehicles: number
  featuredVehicles: number
  soldVehicles: number
  pendingContacts: number
  pendingEvaluations: number
  totalValue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalVehicles: 0,
    featuredVehicles: 0,
    soldVehicles: 0,
    pendingContacts: 0,
    pendingEvaluations: 0,
    totalValue: 0,
  })
  const [recentVehicles, setRecentVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [vehiclesRes, contactsRes, evaluationsRes] = await Promise.all([
        fetch('/api/vehicles?limit=100'),
        fetch('/api/contacts'),
        fetch('/api/evaluations'),
      ])

      const vehiclesData = await vehiclesRes.json()
      const contactsData = await contactsRes.json()
      const evaluationsData = await evaluationsRes.json()

      const vehicles = vehiclesData.vehicles || []
      const contacts = contactsData.contacts || []
      const evaluations = evaluationsData.evaluations || []

      setStats({
        totalVehicles: vehicles.filter((v: any) => !v.sold).length,
        featuredVehicles: vehicles.filter((v: any) => v.featured && !v.sold).length,
        soldVehicles: vehicles.filter((v: any) => v.sold).length,
        pendingContacts: contacts.filter((c: any) => !c.read).length,
        pendingEvaluations: evaluations.filter((e: any) => e.status === 'pending').length,
        totalValue: vehicles.filter((v: any) => !v.sold).reduce((acc: number, v: any) => acc + v.price, 0),
      })

      setRecentVehicles(vehicles.slice(0, 5))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Veículos em Estoque',
      value: stats.totalVehicles,
      icon: Car,
      color: 'primary',
      href: '/admin/veiculos',
    },
    {
      title: 'Em Destaque',
      value: stats.featuredVehicles,
      icon: TrendingUp,
      color: 'green',
      href: '/admin/veiculos?featured=true',
    },
    {
      title: 'Contatos Pendentes',
      value: stats.pendingContacts,
      icon: MessageSquare,
      color: 'blue',
      href: '/admin/contatos',
    },
    {
      title: 'Avaliações Pendentes',
      value: stats.pendingEvaluations,
      icon: ClipboardList,
      color: 'amber',
      href: '/admin/avaliacoes',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Dashboard</h1>
          <p className="text-dark-400">Visão geral do sistema</p>
        </div>
        <Link href="/admin/veiculos/novo">
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            Novo Veículo
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={stat.href}>
              <Card hover className="h-full">
                <CardContent className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-${stat.color}-500/20 rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-7 h-7 text-${stat.color}-400`} />
                  </div>
                  <div>
                    <p className="text-dark-400 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Value Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-primary-600 to-primary-500">
          <CardContent>
            <p className="text-dark-900 font-medium mb-1">Valor Total em Estoque</p>
            <p className="text-3xl font-bold text-dark-900">{formatCurrency(stats.totalValue)}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Vehicles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Veículos Recentes</h2>
              <Link href="/admin/veiculos" className="text-primary-400 hover:underline text-sm">
                Ver todos
              </Link>
            </div>

            {recentVehicles.length > 0 ? (
              <div className="space-y-4">
                {recentVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center gap-4 p-3 bg-dark-700 rounded-xl"
                  >
                    <div className="w-16 h-12 bg-dark-600 rounded-lg overflow-hidden">
                      {vehicle.images?.[0] && (
                        <img
                          src={vehicle.images[0].url}
                          alt={vehicle.model}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {vehicle.brand} {vehicle.model} {vehicle.year}
                      </p>
                      <p className="text-primary-400 font-semibold">
                        {formatCurrency(vehicle.price)}
                      </p>
                    </div>
                    <Link href={`/admin/veiculos/${vehicle.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-dark-400 text-center py-8">Nenhum veículo cadastrado</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

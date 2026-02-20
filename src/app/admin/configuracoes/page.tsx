'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, User, Lock, Save } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem')
      return
    }
    // TODO: Implement password change
    alert('Funcionalidade em desenvolvimento')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Configurações</h1>
        <p className="text-dark-400">Gerencie as configurações do sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Change */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Alterar Senha</h2>
                  <p className="text-dark-400 text-sm">Atualize sua senha de acesso</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <Input
                  label="Senha Atual"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <Input
                  label="Nova Senha"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <Input
                  label="Confirmar Nova Senha"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <Button type="submit" isLoading={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Senha
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Informações do Sistema</h2>
                  <p className="text-dark-400 text-sm">Detalhes técnicos</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-dark-700">
                  <span className="text-dark-400">Versão</span>
                  <span className="text-white">1.0.0</span>
                </div>
                <div className="flex justify-between py-3 border-b border-dark-700">
                  <span className="text-dark-400">Framework</span>
                  <span className="text-white">Next.js 14</span>
                </div>
                <div className="flex justify-between py-3 border-b border-dark-700">
                  <span className="text-dark-400">Banco de Dados</span>
                  <span className="text-white">SQLite</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-dark-400">Ambiente</span>
                  <span className="text-green-400">Desenvolvimento</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

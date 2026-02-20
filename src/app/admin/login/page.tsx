'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, Mail } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const LOGO_URL = 'https://i.ibb.co/zH2rSR87/image-removebg-preview.png'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function AdminLoginPage() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || 'Erro ao fazer login')
        return
      }

      router.push('/admin')
    } catch (err) {
      setError('Erro ao conectar com o servidor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src={LOGO_URL}
            alt="Puma Multimarcas"
            width={200}
            height={70}
            className="h-16 w-auto object-contain mx-auto mb-4"
          />
          <p className="text-dark-400">Painel Administrativo</p>
        </div>

        {/* Form */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Entrar</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="admin@puma.com"
              icon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              error={errors.password?.message}
              {...register('password')}
            />
            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              Entrar
            </Button>
          </form>
        </div>

        <p className="text-center text-dark-500 text-sm mt-6">
          Área restrita para administradores
        </p>
      </motion.div>
    </div>
  )
}

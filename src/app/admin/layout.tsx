'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Car, MessageSquare, ClipboardList,
  Settings, LogOut, Menu, X, ChevronRight, Image as ImageIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

const LOGO_URL = 'https://i.ibb.co/zH2rSR87/image-removebg-preview.png'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/veiculos', icon: Car, label: 'Veículos' },
  { href: '/admin/banners', icon: ImageIcon, label: 'Banners' },
  { href: '/admin/contatos', icon: MessageSquare, label: 'Contatos' },
  { href: '/admin/avaliacoes', icon: ClipboardList, label: 'Avaliações' },
  { href: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        if (pathname !== '/admin/login') {
          router.push('/admin/login')
        }
      }
    } catch (error) {
      if (pathname !== '/admin/login') {
        router.push('/admin/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  // Show login page without layout
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-dark-800 border-r border-dark-700 transform transition-transform duration-300 lg:translate-x-0 lg:static',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-dark-700">
            <Link href="/admin" className="flex items-center">
              <Image
                src={LOGO_URL}
                alt="Puma Multimarcas"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-dark-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  pathname === item.href
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-dark-400 hover:bg-dark-700 hover:text-white'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {pathname === item.href && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-dark-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-dark-700 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">{user?.name?.[0] || 'A'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{user?.name}</p>
                <p className="text-dark-400 text-sm truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-dark-800 border-b border-dark-700 flex items-center px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-dark-400 hover:text-white mr-4"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-white font-semibold">
            {navItems.find((item) => item.href === pathname)?.label || 'Admin'}
          </h1>
          <Link
            href="/"
            target="_blank"
            className="ml-auto text-dark-400 hover:text-primary-400 text-sm"
          >
            Ver site →
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Heart, Phone, MapPin, Car } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFavorites } from '@/hooks/useFavorites'

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Veiculos', href: '/carros' },
  { name: 'Sobre', href: '/sobre' },
  { name: 'Avaliacao', href: '/avaliacao' },
  { name: 'Contato', href: '/contato' },
  { name: 'Localizacao', href: '/localizacao' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { favorites } = useFavorites()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-950/95 backdrop-blur-md border-b border-dark-800">
      {/* Top bar */}
      <div className="bg-dark-900 py-2 hidden lg:block">
        <div className="container flex justify-between items-center text-sm text-dark-400">
          <div className="flex items-center gap-6">
            <a href="tel:+551620162615" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-4 h-4" />
              (16) 2016-2615
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Matao, SP
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Seg a Sex: 09h as 18h | Sab: 09h as 13h</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Car className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-display font-bold">
              Puma <span className="text-primary-500">Multimarcas</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary-500',
                  location.pathname === item.href ? 'text-primary-500' : 'text-dark-300'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              to="/favoritos"
              className="relative p-2 text-dark-400 hover:text-primary-500 transition-colors"
            >
              <Heart className="w-6 h-6" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-dark-400 hover:text-white transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-dark-900 border-t border-dark-800"
          >
            <nav className="container py-4 flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'text-base font-medium py-2 transition-colors hover:text-primary-500',
                    location.pathname === item.href ? 'text-primary-500' : 'text-dark-300'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

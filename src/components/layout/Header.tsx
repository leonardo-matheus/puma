'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, Mail, Clock, Facebook, Instagram, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFavorites } from '@/hooks/useFavorites'

const LOGO_URL = 'https://i.ibb.co/zH2rSR87/image-removebg-preview.png'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/carros', label: 'Veículos' },
  { href: '/avaliacao', label: 'Avaliação' },
  { href: '/contato', label: 'Contato' },
  { href: '/localizacao', label: 'Localização' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { count } = useFavorites()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top Bar */}
      <div className="bg-dark-950 border-b border-dark-900 hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-6 text-dark-400">
              <a href="tel:+551620162615" className="flex items-center gap-2 hover:text-primary-500 transition-colors">
                <Phone className="w-4 h-4" />
                <span>(16) 2016-2615</span>
              </a>
              <a href="mailto:pumamultimarcas@yahoo.com" className="flex items-center gap-2 hover:text-primary-500 transition-colors">
                <Mail className="w-4 h-4" />
                <span>pumamultimarcas@yahoo.com</span>
              </a>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Seg-Sex: 09h-18h | Sáb: 09h-13h</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/PumaMultimarcas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-primary-500 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/puma_multimarcas_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-primary-500 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-dark-950/95 backdrop-blur-lg shadow-lg shadow-black/50'
            : 'bg-dark-950'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src={LOGO_URL}
                alt="Puma Multimarcas"
                width={180}
                height={60}
                className="h-10 sm:h-14 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 xl:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm xl:text-base',
                    pathname === link.href
                      ? 'text-primary-500 bg-primary-500/10'
                      : 'text-dark-300 hover:text-white hover:bg-dark-800'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/favoritos"
                className="relative p-2 text-dark-400 hover:text-primary-500 transition-colors"
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </Link>
              <Link
                href="https://wa.me/5516992537016"
                target="_blank"
                className="hidden sm:flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden md:inline">WhatsApp</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-dark-300 hover:text-white transition-colors"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-dark-800 overflow-hidden bg-dark-950"
            >
              <nav className="container mx-auto px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'block px-4 py-3 rounded-lg font-medium transition-all duration-300',
                      pathname === link.href
                        ? 'text-primary-500 bg-primary-500/10'
                        : 'text-dark-300 hover:text-white hover:bg-dark-800'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href="https://wa.me/5516992537016"
                  target="_blank"
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 mt-4"
                >
                  <Phone className="w-4 h-4" />
                  <span>Fale pelo WhatsApp</span>
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

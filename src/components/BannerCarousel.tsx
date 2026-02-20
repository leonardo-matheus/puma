'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Banner {
  id: string
  title?: string | null
  subtitle?: string | null
  imageUrl: string
  link?: string | null
}

interface BannerCarouselProps {
  autoPlayInterval?: number
}

export function BannerCarousel({ autoPlayInterval = 4000 }: BannerCarouselProps) {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners')
      const data = await res.json()
      setBanners(data.banners || [])
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = useCallback(() => {
    if (banners.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }
  }, [banners.length])

  const prevSlide = useCallback(() => {
    if (banners.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
    }
  }, [banners.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-play
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return

    const interval = setInterval(() => {
      nextSlide()
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [banners.length, isPaused, autoPlayInterval, nextSlide])

  if (loading) {
    return (
      <div className="relative w-full aspect-[21/9] sm:aspect-[21/7] lg:aspect-[21/6] bg-dark-900 animate-pulse rounded-xl sm:rounded-2xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (banners.length === 0) {
    return null
  }

  const currentBanner = banners[currentIndex]

  const BannerContent = (
    <div
      className="relative w-full aspect-[21/9] sm:aspect-[21/7] lg:aspect-[21/6] rounded-xl sm:rounded-2xl overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={currentBanner.imageUrl}
            alt={currentBanner.title || 'Banner'}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950/80 via-dark-950/40 to-transparent" />

          {/* Content */}
          {(currentBanner.title || currentBanner.subtitle) && (
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="max-w-xl"
                >
                  {currentBanner.title && (
                    <h2 className="text-xl sm:text-3xl lg:text-5xl font-display font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">
                      {currentBanner.title}
                    </h2>
                  )}
                  {currentBanner.subtitle && (
                    <p className="text-sm sm:text-lg lg:text-xl text-white/90 drop-shadow-md">
                      {currentBanner.subtitle}
                    </p>
                  )}
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault()
              prevSlide()
            }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 bg-dark-950/50 hover:bg-dark-950/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              nextSlide()
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 bg-dark-950/50 hover:bg-dark-950/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Próximo"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                goToSlide(index)
              }}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-6 sm:w-8 bg-primary-500'
                  : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {banners.length > 1 && !isPaused && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-dark-950/30">
          <motion.div
            key={currentIndex}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
            className="h-full bg-primary-500"
          />
        </div>
      )}
    </div>
  )

  // Wrap with Link if banner has a link
  if (currentBanner.link) {
    return (
      <Link href={currentBanner.link} className="block group">
        {BannerContent}
      </Link>
    )
  }

  return <div className="group">{BannerContent}</div>
}

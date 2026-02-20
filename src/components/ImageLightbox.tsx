'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'

interface ImageLightboxProps {
  images: { url: string }[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
}

export function ImageLightbox({ images, initialIndex, isOpen, onClose }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setCurrentIndex(initialIndex)
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [initialIndex, isOpen])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'Escape':
        onClose()
        break
      case 'ArrowLeft':
        goToPrevious()
        break
      case 'ArrowRight':
        goToNext()
        break
      case '+':
      case '=':
        zoomIn()
        break
      case '-':
        zoomOut()
        break
    }
  }, [isOpen, currentIndex])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    resetZoom()
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    resetZoom()
  }

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 4))
  }

  const zoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.5, 1)
      if (newScale === 1) setPosition({ x: 0, y: 0 })
      return newScale
    })
  }

  const resetZoom = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      zoomIn()
    } else {
      zoomOut()
    }
  }

  const handleDoubleClick = () => {
    if (scale > 1) {
      resetZoom()
    } else {
      setScale(2)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-dark-800/80 text-white hover:bg-dark-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Zoom controls */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-dark-800/80 rounded-full px-4 py-2">
          <button
            onClick={zoomOut}
            disabled={scale <= 1}
            className="p-1 text-white hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-white text-sm min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={zoomIn}
            disabled={scale >= 4}
            className="p-1 text-white hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-dark-800/80 text-white hover:bg-dark-700 transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-dark-800/80 text-white hover:bg-dark-700 transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Image container */}
        <div
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onDoubleClick={handleDoubleClick}
          style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
        >
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: scale,
              x: position.x,
              y: position.y,
            }}
            transition={{
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
              x: { duration: isDragging ? 0 : 0.2 },
              y: { duration: isDragging ? 0 : 0.2 },
            }}
            src={images[currentIndex]?.url}
            alt={`Imagem ${currentIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain select-none"
            draggable={false}
          />
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-dark-800/80 rounded-lg p-2 max-w-[90vw] overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  resetZoom()
                }}
                className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                  index === currentIndex ? 'border-primary-500' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={image.url}
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Image counter */}
        <div className="absolute bottom-4 right-4 z-10 bg-dark-800/80 rounded-full px-3 py-1">
          <span className="text-white text-sm">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

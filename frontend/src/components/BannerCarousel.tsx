import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { bannerService } from '@/services/bannerService'
import type { Banner } from '@/types'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    bannerService.getAll()
      .then(setBanners)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="relative h-[400px] lg:h-[600px] bg-dark-900 animate-pulse" />
    )
  }

  if (banners.length === 0) {
    return (
      <div className="relative h-[400px] lg:h-[600px] bg-gradient-to-r from-dark-900 to-dark-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl lg:text-6xl font-display font-bold text-white mb-4">
            Puma <span className="text-primary-500">Multimarcas</span>
          </h1>
          <p className="text-xl text-dark-300">
            Os melhores veiculos seminovos da regiao
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[400px] lg:h-[600px]">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: '.banner-prev',
          nextEl: '.banner-next',
        }}
        loop={banners.length > 1}
        className="h-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative h-full">
              <img
                src={banner.imageUrl}
                alt={banner.title || 'Banner'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-dark-950/80 to-transparent" />

              {(banner.title || banner.subtitle) && (
                <div className="absolute inset-0 flex items-center">
                  <div className="container">
                    <div className="max-w-xl">
                      {banner.title && (
                        <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-4">
                          {banner.title}
                        </h2>
                      )}
                      {banner.subtitle && (
                        <p className="text-lg lg:text-xl text-dark-200">
                          {banner.subtitle}
                        </p>
                      )}
                      {banner.link && (
                        <a
                          href={banner.link}
                          className="inline-block mt-6 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                          Saiba Mais
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {banners.length > 1 && (
        <>
          <button className="banner-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-dark-900/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary-500 transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="banner-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-dark-900/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary-500 transition-all">
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  )
}

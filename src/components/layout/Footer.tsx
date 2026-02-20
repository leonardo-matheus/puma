'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Car } from 'lucide-react'

const LOGO_URL = 'https://i.ibb.co/zH2rSR87/image-removebg-preview.png'

export function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-dark-900">
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4 sm:mb-6">
              <Image
                src={LOGO_URL}
                alt="Puma Multimarcas"
                width={160}
                height={50}
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-dark-400 leading-relaxed text-sm sm:text-base">
              Revendedora de confiança de carros em Matão e região. Mais de 20 anos de experiência no mercado automotivo.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">Links Rápidos</h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { href: '/carros', label: 'Estoque' },
                { href: '/sobre', label: 'Sobre Nós' },
                { href: '/avaliacao', label: 'Avalie seu Veículo' },
                { href: '/contato', label: 'Contato' },
                { href: '/localizacao', label: 'Localização' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-dark-400 hover:text-primary-500 transition-colors inline-flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Car className="w-4 h-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">Contato</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <a
                  href="tel:+551620162615"
                  className="text-dark-400 hover:text-primary-500 transition-colors flex items-start gap-3 text-sm sm:text-base"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 text-primary-500" />
                  <span>(16) 2016-2615</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:pumamultimarcas@yahoo.com"
                  className="text-dark-400 hover:text-primary-500 transition-colors flex items-start gap-3 text-sm sm:text-base"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 text-primary-500" />
                  <span className="break-all">pumamultimarcas@yahoo.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-dark-400 text-sm sm:text-base">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 text-primary-500" />
                <span>Av. Rincão, 471 – Jardim Buscardi, Matão – SP</span>
              </li>
              <li className="flex items-start gap-3 text-dark-400 text-sm sm:text-base">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 text-primary-500" />
                <div>
                  <p>Seg-Sex: 09h às 18h</p>
                  <p>Sábado: 09h às 13h</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Social & WhatsApp */}
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">Redes Sociais</h3>
            <p className="text-dark-400 mb-4 text-sm sm:text-base">
              Siga-nos e fique por dentro das novidades!
            </p>
            <div className="flex items-center gap-3 mb-6">
              <a
                href="https://www.facebook.com/PumaMultimarcas"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-800 hover:bg-primary-500 rounded-lg flex items-center justify-center text-dark-400 hover:text-white transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/puma_multimarcas_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-800 hover:bg-primary-500 rounded-lg flex items-center justify-center text-dark-400 hover:text-white transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            {/* WhatsApp CTA */}
            <div className="p-4 bg-dark-900 rounded-xl border border-dark-800">
              <p className="text-dark-300 text-sm mb-3">Fale com um vendedor:</p>
              <a
                href="https://wa.me/5516992537016"
                target="_blank"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 w-full text-sm sm:text-base"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-dark-500 text-xs sm:text-sm">
          <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} Puma Multimarcas. Todos os direitos reservados.</p>
          <Link href="/admin" className="hover:text-primary-500 transition-colors">
            Área Administrativa
          </Link>
        </div>
      </div>
    </footer>
  )
}

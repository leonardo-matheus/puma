import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Puma Multimarcas - Carros Seminovos em Matão SP',
    template: '%s | Puma Multimarcas',
  },
  description: 'Revendedora de confiança de carros em Matão e região. Encontre os melhores seminovos e usados com as melhores condições de financiamento.',
  keywords: ['carros', 'seminovos', 'usados', 'matão', 'revenda', 'veículos', 'financiamento'],
  authors: [{ name: 'Puma Multimarcas' }],
  icons: {
    icon: 'https://pumamultimarcasmatao.com.br/favicon.ico',
    shortcut: 'https://pumamultimarcasmatao.com.br/favicon.ico',
    apple: 'https://pumamultimarcasmatao.com.br/wp-content/uploads/2022/08/cropped-puma-1.png',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://pumamultimarcas.com.br',
    siteName: 'Puma Multimarcas',
    title: 'Puma Multimarcas - Carros Seminovos em Matão SP',
    description: 'Revendedora de confiança de carros em Matão e região.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

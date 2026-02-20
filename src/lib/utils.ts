import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

export function getWhatsAppLink(phone: string, message?: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const phoneWithCountry = cleaned.startsWith('55') ? cleaned : `55${cleaned}`
  const baseUrl = `https://wa.me/${phoneWithCountry}`
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl
}

export function getVehicleTitle(vehicle: {
  brand: string
  model: string
  version?: string | null
  year: number
}): string {
  const parts = [vehicle.brand, vehicle.model]
  if (vehicle.version) parts.push(vehicle.version)
  parts.push(vehicle.year.toString())
  return parts.join(' ')
}

export function getVehicleSlug(vehicle: {
  brand: string
  model: string
  version?: string | null
  year: number
}): string {
  return slugify(getVehicleTitle(vehicle))
}

export const fuelTypes = [
  { value: 'flex', label: 'Flex' },
  { value: 'gasolina', label: 'Gasolina' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'eletrico', label: 'Elétrico' },
  { value: 'hibrido', label: 'Híbrido' },
]

export const transmissionTypes = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatico', label: 'Automático' },
  { value: 'automatizado', label: 'Automatizado' },
  { value: 'cvt', label: 'CVT' },
]

export const bodyTypes = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'hatch', label: 'Hatch' },
  { value: 'suv', label: 'SUV' },
  { value: 'picape', label: 'Picape' },
  { value: 'crossover', label: 'Crossover' },
  { value: 'coupe', label: 'Coupé' },
  { value: 'perua', label: 'Perua' },
  { value: 'minivan', label: 'Minivan' },
]

export const colorOptions = [
  'Preto',
  'Branco',
  'Prata',
  'Cinza',
  'Vermelho',
  'Azul',
  'Verde',
  'Amarelo',
  'Laranja',
  'Marrom',
  'Bege',
  'Dourado',
  'Vinho',
]

export const popularBrands = [
  'Chevrolet',
  'Fiat',
  'Ford',
  'Honda',
  'Hyundai',
  'Jeep',
  'Nissan',
  'Peugeot',
  'Renault',
  'Toyota',
  'Volkswagen',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Citroën',
  'Kia',
  'Mitsubishi',
  'Suzuki',
]

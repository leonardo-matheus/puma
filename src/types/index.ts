export interface Vehicle {
  id: string
  brand: string
  model: string
  version?: string | null
  year: number
  yearModel?: number | null
  price: number
  mileage: number
  fuel: string
  transmission: string
  bodyType?: string | null
  color?: string | null
  doors?: number | null
  plate?: string | null
  description?: string | null
  condition: string
  featured: boolean
  sold: boolean
  createdAt: Date
  updatedAt: Date
  images: VehicleImage[]
  optionals: VehicleOptional[]
}

export interface VehicleImage {
  id: string
  url: string
  order: number
  vehicleId: string
}

export interface VehicleOptional {
  id: string
  name: string
  vehicleId: string
}

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  message: string
  vehicleId?: string | null
  read: boolean
  createdAt: Date
}

export interface Evaluation {
  id: string
  name: string
  email: string
  phone: string
  brand: string
  model: string
  year: number
  mileage: number
  description?: string | null
  status: string
  createdAt: Date
}

export interface Settings {
  id: string
  companyName: string
  description: string
  email: string
  phone: string
  whatsapp: string
  address: string
  workingHours: string
  facebook: string
  instagram: string
  logoUrl?: string | null
  bannerUrl?: string | null
}

export interface Seller {
  id: string
  name: string
  phone: string
  whatsapp: string
  active: boolean
  order: number
}

export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface FilterOptions {
  brand?: string
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  fuel?: string
  transmission?: string
  search?: string
}

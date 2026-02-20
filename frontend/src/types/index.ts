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
  createdAt: string
  updatedAt: string
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
  createdAt: string
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
  createdAt: string
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

export interface Banner {
  id: string
  title?: string | null
  subtitle?: string | null
  imageUrl: string
  link?: string | null
  active: boolean
  order: number
  createdAt: string
  updatedAt: string
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
  featured?: boolean
  limit?: number
}

export interface Stats {
  vehicles: {
    total: number
    available: number
    sold: number
    featured: number
  }
  contacts: {
    unread: number
  }
  evaluations: {
    pending: number
  }
}

export interface AuthResponse {
  token: string
  user: User
}

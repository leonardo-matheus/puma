import { api } from './api'
import type { Vehicle, FilterOptions } from '@/types'

function buildQueryString(filters: FilterOptions): string {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value))
    }
  })

  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}

type VehicleInput = Omit<Partial<Vehicle>, 'optionals'> & {
  optionals?: { name: string }[]
}

export const vehicleService = {
  getAll: (filters: FilterOptions = {}) =>
    api.get<Vehicle[]>(`/vehicles${buildQueryString(filters)}`),

  getById: (id: string) =>
    api.get<Vehicle>(`/vehicles/${id}`),

  create: (data: VehicleInput) =>
    api.post<Vehicle>('/vehicles', data),

  update: (id: string, data: VehicleInput) =>
    api.put<Vehicle>(`/vehicles/${id}`, data),

  delete: (id: string) =>
    api.delete<{ message: string }>(`/vehicles/${id}`),

  uploadImages: (id: string, files: FileList) => {
    const formData = new FormData()
    Array.from(files).forEach(file => formData.append('images[]', file))
    return api.post<{ images: Vehicle['images'] }>(`/vehicles/${id}/images`, formData)
  },

  deleteImage: (vehicleId: string, imageId: string) =>
    api.delete<{ message: string }>(`/vehicles/${vehicleId}/images/${imageId}`),

  getBrands: () =>
    api.get<string[]>('/vehicles/brands'),

  getStats: () =>
    api.get<{ total: number; available: number; sold: number; featured: number }>('/vehicles/stats'),
}

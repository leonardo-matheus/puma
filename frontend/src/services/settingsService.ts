import { api } from './api'
import type { Settings, Seller, Stats } from '@/types'

export const settingsService = {
  get: () =>
    api.get<Settings>('/settings'),

  update: (data: Partial<Settings>) =>
    api.put<Settings>('/settings', data),

  getSellers: () =>
    api.get<Seller[]>('/sellers'),

  createSeller: (data: Omit<Seller, 'id' | 'createdAt'>) =>
    api.post<Seller>('/sellers', data),

  updateSeller: (id: string, data: Partial<Seller>) =>
    api.put<Seller>(`/sellers/${id}`, data),

  deleteSeller: (id: string) =>
    api.delete<{ message: string }>(`/sellers/${id}`),

  getStats: () =>
    api.get<Stats>('/stats'),
}

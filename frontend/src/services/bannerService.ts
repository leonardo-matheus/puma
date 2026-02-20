import { api } from './api'
import type { Banner } from '@/types'

export const bannerService = {
  getAll: () =>
    api.get<Banner[]>('/banners'),

  getById: (id: string) =>
    api.get<Banner>(`/banners/${id}`),

  create: (data: FormData | Partial<Banner>) =>
    api.post<Banner>('/banners', data),

  update: (id: string, data: FormData | Partial<Banner>) =>
    api.put<Banner>(`/banners/${id}`, data),

  delete: (id: string) =>
    api.delete<{ message: string }>(`/banners/${id}`),
}

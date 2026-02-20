import { api } from './api'
import type { Contact } from '@/types'

export interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
  vehicleId?: string
}

export const contactService = {
  getAll: () =>
    api.get<Contact[]>('/contacts'),

  getById: (id: string) =>
    api.get<Contact>(`/contacts/${id}`),

  create: (data: ContactFormData) =>
    api.post<Contact>('/contacts', data),

  markAsRead: (id: string) =>
    api.put<Contact>(`/contacts/${id}/read`),

  delete: (id: string) =>
    api.delete<{ message: string }>(`/contacts/${id}`),

  getUnreadCount: () =>
    api.get<{ count: number }>('/contacts/unread-count'),
}

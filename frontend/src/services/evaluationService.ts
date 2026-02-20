import { api } from './api'
import type { Evaluation } from '@/types'

export interface EvaluationFormData {
  name: string
  email: string
  phone: string
  brand: string
  model: string
  year: number
  mileage: number
  description?: string
}

export const evaluationService = {
  getAll: () =>
    api.get<Evaluation[]>('/evaluations'),

  getById: (id: string) =>
    api.get<Evaluation>(`/evaluations/${id}`),

  create: (data: EvaluationFormData) =>
    api.post<Evaluation>('/evaluations', data),

  updateStatus: (id: string, status: string) =>
    api.put<Evaluation>(`/evaluations/${id}/status`, { status }),

  delete: (id: string) =>
    api.delete<{ message: string }>(`/evaluations/${id}`),

  getPendingCount: () =>
    api.get<{ count: number }>('/evaluations/pending-count'),
}

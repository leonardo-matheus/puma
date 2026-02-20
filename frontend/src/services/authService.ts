import { api } from './api'
import type { User, AuthResponse } from '@/types'

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password })
    localStorage.setItem('auth-token', response.token)
    return response
  },

  logout: async (): Promise<void> => {
    await api.post<{ message: string }>('/auth/logout')
    localStorage.removeItem('auth-token')
  },

  me: () =>
    api.get<User>('/auth/me'),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post<{ message: string }>('/auth/change-password', { currentPassword, newPassword }),

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth-token')
  },
}

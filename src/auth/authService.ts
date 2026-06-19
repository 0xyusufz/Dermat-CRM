import { API_BASE_URL } from '@/api/client'
import type { User } from './types'

export interface AuthResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
  }
}

export const authService = {
  async getMe(signal?: AbortSignal): Promise<AuthResponse<{ user: User }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        signal,
      })

      if (response.status === 401 || response.status === 403) {
        return { success: false, error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } }
      }

      if (!response.ok) {
        return { success: false, error: { message: `Request failed with status ${response.status}` } }
      }

      const json = await response.json()

      if (!json.success) {
        return { success: false, error: { message: json.error?.message || 'Authentication failed' } }
      }

      return { success: true, data: json.data }
      // return {
      //   success: true,
      //   data: {
      //     user: json.user
      //   }
      // }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw err // Let AbortError propagate so React can handle it
      }
      return { success: false, error: { message: err.message || 'Network error', code: 'NETWORK_ERROR' } }
    }
  },

  async login(credentials: any): Promise<AuthResponse<{ user: User }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
      })

      if (response.status === 401) {
        return { success: false, error: { message: 'Invalid credentials', code: 'UNAUTHORIZED' } }
      }

      if (!response.ok) {
        return { success: false, error: { message: `Request failed with status ${response.status}` } }
      }

      const json = await response.json()

      if (!json.success) {
        return { success: false, error: { message: json.error?.message || 'Login failed' } }
      }

      return { success: true, data: json.data }
      // return {
      //   success: true,
      //   data: {
      //     user: json.user
      //   }
      // }
    } catch (err: any) {
      return { success: false, error: { message: err.message || 'Network error', code: 'NETWORK_ERROR' } }
    }
  },

  async logout(): Promise<AuthResponse<null>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (!response.ok) {
        return { success: false, error: { message: `Logout failed with status ${response.status}` } }
      }

      return { success: true, data: null }
    } catch (err: any) {
      return { success: false, error: { message: err.message || 'Network error', code: 'NETWORK_ERROR' } }
    }
  },
}

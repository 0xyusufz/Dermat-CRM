import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import { authService } from './authService'

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  const { state, retryInitialization } = context

  const login = async (credentials: any) => {
    // In Phase 1 we just provide the API abstraction. 
    // State integration for login/logout happens in Phase 2 when the Login Page is built.
    return authService.login(credentials)
  }

  const logout = async () => {
    return authService.logout()
  }

  return {
    user: state.user,
    isAuthenticated: state.status === 'authenticated',
    isLoading: state.status === 'loading' || state.status === 'idle',
    status: state.status,
    error: state.error,
    login,
    logout,
    retryInitialization,
  }
}

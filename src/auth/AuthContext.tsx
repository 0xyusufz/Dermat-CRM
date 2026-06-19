import { createContext, useCallback, useEffect, useReducer, type ReactNode } from 'react'
import { authService } from './authService'
import type { AuthAction, AuthState } from './types'
import { StartupLoader } from '@/components/shared/StartupLoader'

const initialState: AuthState = {
  status: 'idle',
  user: null,
  error: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'CHECK_SESSION_START':
      return { ...state, status: 'loading', error: null }
    case 'SESSION_RESTORED':
      return { ...state, status: 'authenticated', user: action.payload, error: null }
    case 'SESSION_REJECTED':
      return { ...state, status: 'unauthenticated', user: null, error: null }
    case 'SESSION_ERROR':
      return { ...state, status: 'error', error: action.payload }
    default:
      return state
  }
}

export const AuthContext = createContext<{
  state: AuthState
  retryInitialization: () => void
} | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const initializeAuth = useCallback(async (signal?: AbortSignal) => {
    dispatch({ type: 'CHECK_SESSION_START' })

    const response = await authService.getMe(signal)

    // If the request was aborted, don't update state
    if (signal?.aborted) return

    if (response.success && response.data) {
      dispatch({ type: 'SESSION_RESTORED', payload: response.data.user })
    } else if (response.error?.code === 'UNAUTHORIZED') {
      dispatch({ type: 'SESSION_REJECTED' })
    } else {
      dispatch({ type: 'SESSION_ERROR', payload: response.error?.message || 'Unknown error' })
    }
  }, [])

  useEffect(() => {
    // We use an AbortController to handle React 18 StrictMode double-invocations
    const controller = new AbortController()

    initializeAuth(controller.signal)

    return () => {
      controller.abort()
    }
  }, [initializeAuth])

  // While in loading state, show the startup loader instead of rendering the app
  // This prevents unauthenticated UI from flashing before the session is verified
  if (state.status === 'idle' || state.status === 'loading') {
    return <StartupLoader />
  }

  // If there's a network error during startup, show the error state with a retry button
  if (state.status === 'error') {
    return <StartupLoader error={state.error} onRetry={() => initializeAuth()} />
  }

  return (
    <AuthContext.Provider value={{ state, retryInitialization: initializeAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

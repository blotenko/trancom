'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Auth0Client, createAuth0Client, User } from '@auth0/auth0-spa-js'

interface AuthContextType {
  isLoading: boolean
  isAuthenticated: boolean
  user?: User
  loginWithRedirect: () => Promise<void>
  logout: () => void
  getAccessTokenSilently: () => Promise<string>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [auth0Client, setAuth0Client] = useState<Auth0Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | undefined>()

  useEffect(() => {
    const initAuth0 = async () => {
      try {
        const client = await createAuth0Client({
          domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN!,
          clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!,
          authorizationParams: {
          redirect_uri: 'http://localhost:3000'
          //audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
          },
        })

        setAuth0Client(client)

        if (
          window.location.search.includes('code=') &&
          window.location.search.includes('state=')
        ) {
          const { appState } = await client.handleRedirectCallback()

          const authenticated = await client.isAuthenticated()
          setIsAuthenticated(authenticated)

          if (authenticated) {
            const user = await client.getUser()
            setUser(user)
          }

          //  Redirect to intended page
          if (appState?.returnTo) {
            window.location.href = appState.returnTo
          } else {
            window.location.href = '/'
          }

          return
        }

        // Otherwise, normal auth check
        const authenticated = await client.isAuthenticated()
        setIsAuthenticated(authenticated)

        if (authenticated) {
          const user = await client.getUser()
          setUser(user)
        }
      } catch (error) {
        console.error('Auth0 initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth0()
  }, [])

   const loginWithRedirect = async () => {
    if (!auth0Client) return
    await auth0Client.loginWithRedirect({
      appState: {
        returnTo: '/dashboard',
      },
    })
  }

  const logout = () => {
    if (!auth0Client) return
    auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    })
  }

  const getAccessTokenSilently = async () => {
    if (!auth0Client) throw new Error('Auth0 client not initialized')
    return await auth0Client.getTokenSilently()
  }

  const value: AuthContextType = {
    isLoading,
    isAuthenticated,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
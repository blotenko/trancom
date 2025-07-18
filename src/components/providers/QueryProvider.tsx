'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

interface QueryProviderProps {
  children: ReactNode
}

async function throwIfResNotOk(res: Response) {
  if (res.status === 401) {
    // Handle 401 errors specifically
    throw new Error('Unauthorized')
  }
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }
}

export async function apiRequest(
  method: string,
  url: string,
  body?: any
): Promise<Response> {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('auth_token') 
    : null

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  })

  await throwIfResNotOk(response)
  return response
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            queryFn: async ({ queryKey }) => {
              const response = await apiRequest('GET', queryKey[0] as string)
              return response.json()
            },
            retry: (failureCount, error: any) => {
              if (error?.message === 'Unauthorized') {
                return false
              }
              return failureCount < 3
            },
            staleTime: 1000 * 60 * 5, // 5 minutes
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
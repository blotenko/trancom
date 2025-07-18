'use client'

import { QueryClient } from '@tanstack/react-query'

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`)
  }
}

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem('auth0_token')
  
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })
  
  await throwIfResNotOk(response)
  return response
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => (context: { queryKey: any[] }) => Promise<T | null> = ({ on401 }) => {
  return async ({ queryKey }) => {
    const endpoint = queryKey[0] as string
    
    try {
      const response = await apiRequest(endpoint)
      return await response.json()
    } catch (error: any) {
      if (error.message.includes('401') && on401 === "returnNull") {
        return null
      }
      throw error
    }
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      retry: (failureCount, error: any) => {
        if (error?.message?.includes('401')) return false
        return failureCount < 3
      },
    },
  },
})
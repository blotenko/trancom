'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../components/auth/AuthProvider'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import Dashboard from '../components/pages/Dashboard'


const queryClient = new QueryClient()

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </AuthProvider>
    </QueryClientProvider>
  )
}
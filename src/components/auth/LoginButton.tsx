'use client'

import { useAuth } from './AuthProvider'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

export function LoginButton() {
  const { isLoading, loginWithRedirect } = useAuth()

  if (isLoading) {
    return (
      <Button disabled className="w-full">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </Button>
    )
  }

  return (
    <Button onClick={loginWithRedirect} className="w-full bg-blue-600 hover:bg-blue-700">
      Sign In with Auth0
    </Button>
  )
}
'use client'

import { useAuth } from '../auth/AuthProvider'
import { Button } from '../ui/button'
import { Home, Users, Settings } from 'lucide-react'

export function MobileNav() {
  const { user } = useAuth()
  const userRole = user?.["https://logiflow.app/role"] || "customer"

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center py-2 text-blue-600"
        >
          <Home className="w-5 h-5" />
          <span className="text-xs mt-1">Home</span>
        </Button>
        
        {userRole === "manager" && (
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center py-2 text-gray-600"
          >
            <Users className="w-5 h-5" />
            <span className="text-xs mt-1">Team</span>
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center py-2 text-gray-600"
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs mt-1">Settings</span>
        </Button>
      </div>
    </div>
  )
}
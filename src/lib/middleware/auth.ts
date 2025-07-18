import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { storage } from '@/lib/storage'

export async function authMiddleware(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return null
    }

    // In a real implementation, you would verify the Auth0 JWT token
    // For now, we'll decode it and extract the user info
    const decoded = jwt.decode(token) as any
    
    if (!decoded || !decoded.sub) {
      return null
    }

    // Get or create user from database
    let user = await storage.getUserByAuth0Id(decoded.sub)
    
    if (!user) {
      // Create user if doesn't exist
      user = await storage.createUser({
        auth0Id: decoded.sub,
        username: decoded.nickname || decoded.email,
        email: decoded.email,
        name: decoded.name || decoded.email,
        role: decoded["https://logiflow.app/role"] || "customer",
      })
    }

    return user
  } catch (error) {
    console.error('Auth middleware error:', error)
    return null
  }
}
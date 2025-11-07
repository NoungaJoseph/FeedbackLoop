'use client'

import { useState, useEffect } from 'react'
import { User, authUtils } from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = authUtils.getUser()
    setUser(savedUser)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const user = await authUtils.login(email, password)
    setUser(user)
    return user
  }

  const signup = async (email: string, name: string, password: string) => {
    const user = await authUtils.signup(email, name, password)
    setUser(user)
    return user
  }

  const logout = () => {
    authUtils.logout()
    setUser(null)
  }

  return {
    user,
    isLoading,
    isLoggedIn: user !== null,
    isAdmin: user?.isAdmin ?? false,
    login,
    signup,
    logout,
  }
}

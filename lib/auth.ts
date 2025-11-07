// Client-side authentication utilities

export interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
}

const USER_STORAGE_KEY = 'feedbackloop_user'
const TOKEN_STORAGE_KEY = 'feedbackloop_token'

export const authUtils = {
  // Save user to localStorage
  saveUser: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    }
  },

  // Get user from localStorage
  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(USER_STORAGE_KEY)
      return user ? JSON.parse(user) : null
    }
    return null
  },

  // Clear user from localStorage
  clearUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_STORAGE_KEY)
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return authUtils.getUser() !== null
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    const user = authUtils.getUser()
    return user?.isAdmin ?? false
  },

  // Login user
  login: async (email: string, password: string): Promise<User> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Login failed')
    }

    const data = await response.json()
    authUtils.saveUser(data.user)
    return data.user
  },

  // Signup user
  signup: async (email: string, name: string, password: string): Promise<User> => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Signup failed')
    }

    const data = await response.json()
    authUtils.saveUser(data.user)
    return data.user
  },

  // Logout user
  logout: () => {
    authUtils.clearUser()
  },
}

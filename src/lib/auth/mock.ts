// Mock auth for testing with placeholder Supabase credentials
export interface MockUser {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
  }
}

export interface MockSession {
  user: MockUser
  access_token: string
}

const MOCK_SESSION_KEY = 'golf-heroes-mock-session'

export const mockAuth = {
  setSession: (email: string, fullName: string) => {
    if (typeof window === 'undefined') return

    const mockSession: MockSession = {
      user: {
        id: 'mock-' + Math.random().toString(36).substr(2, 9),
        email,
        user_metadata: { full_name: fullName },
      },
      access_token: 'mock-token-' + Date.now(),
    }

    const sessionJSON = JSON.stringify(mockSession)
    
    // Store in localStorage for client-side access
    localStorage.setItem(MOCK_SESSION_KEY, sessionJSON)
    
    // Store in cookie for server-side middleware access
    // Set cookie to expire in 30 days
    const date = new Date()
    date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000)
    const expires = 'expires=' + date.toUTCString()
    document.cookie = MOCK_SESSION_KEY + '=' + encodeURIComponent(sessionJSON) + '; ' + expires + '; path=/'
  },

  getSession: (): MockSession | null => {
    if (typeof window === 'undefined') return null

    const session = localStorage.getItem(MOCK_SESSION_KEY)
    return session ? JSON.parse(session) : null
  },

  clearSession: () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(MOCK_SESSION_KEY)
    
    // Clear cookie
    document.cookie = MOCK_SESSION_KEY + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  },

  isLoggedIn: (): boolean => {
    return mockAuth.getSession() !== null
  },
}

'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user || null)

      if (user) {
        const { data: profile } = (await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()) as any
        setIsAdmin((profile as any)?.role === 'admin')
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <nav className="bg-[#1a3a2a] text-[#fafaf7] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
            ⛳ Golf Heroes
          </Link>

          <div className="flex gap-6 items-center">
            {!user ? (
              <>
                <Link href="/login" className="hover:text-[#c9a84c] transition">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-[#c9a84c] text-[#1a3a2a] px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="hover:text-[#c9a84c] transition">
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="hover:text-[#c9a84c] transition">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

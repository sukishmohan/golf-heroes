'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscribers: 0,
    totalCharities: 0,
    pendingWinners: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdminAndLoadStats = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // Check if admin
      const { data: profile } = (await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()) as any

      if ((profile as any)?.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      // Fetch stats
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })

      const { count: activeCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('subscription_status', 'active')

      const { count: charityCount } = await supabase
        .from('charities')
        .select('*', { count: 'exact' })
        .eq('active', true)

      const { count: pendingCount } = await supabase
        .from('draw_results')
        .select('*', { count: 'exact' })
        .eq('payment_status', 'pending')

      setStats({
        totalUsers: userCount || 0,
        activeSubscribers: activeCount || 0,
        totalCharities: charityCount || 0,
        pendingWinners: pendingCount || 0,
      })

      setLoading(false)
    }

    checkAdminAndLoadStats()
  }, [router])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p>Loading admin dashboard...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-[#1a3a2a] mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-2">Total Users</p>
          <p className="text-4xl font-bold text-[#c9a84c]">{stats.totalUsers}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-2">Active Subscribers</p>
          <p className="text-4xl font-bold text-green-600">{stats.activeSubscribers}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-2">Partner Charities</p>
          <p className="text-4xl font-bold text-blue-600">{stats.totalCharities}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-2">Pending Winners</p>
          <p className="text-4xl font-bold text-orange-600">{stats.pendingWinners}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/users"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-bold text-[#1a3a2a] mb-2">Users</h2>
          <p className="text-gray-600 mb-4">Manage user accounts and subscriptions</p>
          <button className="text-[#c9a84c] font-bold">Go to Users →</button>
        </Link>

        <Link
          href="/admin/draws"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-bold text-[#1a3a2a] mb-2">Draws</h2>
          <p className="text-gray-600 mb-4">Configure and publish monthly draws</p>
          <button className="text-[#c9a84c] font-bold">Go to Draws →</button>
        </Link>

        <Link
          href="/admin/charities"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-bold text-[#1a3a2a] mb-2">Charities</h2>
          <p className="text-gray-600 mb-4">Manage partner charities and organizations</p>
          <button className="text-[#c9a84c] font-bold">Go to Charities →</button>
        </Link>

        <Link
          href="/admin/winners"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-bold text-[#1a3a2a] mb-2">Winners</h2>
          <p className="text-gray-600 mb-4">Review and verify winner claims ({stats.pendingWinners})</p>
          <button className="text-[#c9a84c] font-bold">Go to Winners →</button>
        </Link>

        <Link
          href="/admin/reports"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-bold text-[#1a3a2a] mb-2">Reports</h2>
          <p className="text-gray-600 mb-4">View analytics and performance metrics</p>
          <button className="text-[#c9a84c] font-bold">Go to Reports →</button>
        </Link>

        <Link
          href="/dashboard"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-bold text-[#1a3a2a] mb-2">Dashboard</h2>
          <p className="text-gray-600 mb-4">Return to personal dashboard</p>
          <button className="text-[#c9a84c] font-bold">Go to Dashboard →</button>
        </Link>
      </div>
    </div>
  )
}

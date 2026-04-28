'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AdminReportsPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCharityDonations: 0,
    averageWinValue: 0,
    totalWinners: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAndFetch = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = (await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()) as any

      if ((profile as any)?.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      // Get revenue stats
      const { data: profiles } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .eq('subscription_status', 'active')

      let totalRevenue = 0
      profiles?.forEach((p: any) => {
        if (p.subscription_plan === 'monthly') totalRevenue += 9.99
        else if (p.subscription_plan === 'yearly') totalRevenue += 99.99 / 12
      })

      // Get winners stats
      const { data: results } = await supabase
        .from('draw_results')
        .select('prize_amount, payment_status')

      let totalWinnings = 0
      let totalWinners = results?.length || 0
      results?.forEach((r: any) => {
        totalWinnings += r.prize_amount
      })

      const avgWin = totalWinners > 0 ? totalWinnings / totalWinners : 0

      // Get charity donations (estimated as 10% of subscription fees)
      const charityDonations = totalRevenue * 0.1

      setStats({
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalCharityDonations: Math.round(charityDonations * 100) / 100,
        averageWinValue: Math.round(avgWin * 100) / 100,
        totalWinners,
      })

      setLoading(false)
    }

    checkAndFetch()
  }, [router])

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#1a3a2a]">Reports & Analytics</h1>
        <Link href="/admin" className="text-[#c9a84c] font-bold">
          ← Back to Admin
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-2">Monthly Revenue</p>
          <p className="text-4xl font-bold text-[#c9a84c]">${stats.totalRevenue}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-2">Estimated Charity Donations</p>
          <p className="text-4xl font-bold text-green-600">${stats.totalCharityDonations}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-2">Total Winners</p>
          <p className="text-4xl font-bold text-blue-600">{stats.totalWinners}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-2">Average Win Value</p>
          <p className="text-4xl font-bold text-orange-600">${stats.averageWinValue}</p>
        </div>
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-[#1a3a2a] mb-4">Advanced Analytics Coming Soon</h2>
        <p className="text-gray-600">
          More detailed reports including charts, user growth trends, and detailed charity impact
          metrics will be available in future updates.
        </p>
      </div>
    </div>
  )
}

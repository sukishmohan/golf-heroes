'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Draw } from '@/types'

export default function AdminDrawsPage() {
  const [draws, setDraws] = useState<Draw[]>([])
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

      const { data: drawsData } = await supabase
        .from('draws')
        .select('*')
        .order('draw_month', { ascending: false })

      setDraws(drawsData || [])
      setLoading(false)
    }

    checkAndFetch()
  }, [router])

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#1a3a2a]">Draws Management</h1>
        <Link href="/admin" className="text-[#c9a84c] font-bold">
          ← Back to Admin
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1a3a2a] text-[#fafaf7]">
            <tr>
              <th className="px-6 py-3 text-left">Draw Month</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Winning Numbers</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Subscribers</th>
            </tr>
          </thead>
          <tbody>
            {draws.map((draw) => (
              <tr key={draw.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{draw.draw_month}</td>
                <td className="px-6 py-3 capitalize">{draw.draw_type}</td>
                <td className="px-6 py-3 text-sm">{draw.winning_numbers.join(', ')}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${draw.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {draw.status}
                  </span>
                </td>
                <td className="px-6 py-3">{draw.total_subscribers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {draws.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No draws found. Create your first draw.</p>
        </div>
      )}
    </div>
  )
}

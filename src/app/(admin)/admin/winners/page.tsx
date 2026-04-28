'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { DrawResult } from '@/types'

export default function AdminWinnersPage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('pending')
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

      let query = supabase.from('draw_results').select('*')

      if (filter !== 'all') {
        query = query.eq('payment_status', filter)
      }

      const { data: resultsData } = await query.order('created_at', { ascending: false })

      setResults(resultsData || [])
      setLoading(false)
    }

    checkAndFetch()
  }, [router, filter])

  const updateStatus = async (resultId: string, newStatus: string) => {
    const supabase = createClient()
    await (supabase.from('draw_results') as any).update({ payment_status: newStatus }).eq('id', resultId)

    setResults(results.map((r) => (r.id === resultId ? { ...r, payment_status: newStatus } : r)))
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#1a3a2a]">Winner Verification</h1>
        <Link href="/admin" className="text-[#c9a84c] font-bold">
          ← Back to Admin
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {['all', 'pending', 'verified', 'paid', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === status
                ? 'bg-[#c9a84c] text-[#1a3a2a]'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1a3a2a] text-[#fafaf7]">
            <tr>
              <th className="px-6 py-3 text-left">Draw</th>
              <th className="px-6 py-3 text-left">Match Count</th>
              <th className="px-6 py-3 text-left">Prize Amount</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm">{result.draw_id?.slice(0, 8)}</td>
                <td className="px-6 py-3 font-bold">{result.match_count}</td>
                <td className="px-6 py-3">${result.prize_amount.toFixed(2)}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      result.payment_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : result.payment_status === 'verified'
                          ? 'bg-blue-100 text-blue-700'
                          : result.payment_status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {result.payment_status}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    {result.payment_status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(result.id, 'verified')}
                          className="text-green-600 hover:underline text-sm font-semibold"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => updateStatus(result.id, 'rejected')}
                          className="text-red-600 hover:underline text-sm font-semibold"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {result.payment_status === 'verified' && (
                      <button
                        onClick={() => updateStatus(result.id, 'paid')}
                        className="text-blue-600 hover:underline text-sm font-semibold"
                      >
                        Mark Paid
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No results found for this filter.</p>
        </div>
      )}
    </div>
  )
}

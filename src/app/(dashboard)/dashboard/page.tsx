'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { mockAuth } from '@/lib/auth/mock'
import type { Profile, GolfScore } from '@/types'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [scores, setScores] = useState<GolfScore[]>([])
  const [loading, setLoading] = useState(true)
  const [newScore, setNewScore] = useState('')
  const [newDate, setNewDate] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Use mock session if Supabase auth fails
      const mockSession = mockAuth.getSession()
      const currentUser = user || mockSession?.user

      if (!currentUser) {
        router.push('/login')
        return
      }

      // Create mock profile for testing
      const mockProfile: Profile = {
        id: currentUser.id,
        email: currentUser.email || 'test@example.com',
        full_name: currentUser.user_metadata?.full_name || 'Test User',
        role: 'subscriber',
        charity_id: '1',
        subscription_status: 'active',
        stripe_customer_id: null,
        subscription_plan: null,
        subscription_end_date: null,
        charity_percentage: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      setProfile(mockProfile)
      setScores([])
      setLoading(false)
    }

    fetchData()
  }, [router])

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!newScore || !newDate) {
      setError('Please enter both score and date')
      return
    }

    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: parseInt(newScore),
          scoreDate: newDate,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to add score')
        return
      }

      const data = await response.json()
      setScores([data.score, ...scores])
      setNewScore('')
      setNewDate('')
      setSuccess('Score added successfully!')

      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('An error occurred')
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-red-600">Error loading dashboard</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-[#1a3a2a] mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-[#1a3a2a] mb-4">Your Account</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold text-[#1a3a2a]">{profile.full_name || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-[#1a3a2a]">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Subscription Status</p>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    profile.subscription_status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {profile.subscription_status}
                </span>
              </div>
            </div>
            {profile.subscription_status !== 'active' && (
              <button
                onClick={() => router.push('/subscribe')}
                className="w-full bg-[#c9a84c] text-[#1a3a2a] py-2 rounded-lg font-bold hover:bg-opacity-90 transition mt-4"
              >
                Subscribe Now
              </button>
            )}
          </div>
        </div>

        {/* Score Entry */}
        {profile.subscription_status === 'active' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-[#1a3a2a] mb-4">Add Score</h2>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
            {success && (
              <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">{success}</div>
            )}

            <form onSubmit={handleAddScore} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Score (1-45)</label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9a84c] text-[#1a3a2a]"
                  placeholder="Enter score"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9a84c] text-[#1a3a2a]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#c9a84c] text-[#1a3a2a] py-2 rounded-lg font-bold hover:bg-opacity-90 transition"
              >
                Add Score
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Scores List */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-[#1a3a2a] mb-4">Your Scores ({scores.length}/5)</h2>

        {scores.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No scores yet. Add your first score above!</p>
        ) : (
          <div className="space-y-3">
            {scores.map((score) => (
              <div key={score.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-[#1a3a2a]">Score: {score.score}</p>
                  <p className="text-sm text-gray-600">{new Date(score.score_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

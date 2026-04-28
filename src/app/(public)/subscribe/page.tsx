'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SubscribePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      const { data: profileData } = (await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()) as any

      setProfile(profileData)

      if ((profileData as any)?.subscription_status === 'active') {
        router.push('/dashboard')
      }

      setLoading(false)
    }

    checkAuth()
  }, [router])

  const handleCheckout = async (plan: 'monthly' | 'yearly') => {
    setCheckoutLoading(true)
    setError('')

    try {
      const priceId =
        plan === 'monthly'
          ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID
          : process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID

      if (!priceId) {
        setError('Pricing is not configured. Please contact support.')
        setCheckoutLoading(false)
        return
      }

      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          email: user?.email,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to start checkout')
        setCheckoutLoading(false)
        return
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (err) {
      setError('An error occurred. Please try again.')
      setCheckoutLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-[#1a3a2a] mb-4 text-center">Choose Your Plan</h1>
      <p className="text-gray-600 text-center mb-12 text-lg">
        Start your Golf Heroes journey. Pick a plan that works for you.
      </p>

      {error && (
        <div className="max-w-md mx-auto mb-8 bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      )}

      {/* Current Charity Info */}
      {profile?.charity_id && (
        <div className="max-w-md mx-auto mb-8 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">You've selected to support:</p>
          <p className="font-semibold text-[#1a3a2a]">{profile.charity_id}</p>
          <p className="text-xs text-gray-500 mt-2">
            {profile.charity_percentage || 10}% of your subscription will be donated
          </p>
        </div>
      )}

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Monthly Plan */}
        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-transparent hover:border-[#c9a84c]">
          <h2 className="text-2xl font-bold text-[#1a3a2a] mb-2">Monthly</h2>
          <p className="text-gray-600 mb-4 text-sm">Perfect for getting started</p>

          <div className="mb-6">
            <span className="text-5xl font-bold text-[#c9a84c]">$9.99</span>
            <span className="text-gray-600">/month</span>
          </div>

          <ul className="space-y-3 mb-8 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-[#c9a84c]">✓</span> Enter golf scores
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#c9a84c]">✓</span> Participate in monthly draws
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#c9a84c]">✓</span> Win prizes
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#c9a84c]">✓</span> Support your charity
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#c9a84c]">✓</span> Cancel anytime
            </li>
          </ul>

          <button
            onClick={() => handleCheckout('monthly')}
            disabled={checkoutLoading}
            className="w-full bg-[#c9a84c] text-[#1a3a2a] py-3 rounded-lg font-bold hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {checkoutLoading ? 'Processing...' : 'Subscribe Monthly'}
          </button>
        </div>

        {/* Yearly Plan */}
        <div className="bg-gradient-to-b from-[#c9a84c] to-[#a67c3a] rounded-lg shadow-lg p-8 text-[#1a3a2a] relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-[#1a3a2a] text-[#c9a84c] px-3 py-1 rounded-full text-xs font-bold">
            SAVE 20%
          </div>

          <h2 className="text-2xl font-bold mb-2">Yearly</h2>
          <p className="mb-4 text-sm opacity-90">Best value. Full year access.</p>

          <div className="mb-6">
            <span className="text-5xl font-bold">$99.99</span>
            <span className="opacity-90">/year</span>
          </div>

          <ul className="space-y-3 mb-8 text-sm opacity-95">
            <li className="flex items-center gap-2">
              <span>✓</span> Enter golf scores
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span> Participate in monthly draws
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span> Win prizes
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span> Support your charity
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span> Cancel anytime
            </li>
          </ul>

          <button
            onClick={() => handleCheckout('yearly')}
            disabled={checkoutLoading}
            className="w-full bg-[#1a3a2a] text-[#c9a84c] py-3 rounded-lg font-bold hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {checkoutLoading ? 'Processing...' : 'Subscribe Yearly'}
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-[#1a3a2a] mb-6">Subscription FAQs</h3>

        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-[#1a3a2a] mb-2">Can I change my plan later?</h4>
            <p className="text-gray-600 text-sm">
              Yes, you can upgrade or downgrade your plan from your dashboard at any time.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#1a3a2a] mb-2">What payment methods do you accept?</h4>
            <p className="text-gray-600 text-sm">
              We accept all major credit cards (Visa, Mastercard, American Express, etc.) through Stripe.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#1a3a2a] mb-2">When will I be charged?</h4>
            <p className="text-gray-600 text-sm">
              You'll be charged today, then automatically on the same date each month or year based on your plan.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#1a3a2a] mb-2">Can I cancel anytime?</h4>
            <p className="text-gray-600 text-sm">
              Absolutely. You can cancel from your settings page. No questions asked.
            </p>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="text-center mt-12">
        <Link href="/" className="text-[#c9a84c] font-bold hover:underline">
          ← Back Home
        </Link>
      </div>
    </div>
  )
}

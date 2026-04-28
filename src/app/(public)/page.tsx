'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Home() {
  const [charities, setCharities] = useState<any[]>([])
  const [subscribers, setSubscribers] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch featured charities
      const { data: charitiesData } = await supabase
        .from('charities')
        .select('*')
        .eq('featured', true)
        .eq('active', true)
        .limit(3)

      setCharities(charitiesData || [])

      // Get subscriber count
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('subscription_status', 'active')

      setSubscribers(count || 0)
    }

    fetchData()
  }, [])

  return (
    <div className="flex flex-col gap-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1a3a2a] to-[#2d5a45] text-[#fafaf7] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Play Golf.<br />
            Win Prizes.<br />
            <span className="text-[#c9a84c]">Give Back.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Every score you enter contributes to meaningful change. Join our community of golfers
            winning prizes while supporting the causes they care about.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/register"
              className="bg-[#c9a84c] text-[#1a3a2a] px-8 py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition"
            >
              Start Playing
            </Link>
            <Link
              href="/how-it-works"
              className="border-2 border-[#c9a84c] text-[#c9a84c] px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#c9a84c] hover:text-[#1a3a2a] transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-4xl font-bold text-[#c9a84c] mb-2">{subscribers.toLocaleString()}</div>
              <p className="text-gray-600">Active Players</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-4xl font-bold text-[#c9a84c] mb-2">$50K+</div>
              <p className="text-gray-600">Prize Pool Monthly</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-4xl font-bold text-[#c9a84c] mb-2">12</div>
              <p className="text-gray-600">Partner Charities</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#1a3a2a]">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="bg-[#c9a84c] text-[#1a3a2a] w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1a3a2a]">Subscribe</h3>
              <p className="text-gray-600">
                Choose your subscription plan and select a charity to support. Your contribution starts
                immediately.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="bg-[#c9a84c] text-[#1a3a2a] w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1a3a2a]">Play & Score</h3>
              <p className="text-gray-600">
                Enter your golf scores weekly. Keep track of your top 5 scores and watch them compete in
                our monthly draws.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="bg-[#c9a84c] text-[#1a3a2a] w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1a3a2a]">Win & Give</h3>
              <p className="text-gray-600">
                Win monthly prizes based on your scores matching our draw. Contribute to your charity
                without increasing your cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Charities */}
      {charities.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-[#1a3a2a]">Featured Charities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {charities.map((charity) => (
                <Link
                  key={charity.id}
                  href={`/charities?id=${charity.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
                >
                  {charity.image_url && (
                    <img src={charity.image_url} alt={charity.name} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-[#1a3a2a]">{charity.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{charity.description}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/charities"
                className="text-[#c9a84c] font-bold text-lg hover:underline"
              >
                View All Charities →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-[#1a3a2a] text-[#fafaf7] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join?</h2>
          <p className="text-xl mb-8 text-gray-200">
            Start your Golf Heroes journey today. Your first month matters.
          </p>
          <Link
            href="/register"
            className="bg-[#c9a84c] text-[#1a3a2a] px-8 py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  )
}

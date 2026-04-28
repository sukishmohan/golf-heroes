'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Charity } from '@/types'

export default function CharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([])
  const [filteredCharities, setFilteredCharities] = useState<Charity[]>([])
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Initialize with search params after mounting on client
  useEffect(() => {
    setMounted(true)
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    const id = params.get('id')
    if (id) {
      setSelectedId(id)
    }
  }, [])

  useEffect(() => {
    const fetchCharities = async () => {
      const supabase = createClient()
      const { data } = (await supabase
        .from('charities')
        .select('*')
        .eq('active', true)
        .order('featured', { ascending: false })
        .order('name', { ascending: true })) as any

      setCharities(data || [])
      setFilteredCharities(data || [])
    }

    fetchCharities()
  }, [])

  useEffect(() => {
    const filtered = charities.filter((charity) =>
      charity.name.toLowerCase().includes(search.toLowerCase()) ||
      (charity.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
    )
    setFilteredCharities(filtered)
  }, [search, charities])

  const selectedCharity = charities.find((c) => c.id === selectedId)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-[#1a3a2a] mb-8 text-center">
        Featured Charities & Organizations
      </h1>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search charities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9a84c] text-[#1a3a2a]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charity List */}
        <div className="lg:col-span-2">
          {filteredCharities.length === 0 ? (
            <p className="text-gray-600 text-center py-12">No charities found.</p>
          ) : (
            <div className="space-y-4">
              {filteredCharities.map((charity) => (
                <div
                  key={charity.id}
                  onClick={() => setSelectedId(charity.id)}
                  className={`p-6 rounded-lg cursor-pointer transition ${
                    selectedId === charity.id
                      ? 'bg-[#c9a84c] text-[#1a3a2a]'
                      : 'bg-white border border-gray-200 hover:border-[#c9a84c]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {charity.image_url && (
                      <img
                        src={charity.image_url}
                        alt={charity.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{charity.name}</h3>
                      {charity.featured && (
                        <span className="inline-block bg-[#c9a84c] text-[#1a3a2a] px-2 py-1 rounded text-xs font-semibold mb-2">
                          Featured
                        </span>
                      )}
                      <p className={`text-sm line-clamp-2 ${selectedId === charity.id ? 'text-[#1a3a2a]' : 'text-gray-600'}`}>
                        {charity.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Charity Details */}
        {selectedCharity && (
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8 h-fit">
            {selectedCharity.image_url && (
              <img
                src={selectedCharity.image_url}
                alt={selectedCharity.name}
                className="w-full h-48 rounded-lg object-cover mb-4"
              />
            )}
            <h2 className="text-2xl font-bold text-[#1a3a2a] mb-4">{selectedCharity.name}</h2>

            {selectedCharity.featured && (
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg mb-4 text-sm font-semibold">
                ⭐ Featured Charity
              </div>
            )}

            <p className="text-gray-600 mb-6">{selectedCharity.description}</p>

            {selectedCharity.website && (
              <a
                href={selectedCharity.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block text-center bg-[#c9a84c] text-[#1a3a2a] px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 transition"
              >
                Visit Website →
              </a>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-bold text-[#1a3a2a] mb-3">Why Support This Charity?</h3>
              <p className="text-sm text-gray-600">
                By selecting this charity, a percentage of your subscription fee will be donated
                directly to support their mission.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="mt-16 bg-gradient-to-r from-[#1a3a2a] to-[#2d5a45] text-[#fafaf7] rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
        <p className="mb-6 text-lg">
          Choose your charity and start your Golf Heroes journey today. Every score counts.
        </p>
        <a
          href="/register"
          className="inline-block bg-[#c9a84c] text-[#1a3a2a] px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition"
        >
          Join Now
        </a>
      </div>
    </div>
  )
}

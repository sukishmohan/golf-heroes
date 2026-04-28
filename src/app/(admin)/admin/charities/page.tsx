'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Charity } from '@/types'

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '', website: '', featured: false })
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

      const { data: charitiesData } = await supabase.from('charities').select('*').order('featured', { ascending: false })

      setCharities(charitiesData || [])
      setLoading(false)
    }

    checkAndFetch()
  }, [router])

  const handleAddCharity = async (e: React.FormEvent) => {
    e.preventDefault()

    const supabase = createClient()
    const { data } = (await supabase
      .from('charities')
      .insert({
        name: formData.name,
        description: formData.description,
        website: formData.website,
        featured: formData.featured,
      } as any)
      .select()
      .single()) as any

    if (data) {
      setCharities([...charities, data])
      setFormData({ name: '', description: '', website: '', featured: false })
      setShowForm(false)
    }
  }

  const handleToggleFeatured = async (charityId: string, featured: boolean) => {
    const supabase = createClient()
    await (supabase.from('charities') as any).update({ featured: !featured }).eq('id', charityId)

    setCharities(
      charities.map((c) => (c.id === charityId ? { ...c, featured: !featured } : c))
    )
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#1a3a2a]">Charities Management</h1>
        <Link href="/admin" className="text-[#c9a84c] font-bold">
          ← Back to Admin
        </Link>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#1a3a2a] mb-4">Add New Charity</h2>
          <form onSubmit={handleAddCharity} className="space-y-4">
            <input
              type="text"
              placeholder="Charity Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[#1a3a2a]"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[#1a3a2a]"
              rows={4}
            />
            <input
              type="url"
              placeholder="Website URL"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[#1a3a2a]"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              <span>Featured Charity</span>
            </label>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-[#c9a84c] text-[#1a3a2a] px-6 py-2 rounded-lg font-bold"
              >
                Add Charity
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#c9a84c] text-[#1a3a2a] px-6 py-2 rounded-lg font-bold mb-8"
        >
          + Add New Charity
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {charities.map((charity) => (
          <div key={charity.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-[#1a3a2a]">{charity.name}</h3>
                {charity.featured && (
                  <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold mt-2">
                    ⭐ Featured
                  </span>
                )}
              </div>
              <button
                onClick={() => handleToggleFeatured(charity.id, charity.featured)}
                className="text-[#c9a84c] font-bold text-sm hover:underline"
              >
                {charity.featured ? 'Unfeature' : 'Feature'}
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{charity.description}</p>
            {charity.website && (
              <a
                href={charity.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c9a84c] text-sm hover:underline"
              >
                {charity.website}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

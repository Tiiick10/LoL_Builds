'use client'
import { useEffect, useState } from 'react'
import API from '@/utils/axios'
import Link from 'next/link'

interface Build {
  id: number
  name: string
  role: string
  keystone: string
  keystone_icon_url: string
  champion: {
    name: string
    image_url: string
  }
  likes: number
  dislikes: number
  created_at: string
}

export default function BuildsPage() {
  const [builds, setBuilds] = useState<Build[]>([])
  const [roleFilter, setRoleFilter] = useState('')
  const [championFilter, setChampionFilter] = useState('')
  const [ordering, setOrdering] = useState('created_at')
  const [page, setPage] = useState(1)

  useEffect(() => {
  const fetchBuilds = async () => {
    try {
      const res = await API.get('builds/', {
        params: {
          page,
          role: roleFilter || undefined,
          'champion__name': championFilter || undefined,
          ordering
        }
      })

      const data = res.data.results || res.data
      setBuilds(data)
    } catch (err) {
      console.error('Error fetching builds:', err)
    }
  }

  fetchBuilds()
  }, [roleFilter, championFilter, ordering, page])

  return (
    <main className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">All Builds</h1>

      {/* Filters */}

      <div className="flex flex-wrap gap-4 mb-6">
        <select value={roleFilter} onChange={e => {
            setRoleFilter(e.target.value)
            setPage(1)
          }}
          className="bg-gray-800 px-4 py-2 rounded"
        > 
          <option value="">All Roles</option>
          <option value="top">Top</option>
          <option value="jungle">Jungle</option>
          <option value="mid">Mid</option>
          <option value="adc">ADC</option>
          <option value="support">Support</option>
        </select>

        <input
          type="text"
          placeholder="Champion name"
          value={championFilter}
          onChange={e => {
            setChampionFilter(e.target.value)
            setPage(1)
          }}
          className="bg-gray-800 px-4 py-2 rounded"
        />


        <select
          value={ordering}
          onChange={e => {
            setOrdering(e.target.value)
            setPage(1)
          }}
          className="bg-gray-800 px-4 py-2 rounded"
        >

          <option value="created_at">Newest</option>
          <option value="-created_at">Oldest</option>
          <option value="-likes">Most Liked</option>
        </select>
      </div>

      {/* Builds grid */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {builds.map((build) => (
          <div key={build.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={build.champion?.image_url}
                alt={build.champion?.name}
                className="w-16 h-16 rounded object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold">{build.name}</h2>
                <p className="text-sm text-gray-400">{build.champion?.name} • {build.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <img src={build.keystone_icon_url} alt={build.keystone} className="w-6 h-6" />
              <span className="text-sm">{build.keystone}</span>
            </div>
            <p className="text-sm text-gray-400">
              👍 {build.likes || 0} / 👎 {build.dislikes || 0}
            </p>
            <Link href={`/builds/${build.id}`}>
              <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white text-sm">
                See Build
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}

      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(p => p + 1)}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </main>
  )
}

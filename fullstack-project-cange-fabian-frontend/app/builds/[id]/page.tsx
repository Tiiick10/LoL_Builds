'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import API from '@/utils/axios'

export default function BuildDetailPage() {
  const { id } = useParams()
  const [build, setBuild] = useState<any>(null)

  useEffect(() => {
    const fetchBuild = async () => {
      try {
        const res = await API.get(`builds/${id}/`)
        setBuild(res.data)
      } catch (err) {
        console.error('Error loading build:', err)
      }
    }
    if (id) fetchBuild()
  }, [id])

  if (!build) return <p className="p-8 text-white">Loading build...</p>

  return (
    <main className="p-8 max-w-5xl mx-auto text-white space-y-10">
      {/* Title */}
      <h1 className="text-5xl font-bold text-center">{build.name}</h1>

      {/* Champion Info */}
      <section className="flex items-center gap-6 bg-gray-800 bg-opacity-40 p-6 rounded-lg">
        <img
          src={build.champion?.image_url}
          alt={build.champion?.name}
          className="w-32 h-32 rounded-lg object-cover border-2 border-indigo-500"
        />
        <div className="text-lg space-y-2">
          <p><strong>Champion:</strong> {build.champion?.name}</p>
          <p><strong>Role:</strong> {build.role}</p>
          <p><strong>Author:</strong> {build.author?.username || 'Unknown'}</p>
        </div>
      </section>

      {/* Description */}
      <section className="bg-gray-800 bg-opacity-40 p-6 rounded-lg">
        <h2 className="text-3xl font-semibold mb-4">Build Description</h2>
        <div
          className="prose prose-invert max-w-none text-white"
          dangerouslySetInnerHTML={{ __html: build.description }}
        />
      </section>

      {/* Runes */}
      <section className="bg-gray-800 bg-opacity-40 p-6 rounded-lg">
        <h2 className="text-3xl font-semibold mb-6">Runes</h2>

        {/* Primary */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Primary Path: {build.primary_path}</h3>
          <div className="flex items-center gap-3 mb-4">
            <img src={build.primary_path_icon_url} alt="Primary Path" className="w-10 h-10" />
            <img src={build.keystone_icon_url} alt="Keystone" className="w-10 h-10" />
            <span>{build.keystone}</span>
          </div>
          <div className="flex gap-4">
            {[1, 2, 3].map(i => (
              <img
                key={i}
                src={build[`primary_slot${i}_icon_url`]}
                alt={build[`primary_slot${i}`]}
                title={build[`primary_slot${i}`]}
                className="w-10 h-10"
              />
            ))}
          </div>
        </div>

        {/* Secondary */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Secondary Path: {build.secondary_path}</h3>
          <div className="flex items-center gap-3 mb-4">
            <img src={build.secondary_path_icon_url} alt="Secondary Path" className="w-10 h-10" />
          </div>
          <div className="flex gap-4">
            {[1, 2].map(i => (
              <img
                key={i}
                src={build[`secondary_slot${i}_icon_url`]}
                alt={build[`secondary_slot${i}`]}
                title={build[`secondary_slot${i}`]}
                className="w-10 h-10"
              />
            ))}
          </div>
        </div>

        {/* Shards */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Stat Shards</h3>
          <div className="flex gap-4">
            {['shard_offense', 'shard_flex', 'shard_defense'].map(key => (
              <img
                key={key}
                src={build[`${key}_icon_url`]}
                alt={build[key]}
                title={build[key]}
                className="w-8 h-8"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Likes & Dislikes */}
      <section className="bg-gray-800 bg-opacity-40 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Votes</h2>
        <p>👍 {build.likes || 0} / 👎 {build.dislikes || 0}</p>
      </section>

      {/* Comments */}
      <section className="bg-gray-800 bg-opacity-40 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {build.avis?.length > 0 ? (
          build.avis.map((a: any, i: number) => (
            <div key={i} className="border border-gray-600 p-4 rounded-md mb-4">
              <p className="text-sm text-gray-300 mb-2">
                <strong>{a.author?.username}</strong> — {new Date(a.date_poste).toLocaleString()}
              </p>
              <p>{a.commentaire}</p>
              <p className="text-sm mt-2 text-indigo-400">
                {a.positif ? '👍 Positive feedback' : '👎 Negative feedback'}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No comments yet.</p>
        )}
      </section>
    </main>
  )
}

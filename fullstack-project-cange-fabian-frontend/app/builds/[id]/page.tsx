'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import API from '@/utils/axios'
import { BsHandThumbsUp, BsHandThumbsDown, BsFillHouseDoorFill } from "react-icons/bs"
import axios from '@/utils/axios'
import Link from 'next/link'


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

      <div className="flex justify-center mb-6">
        <Link
          href="/"
          className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-white text-lg px-5 py-3 rounded-lg transition-all"
        >
          <BsFillHouseDoorFill size={24} />
          Home
        </Link>
      </div>

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

        {/* Primary Path */}

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

        {/* Secondary Path */}

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
        <h2 className="text-xl font-semibold mb-4">Votes</h2>
        <div className="flex items-center gap-6 text-2xl">
          <button
            onClick={async () => {
              try {
                await axios.post(`/builds/${id}/like/`)
                setBuild({ ...build, likes: (build.likes || 0) + 1 })
              } catch (err) {
                console.error("Error liking build", err)
              }
            }}
            className="hover:text-green-500 transition"
            title="Like this build"
          >
            <BsHandThumbsUp className="inline mr-1" /> {build.likes || 0}
          </button>

          <button
            onClick={async () => {
              try {
                await axios.post(`/builds/${id}/dislike/`)
                setBuild({ ...build, dislikes: (build.dislikes || 0) + 1 })
              } catch (err) {
                console.error("Error disliking build", err)
              }
            }}
            className="hover:text-red-500 transition"
            title="Dislike this build"
          >
            <BsHandThumbsDown className="inline mr-1" /> {build.dislikes || 0}
          </button>
        </div>
      </section>

      {/* Comments */}

      <section className="bg-gray-800 bg-opacity-40 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {build.avis?.filter((a: any) => !a.banned).length > 0 ? (
          build.avis
            .filter((a: any) => !a.banned)
            .map((a: any, i: number) => (
              <div key={i} className="border border-gray-600 p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-300">
                    <strong>{a.author?.username || 'Anonymous'}</strong> —{" "}
                    {new Date(a.date_poste).toLocaleString()}
                  </p>
                  <span className={`text-sm px-2 py-1 rounded-md ${a.positif ? 'bg-green-600' : 'bg-red-600'}`}>
                    {a.positif ? '👍 Positive' : '👎 Negative'}
                  </span>
                </div>
                <p className="text-white">{a.commentaire}</p>
              </div>
            ))
        ) : (
          <p className="text-gray-400">No visible comments yet.</p>
        )}
      </section>
    </main>
  )
}

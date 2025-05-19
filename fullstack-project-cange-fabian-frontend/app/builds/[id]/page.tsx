'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import API from '@/utils/axios'
import { BsHandThumbsUp, BsHandThumbsDown, BsFillHouseDoorFill } from "react-icons/bs"
import { PiKeyReturnLight } from "react-icons/pi";
import Link from 'next/link'

interface User {
  username: string;
}

interface Champion {
  name: string;
  image_url: string;
}

interface Avis {
  author: User;
  date_poste: string;
  positif: boolean;
  commentaire: string;
  banned: boolean;
}

interface Build {
  id: number;
  name: string;
  role: string;
  description: string;
  author: User;
  champion: Champion;
  primary_path: string;
  primary_path_icon_url: string;
  keystone: string;
  keystone_icon_url: string;
  primary_slot1: string;
  primary_slot1_icon_url: string;
  primary_slot2: string;
  primary_slot2_icon_url: string;
  primary_slot3: string;
  primary_slot3_icon_url: string;
  secondary_path: string;
  secondary_path_icon_url: string;
  secondary_slot1: string;
  secondary_slot1_icon_url: string;
  secondary_slot2: string;
  secondary_slot2_icon_url: string;
  shard_offense: string;
  shard_offense_icon_url: string;
  shard_flex: string;
  shard_flex_icon_url: string;
  shard_defense: string;
  shard_defense_icon_url: string;
  likes: number;
  dislikes: number;
  avis: Avis[];
  user_vote: boolean | null;
}

export default function BuildDetailPage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const [build, setBuild] = useState<Build | null>(null)
  const [userVote, setUserVote] = useState<boolean | null>(null)

  useEffect(() => {
    const fetchBuild = async () => {
      try {
        const res = await API.get(`builds/${id}/`)
        setBuild(res.data)
        setUserVote(res.data.user_vote)
      } catch (err) {
        console.error('Error loading build:', err)
      }
    }
    if (id) fetchBuild()
  }, [id])

  const handleVote = async (type: 'like' | 'dislike') => {
    try {
      const res = await API.post(`/builds/${id}/${type}/`)
      setBuild((prev) => prev ? {
        ...prev,
        likes: res.data.likes,
        dislikes: res.data.dislikes
      } : null)
      if ((type === 'like' && userVote === true) || (type === 'dislike' && userVote === false)) {
        setUserVote(null)
      } else {
        setUserVote(type === 'like')
      }
    } catch (err) {
      console.error(`Error ${type} build`, err)
    }
  }

  if (!build) return <p className="p-8 text-white">Loading build...</p>

  const fallback = (name: string) => `/images/custom-runes/${name.replace(/ /g, '').replace(':', '').replace("'", '')}.png`

  return (
    <main className="p-8 max-w-5xl mx-auto text-white space-y-10">
      <div className="flex justify-center mb-6 gap-10">
        <Link href="/" className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-white text-lg px-5 py-3 rounded-lg transition-all">
          <BsFillHouseDoorFill size={24} />
          Home
        </Link>
        <Link href="/builds" className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-white text-lg px-5 py-3 rounded-lg transition-all">
          <PiKeyReturnLight size={24} />
          Return
        </Link>
      </div>

      <h1 className="text-5xl font-bold text-center">{build.name}</h1>

      <section className="flex items-center gap-6 bg-gray-800 bg-opacity-40 p-6 rounded-lg">
        <img src={build.champion?.image_url} alt={build.champion?.name} className="w-32 h-32 rounded-lg object-cover border-2 border-indigo-500" />
        <div className="text-lg space-y-2">
          <p><strong>Champion:</strong> {build.champion?.name}</p>
          <p><strong>Role:</strong> {build.role}</p>
          <p><strong>Author:</strong> {build.author?.username || 'Unknown'}</p>
        </div>
      </section>

      <section className="bg-gray-800 bg-opacity-40 p-6 rounded-lg">
        <h2 className="text-3xl font-semibold mb-4">Build Description</h2>
        <div className="prose prose-invert max-w-none text-white" dangerouslySetInnerHTML={{ __html: build.description }} />
      </section>

      <section className="bg-gray-800 bg-opacity-40 p-6 rounded-lg">
        <h2 className="text-3xl font-semibold mb-6">Runes</h2>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Primary Path: {build.primary_path}</h3>
          <div className="flex items-center gap-3 mb-4">
            <img src={build.primary_path_icon_url} onError={(e) => e.currentTarget.src = fallback(build.primary_path)} className="w-10 h-10" />
            <img src={build.keystone_icon_url} onError={(e) => e.currentTarget.src = fallback(build.keystone)} className="w-10 h-10" />
            <span>{build.keystone}</span>
          </div>
          <div className="flex gap-4">
            {[1, 2, 3].map(i => (
              <img key={i} src={build[`primary_slot${i}_icon_url` as keyof Build] as string}
                alt={build[`primary_slot${i}` as keyof Build] as string}
                onError={(e) => e.currentTarget.src = fallback(build[`primary_slot${i}` as keyof Build] as string)}
                className="w-10 h-10" />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Secondary Path: {build.secondary_path}</h3>
          <div className="flex items-center gap-3 mb-4">
            <img src={build.secondary_path_icon_url} onError={(e) => e.currentTarget.src = fallback(build.secondary_path)} className="w-10 h-10" />
          </div>
          <div className="flex gap-4">
            {[1, 2].map(i => (
              <img key={i} src={build[`secondary_slot${i}_icon_url` as keyof Build] as string}
                alt={build[`secondary_slot${i}` as keyof Build] as string}
                onError={(e) => e.currentTarget.src = fallback(build[`secondary_slot${i}` as keyof Build] as string)}
                className="w-10 h-10" />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Stat Shards</h3>
          <div className="flex gap-4">
            {['shard_offense', 'shard_flex', 'shard_defense'].map((key) => (
              <img key={key} src={build[`${key}_icon_url` as keyof Build] as string}
                alt={build[key as keyof Build] as string}
                onError={(e) => e.currentTarget.src = fallback(build[key as keyof Build] as string)}
                className="w-8 h-8" />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-800 bg-opacity-40 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Votes</h2>
        <div className="flex items-center gap-6 text-2xl">
          <button onClick={() => handleVote('like')}
            className={`hover:text-green-500 transition ${userVote === true ? 'text-green-500' : ''}`}
            title="Like this build">
            <BsHandThumbsUp className="inline mr-1" /> {build.likes || 0}
          </button>
          <button onClick={() => handleVote('dislike')}
            className={`hover:text-red-500 transition ${userVote === false ? 'text-red-500' : ''}`}
            title="Dislike this build">
            <BsHandThumbsDown className="inline mr-1" /> {build.dislikes || 0}
          </button>
        </div>
      </section>

      <section className="bg-gray-800 bg-opacity-40 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {build.avis?.filter((a) => !a.banned).length > 0 ? (
          build.avis.filter((a) => !a.banned).map((a, i) => (
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

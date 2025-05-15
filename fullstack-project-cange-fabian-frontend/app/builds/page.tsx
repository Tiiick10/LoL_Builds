'use client'
import { useEffect, useState } from 'react'
import API from '@/utils/axios'
import BuildsCard from '@/components/BuildsCard'

interface Build {
  id: number
  name: string
  role: string
  description?: string
  author?: string
  avis_positif: number
  avis_negatif: number
  champion?: {
    name: string
    image_url: string
  }
  keystone: string
  keystone_icon_url: string
  primary_slot1_icon_url: string
  primary_slot2_icon_url: string
  primary_slot3_icon_url: string
  secondary_slot1_icon_url: string
  secondary_slot2_icon_url: string
  primary_slot1: string
  primary_slot2: string
  primary_slot3: string
  secondary_slot1: string
  secondary_slot2: string
  secondary_path: string
  secondary_path_icon_url: string
  shard_offense: string
  shard_flex: string
  shard_defense: string
  shard_offense_icon_url: string
  shard_flex_icon_url: string
  shard_defense_icon_url: string
}

export default function BuildsPage() {
  const [builds, setBuilds] = useState<Build[]>([])

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const res = await API.get('builds/public/')
        console.log('Received Builds : ', res.data)
        setBuilds(res.data)
      } catch (err) {
        console.error('Builds error', err)
      }
    }
    fetchBuilds()
  }, [])

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Tous les Builds</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {builds.map(build => (
          <BuildsCard key={build.id} build={build} />
        ))}
      </div>
    </main>
  )
}

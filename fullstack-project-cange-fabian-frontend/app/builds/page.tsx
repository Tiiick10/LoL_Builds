'use client'
import { useEffect, useState } from 'react'
import API from '@/utils/axios'
import BuildsCard from '@/components/BuildsCard'

interface Build {
  id: number
  name: string
  champion: string
  role: string
  image_url: string
  likes: number
  dislikes: number
  rune_major: string
}

export default function BuildsPage() {
  const [builds, setBuilds] = useState<Build[]>([])

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const res = await API.get('builds/')
        setBuilds(res.data)
      } catch (err) {
        console.error('Erreur lors du chargement des builds:', err)
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
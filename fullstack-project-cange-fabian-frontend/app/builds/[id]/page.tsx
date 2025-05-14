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
        console.error('Erreur lors du chargement du build:', err)
      }
    }
    if (id) fetchBuild()
  }, [id])

  if (!build) return <p className="p-8">Chargement du build...</p>

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{build.name}</h1>
      <p className="text-gray-400">Champion : {build.champion}</p>
      <p className="text-gray-400">Rôle : {build.role}</p>

      <section className="my-4">
        <h2 className="text-xl font-semibold">Runes</h2>
        <p>Rune Majeure : {build.rune_major}</p>
        <p>Secondaire : {build.rune_minor}</p>
      </section>

      <section className="my-4">
        <h2 className="text-xl font-semibold">Votes</h2>
        <p>👍 {build.likes} / 👎 {build.dislikes}</p>
      </section>

      <section className="my-4">
        <h2 className="text-xl font-semibold">Commentaires</h2>
        {build.comments?.map((c: any, i: number) => (
          <div key={i} className="border p-2 my-2 rounded">
            <p className="text-sm">{c.author} : {c.comment}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
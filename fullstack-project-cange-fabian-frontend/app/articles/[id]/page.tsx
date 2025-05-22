'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import API from '@/utils/axios'

export default function ArticleDetailPage() {
  const { id } = useParams()
  const [article, setArticle] = useState<any>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await API.get(`articles/${id}/`)
        setArticle(res.data)
      } catch (err) {
        console.error("Error while loading article :", err)
      }
    }
    if (id) fetchArticle()
  }, [id])

  if (!article) return <p className="p-8">Loading Article...</p>

  return (
    <main className="p-8 max-w-3xl mx-auto text-white">
      <h1 className="text-4xl font-extrabold mb-2">{article.titre}</h1>
      
      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
        <span>Category: <span className="text-indigo-400">{article.categorie}</span></span>
        <span>|</span>
        <span>Author: <span className="text-green-400">{article.auteur}</span></span>
      </div>

      <img
        src={article.image_banner}
        alt={article.titre}
        className="w-full rounded-lg shadow-lg mb-6 max-h-[500px] object-cover"
      />

      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: article.contenu }}
      />
    </main>
  )
}

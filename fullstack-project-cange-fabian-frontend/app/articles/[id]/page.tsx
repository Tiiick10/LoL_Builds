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
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{article.titre}</h1>
      <p className="text-gray-400 mb-2">Category : {article.categorie}</p>
      <img
        src={article.image_banner}
        alt={article.titre}
        className="w-full rounded-lg mb-4"
      />
      <div
        className="prose prose-invert"
        dangerouslySetInnerHTML={{ __html: article.contenu }}
      />
    </main>
  )
}

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
        console.error('Erreur lors du chargement de l\'article:', err)
      }
    }
    if (id) fetchArticle()
  }, [id])

  if (!article) return <p className="p-8">Chargement de l'article...</p>

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-500 text-sm mb-2">Catégorie : {article.category}</p>
      <img src={article.image_url} alt={article.title} className="w-full h-auto rounded mb-4" />
      <div className="prose prose-invert" dangerouslySetInnerHTML={{ __html: article.content }} />
    </main>
  )
}
'use client'
import { useEffect, useState } from 'react'
import API from '@/utils/axios'
import ArticleCard from '@/components/ArticleCard'

interface Article {
  id: number
  titre: string
  categorie: string
  image_banner: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await API.get('public-articles/')
        setArticles(res.data)
      } catch (err) {
        console.error('Erreur lors du chargement des articles:', err)
      }
    }
    fetchArticles()
  }, [])

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Articles</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </main>
  )
}

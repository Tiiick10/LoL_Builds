'use client'
import { useEffect, useState } from 'react'
import API from '@/utils/axios'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'
import useAuthState from '@/utils/useAuthState'

interface Article {
  id: number
  titre: string
  categorie: string
  image_banner: string
}

const CATEGORIES = ['all', 'guide', 'news', 'patch', 'meta']

export default function ArticlesPage() {
  const { isRedacteur } = useAuthState()
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await API.get('articles/public/')
        setArticles(res.data)
        setFilteredArticles(res.data)
      } catch (err) {
        console.error('Error while loading articles:', err)
      }
    }

    fetchArticles()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredArticles(articles)
    } else {
      setFilteredArticles(articles.filter(article => article.categorie === selectedCategory))
    }
  }, [selectedCategory, articles])

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Articles</h1>
        {isRedacteur && (
          <Link
            href="/articles/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            + Create Article
          </Link>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 bg-gray-800 text-white rounded"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </main>
  )
}

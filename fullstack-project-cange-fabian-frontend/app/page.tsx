'use client'
import { useEffect, useState } from 'react'
import HeroSection from '../components/HeroSection'
import BuildsCard from '../components/BuildsCard'
import ArticleCard from '../components/ArticleCard'
import API from '@/utils/axios'

export default function HomePage() {
  const [latestBuilds, setLatestBuilds] = useState<any[]>([])
  const [topBuilds, setTopBuilds] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const buildsRes = await API.get('builds/')
        const builds = buildsRes.data.results
        setLatestBuilds(builds.slice(0, 5))
        setTopBuilds([...builds].sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes)).slice(0, 5))

        const articlesRes = await API.get('articles/public/')
        setArticles(articlesRes.data.slice(0, 5))
      } catch (err) {
        console.error("Error loading homepage data", err)
      }
    }
    fetchData()
  }, [])

  return (
    <main className="space-y-12 p-8">
      <HeroSection />

      <section>
        <h2 className="text-2xl font-bold mb-4">Latest Builds</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestBuilds.map((build: any) => (
            <BuildsCard key={build.id} build={build} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Popular Builds</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topBuilds.map((build: any) => (
            <BuildsCard key={build.id} build={build} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Latest Articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: any) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </main>
  )
}

'use client'
import { useEffect, useState } from 'react'
import HeroSection from '../components/HeroSection'
import BuildsCard from '../components/BuildsCard'
import ArticleCard from '../components/ArticleCard'
import API from '@/utils/axios'
import type { Build, Article } from '@/types'

export default function HomePage() {
  const [latestBuilds, setLatestBuilds] = useState<Build[]>([])
  const [topBuilds, setTopBuilds] = useState<Build[]>([])
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const buildsRes = await API.get('builds/')
        const builds = buildsRes.data.results
setLatestBuilds(builds.slice(0, 5))
        setTopBuilds([...builds].sort((a, b) => (b.positive_comments - b.negative_comments) - (a.positive_comments - a.negative_comments)).slice(0, 5))

        const articlesRes = await API.get('articles/public/')
        setArticles(articlesRes.data.slice(0, 5))
      } catch (err) {
        console.error("Error loading homepage data", err)
      }
    }
    fetchData()
  }, [])

  return (
    <main>
      <HeroSection />

      <section>
        <h2 className="flex justify-center items-center text-4xl font-bold mb-15 mt-15">Latest Builds</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestBuilds.map((build: Build) => (
            <BuildsCard key={build.id} build={build} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="flex justify-center items-center text-4xl font-bold mb-15 mt-15">Popular Builds</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topBuilds.map((build: Build) => (
            <BuildsCard key={build.id} build={build} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="flex justify-center items-center text-4xl font-bold mb-15 mt-15">Latest Articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: Article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </main>
  )
}

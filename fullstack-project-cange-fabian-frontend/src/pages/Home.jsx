// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import HeroSection from '../components/HeroSection'
import BuildsCard from '../components/BuildsCard'
import ArticleCard from '../components/ArticleCard'
import axios from 'axios'

export default function Home() {
  const [latestBuilds, setLatestBuilds] = useState([])
  const [latestArticles, setLatestArticles] = useState([])

  useEffect(() => {
  axios.get('/api/builds/latest/')
    .then(res => {
      console.log("Derniers builds:", res.data);
      setLatestBuilds(res.data);
    })
    .catch(err => console.error(err));

  axios.get('/api/articles/latest/')
    .then(res => {
      console.log("Derniers articles:", res.data);
      setLatestArticles(res.data);
    })
    .catch(err => console.error(err));
}, [])

  return (
    <>
      <HeroSection />

      <section className="py-10 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Latest Builds</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.isArray(latestBuilds) && latestBuilds.map(build => (
            <BuildsCard key={build.id} build={build} />
            ))}
        </div>
      </section>

      <section className="py-10 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Recent Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.isArray(latestArticles) && latestArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
            ))}
        </div>
      </section>
    </>
  )
}

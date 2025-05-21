'use client'
import Link from 'next/link'

interface Props {
  article: {
    id: number
    titre: string
    image_banner: string
    categorie: string
  }
}

export default function ArticleCard({ article }: Props) {
  return (
    <div className="bg-white text-gray-900 rounded-lg shadow overflow-hidden">
      <img
        src={article.image_banner}
        alt={article.titre}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{article.titre}</h2>
        <p className="text-sm text-gray-600 mb-4">{article.categorie}</p>
        <Link
          href={`/articles/${article.id}`}
          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          See Article
        </Link>
      </div>
    </div>
  )
}

export default function ArticleCard({ article }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      <img src={article.image_banner} alt={article.titre} className="w-full h-32 object-cover rounded mb-2" />
      <h3 className="text-white font-bold text-lg">{article.titre}</h3>
      <p className="text-sm text-gray-300">{article.categorie}</p>
    </div>
  )
}

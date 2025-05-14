interface ArticleCardProps {
  article: {
    id: number;
    titre: string;
    categorie: string;
    image_banner: string;
  }
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <img src={article.image_banner} alt={article.titre} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold">{article.titre}</h3>
        <p className="text-sm text-gray-600">{article.categorie}</p>
      </div>
    </div>
  )
}

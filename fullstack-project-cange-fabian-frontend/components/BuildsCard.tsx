interface BuildsCardProps {
  build: {
    id: number;
    name: string;
    champion: string;
    role: string;
    image_url: string;
    likes: number;
    dislikes: number;
    rune_major: string;
  }
}

export default function BuildsCard({ build }: BuildsCardProps) {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
      <img src={build.image_url} alt={build.champion} className="w-20 h-20 rounded-full object-cover mb-2" />
      <h3 className="text-xl font-bold">{build.name}</h3>
      <p className="text-sm text-gray-400 capitalize">Champion: {build.champion}</p>
      <p className="text-sm text-gray-400 capitalize">Rôle: {build.role}</p>
      <p className="text-sm text-green-400">👍 {build.likes} | 👎 {build.dislikes}</p>
      <p className="text-sm text-yellow-400">Rune Majeure: {build.rune_major}</p>
    </div>
  )
}
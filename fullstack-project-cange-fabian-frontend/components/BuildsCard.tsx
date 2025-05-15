import { BsHandThumbsUp, BsHandThumbsDown } from "react-icons/bs"

interface Build {
  id: number
  name: string
  role: string
  description?: string
  author?: string
  avis_positif: number
  avis_negatif: number
  champion?: {
    name: string
    image_url: string
  }
  keystone: string
  keystone_icon_url: string
  primary_slot1_icon_url: string
  primary_slot2_icon_url: string
  primary_slot3_icon_url: string
  secondary_slot1_icon_url: string
  secondary_slot2_icon_url: string
  primary_slot1: string
  primary_slot2: string
  primary_slot3: string
  secondary_slot1: string
  secondary_slot2: string
  shard_offense: string
  shard_flex: string
  shard_defense: string
  shard_offense_icon_url: string
  shard_flex_icon_url: string
  shard_defense_icon_url: string
}

interface Props {
  build: Build
}

export default function BuildsCard({ build }: Props) {
  const imageUrl =
    build?.champion?.image_url || "https://via.placeholder.com/64x64?text=?"

  const shards = ["shard_offense", "shard_flex", "shard_defense"].map((key) => ({
    icon: build[`${key}_icon_url` as keyof Build] as string,
    name: build[key as keyof Build] as string,
  }))

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
      {/* Header section */}
      <div className="flex items-center space-x-4">
        <img
          src={imageUrl}
          alt={build.champion?.name || "Champion"}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-white text-2xl font-bold">{build.name}</h3>
          <p className="text-gray-400 text-sm capitalize">{build.role}</p>
          <p className="text-gray-300 text-xs mt-1">
            Author: {build.author || "Unknown"}
          </p>
          <p className="text-xs text-gray-400 flex gap-2 items-center">
            <BsHandThumbsUp /> {build.avis_positif} / <BsHandThumbsDown />{" "}
            {build.avis_negatif}
          </p>
        </div>
        <div className="ml-4 text-center">
          <img
            src={build.keystone_icon_url}
            alt="Keystone"
            className="w-10 h-10 object-contain mx-auto"
          />
          <span className="text-indigo-400 text-xs">{build.keystone}</span>
        </div>
      </div>

      {/* Primary Runes */}
      <div className="mt-4">
        <h4 className="text-white font-semibold mb-2">Primary Runes</h4>
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => {
            const key = `primary_slot${i}_icon_url` as keyof Build
            const alt = `primary_slot${i}` as keyof Build
            return (
              build[key] && (
                <img
                  key={i}
                  src={build[key] as string}
                  alt={build[alt] as string}
                  className="w-8 h-8 object-contain"
                />
              )
            )
          })}
        </div>
      </div>

      {/* Secondary Runes */}
      <div className="mt-4">
        <h4 className="text-white font-semibold mb-2">Secondary Runes</h4>
        <div className="flex gap-4">
          {[1, 2].map((i) => {
            const key = `secondary_slot${i}_icon_url` as keyof Build
            const alt = `secondary_slot${i}` as keyof Build
            return (
              build[key] && (
                <img
                  key={i}
                  src={build[key] as string}
                  alt={build[alt] as string}
                  className="w-8 h-8 object-contain"
                />
              )
            )
          })}
        </div>
      </div>

      {/* Shards */}
      <div className="mt-4">
        <h4 className="text-white font-semibold mb-2">Shards</h4>
        <div className="flex gap-4">
          {shards.map((shard, i) =>
            shard.icon ? (
              <img
                key={i}
                src={shard.icon}
                alt={shard.name}
                className="w-6 h-6 object-contain"
              />
            ) : null
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-4">
        <h4 className="text-white font-semibold mb-2">Description</h4>
        <p className="text-gray-400 text-sm">{build.description}</p>
      </div>
    </div>
  )
}

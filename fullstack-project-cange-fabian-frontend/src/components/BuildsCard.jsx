import { BsHandThumbsUp, BsHandThumbsDown } from "react-icons/bs"

export default function BuildsCard({ build }) {
  
  const imageUrl = build?.champion?.image_url || "https://via.placeholder.com/64x64?text=?"

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
          <p className="text-gray-300 text-xs mt-1">Author: {build.author?.name || "Unknown"}</p>
          <p className="text-xs text-gray-400 flex gap-2 items-center">
            <BsHandThumbsUp /> {build.avis_positif} / <BsHandThumbsDown /> {build.avis_negatif}
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
          {[1, 2, 3].map(i => {
            const key = `primary_slot${i}_icon_url`
            const alt = `primary_slot${i}`
            return (
              build[key] && (
                <img
                  key={i}
                  src={build[key]}
                  alt={build[alt]}
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
          {[1, 2].map(i => {
            const key = `secondary_slot${i}_icon_url`
            const alt = `secondary_slot${i}`
            return (
              build[key] && (
                <img
                  key={i}
                  src={build[key]}
                  alt={build[alt]}
                  className="w-8 h-8 object-contain"
                />
              )
            )
          })}
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

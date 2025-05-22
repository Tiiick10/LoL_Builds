'use client'

import React from "react"
import { useRouter } from 'next/navigation'
import { motion } from "framer-motion"

interface Build {
  id: number
  name: string
  champion: {
    name: string
  }
  primary_path: string
  primary_path_icon_url: string
  primary_slot1: string
  primary_slot1_icon_url: string
  primary_slot2: string
  primary_slot2_icon_url: string
  primary_slot3: string
  primary_slot3_icon_url: string
  secondary_path: string
  secondary_path_icon_url: string
  secondary_slot1: string
  secondary_slot1_icon_url: string
  secondary_slot2: string
  secondary_slot2_icon_url: string
}

interface Props {
  build: Build
}

export default function BuildsCard({ build }: Props) {
  const splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${build.champion.name}_0.jpg`
  const router = useRouter()

  const goToDetail = () => {
    router.push(`/builds/${build.id}`)
  }

  const fallback = (name?: string) => {
    if (!name || typeof name !== 'string') return ''
    return `/images/custom-runes/${name.replace(/ /g, '').replace(':', '').replace("'", '')}.png`
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03, rotate: 1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="rounded-xl"
    >
      <div className="rounded-xl p-4 text-white shadow-lg bg-cover bg-center relative w-full max-w-[400px] h-[600px] overflow-hidden"
        style={{
          backgroundImage: `url(${splashUrl})`,
        }}>

        <div className="absolute inset-0 bg-black opacity-60 rounded-xl"></div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="text-center mt-2 mb-20">
            <h1 className="text-2xl font-bold">{build.name}</h1>
          </div>

          <div className="flex items-center gap-5 mt-4">
            <img
              src={build.primary_path_icon_url || fallback(build.primary_path)}
              alt={build.primary_path}
              className="w-8 h-8"
              onError={(e) => { e.currentTarget.src = fallback(build.primary_path) }}
            />
            <span className="text-2xl">{build.primary_path}</span>
          </div>

          <div className="flex gap-5 ms-10 mt-2">
            {[1, 2, 3].map((i) => {
              const iconKey = `primary_slot${i}_icon_url` as keyof Build
              const nameKey = `primary_slot${i}` as keyof Build
              return (
                <img
                  key={i}
                  src={build[iconKey] as string || fallback(build[nameKey] as string)}
                  alt={`Primary Rune ${i}`}
                  className="w-10 h-10"
                  onError={(e) => { e.currentTarget.src = fallback(build[nameKey] as string | undefined) }}
                />
              )
            })}
          </div>

          <div className="flex items-center gap-5 mt-6">
            <img
              src={build.secondary_path_icon_url || fallback(build.secondary_path)}
              alt={build.secondary_path}
              className="w-8 h-8"
              onError={(e) => { e.currentTarget.src = fallback(build.secondary_path) }}
            />
            <span className="text-2xl">{build.secondary_path}</span>
          </div>

          <div className="flex gap-5 ms-10 mt-2 mb-8">
            {[1, 2].map((i) => {
              const iconKey = `secondary_slot${i}_icon_url` as keyof Build
              const nameKey = `secondary_slot${i}` as keyof Build
              return (
                <img
                  key={i}
                  src={build[iconKey] as string || fallback(build[nameKey] as string)}
                  alt={`Secondary Rune ${i}`}
                  className="w-10 h-10"
                  onError={(e) => { e.currentTarget.src = fallback(build[nameKey] as string | undefined) }}
                />
              )
            })}
          </div>

          <div className="flex justify-end">
            <button
              onClick={goToDetail}
              className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white text-sm px-4 py-2 rounded-md transition duration-200"
            >
              See the build
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

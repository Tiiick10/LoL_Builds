"use client"
import { useEffect, useState } from "react"
import API from "@/utils/axios"
import Link from "next/link"
import {
  BsHandThumbsUp,
  BsHandThumbsDown,
  BsFillHouseDoorFill,
} from "react-icons/bs"

interface Build {
  id: number
  name: string
  role: string
  keystone: string
  keystone_icon_url: string
  champion: {
    name: string
    image_url: string
  }
  positive_comments: number
  negative_comments: number
  created_at: string
}

export default function BuildsPage() {
  const [builds, setBuilds] = useState<Build[]>([])
  const [roleFilter, setRoleFilter] = useState("")
  const [championFilter, setChampionFilter] = useState("")
  const [ordering, setOrdering] = useState("created_at")
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const res = await API.get("builds/", {
          params: {
            page,
            role: roleFilter || undefined,
            champion__name: championFilter || undefined,
            ordering,
          },
        })

        const data = res.data.results || res.data
        setBuilds(data)
      } catch (err) {
        console.error("Error fetching builds:", err)
      }
    }

    fetchBuilds()
  }, [roleFilter, championFilter, ordering, page])

  return (
    <main className="p-8 text-white">
      <div className="flex justify-center mb-6">
        <Link
          href="/"
          className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-white text-lg px-5 py-3 rounded-lg transition-all"
        >
          <BsFillHouseDoorFill size={24} />
          Home
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">All Builds</h1>

      {/* Filters */}

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value)
            setPage(1)
          }}
          className="bg-gray-800 px-4 py-2 rounded"
        >
          <option value="">All Roles</option>
          <option value="top">Top</option>
          <option value="jungle">Jungle</option>
          <option value="mid">Mid</option>
          <option value="adc">ADC</option>
          <option value="support">Support</option>
        </select>

        <input
          type="text"
          placeholder="Champion name"
          value={championFilter}
          onChange={(e) => {
            setChampionFilter(e.target.value)
            setPage(1)
          }}
          className="bg-gray-800 px-4 py-2 rounded"
        />

        <select
          value={ordering}
          onChange={(e) => {
            setOrdering(e.target.value)
            setPage(1)
          }}
          className="bg-gray-800 px-4 py-2 rounded"
        >
          <option value="created_at">Newest</option>
          <option value="-created_at">Oldest</option>
          <option value="most_liked">Most Liked</option>
        </select>
      </div>

      {/* Builds grid */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
        {builds.map((build) => (
          <div
            key={build.id}
            className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition w-full max-w-[280px]"
          >
            <div className="flex flex-col items-center mb-4">
              <img
                src={build.champion?.image_url}
                alt={build.champion?.name}
                className="w-24 h-40 mb-2"
              />
              <div className="text-center">
                <h2 className="text-lg font-semibold text-white">
                  {build.name}
                </h2>
                <p className="text-sm text-gray-400">
                  {build.champion?.name} • {build.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3 justify-center">
              <img
                src={build.keystone_icon_url}
                alt={build.keystone}
                className="w-6 h-6"
              />
              <span className="text-sm text-gray-200">{build.keystone}</span>
            </div>

            <div className="flex justify-center gap-4 text-sm text-gray-400 mb-2">
              <div className="flex items-center gap-1">
                <BsHandThumbsUp className="text-yellow-400 text-lg" />
                {build.positive_comments || 0}
              </div>
              <div className="flex items-center gap-1">
                <BsHandThumbsDown className="text-red-400 text-lg" />
                {build.negative_comments || 0}
              </div>
            </div>

            <Link href={`/builds/${build.id}`}>
              <button className="mt-2 bg-indigo-600 hover:bg-indigo-700 cursor-pointer px-4 py-1.5 rounded text-white text-sm w-full">
                See Build
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}

      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </main>
  )
}

"use client"
import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import API from "@/utils/axios"
import {
  BsHandThumbsUpFill,
  BsHandThumbsDownFill,
  BsFillHouseDoorFill,
} from "react-icons/bs"
import { PiKeyReturnLight } from "react-icons/pi"
import Link from "next/link"
import { jwtDecode } from "jwt-decode"

interface User {
  username: string
}

interface Champion {
  name: string
  image_url: string
}

interface Avis {
  author: User
  date_poste: string
  positif: boolean
  commentaire: string
  banned: boolean
}

interface Build {
  id: number
  name: string
  role: string
  description: string
  author: User
  champion: Champion
  primary_path: string
  primary_path_icon_url: string
  keystone: string
  keystone_icon_url: string
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
  shard_offense: string
  shard_offense_icon_url: string
  shard_flex: string
  shard_flex_icon_url: string
  shard_defense: string
  shard_defense_icon_url: string
  avis: Avis[]
  is_public: boolean
}

export default function BuildDetailPage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const [build, setBuild] = useState<Build | null>(null)
  const [newComment, setNewComment] = useState("")
  const [isPositive, setIsPositive] = useState(true)
  const [submitMessage, setSubmitMessage] = useState("")
  const [isAuthor, setIsAuthor] = useState(false)
  const [isSuperuser, setIsSuperuser] = useState(false)
  const [editedBuild, setEditedBuild] = useState<Partial<Build>>({})
  const [isEditing, setIsEditing] = useState(false)

  const fallback = (name: string) =>
    `/images/custom-runes/${name
      .replace(/ /g, "")
      .replace(":", "")
      .replace("'", "")}.png`

  const fetchBuild = async () => {
    try {
      const res = await API.get(`builds/${id}/`)
      setBuild(res.data)
      setEditedBuild(res.data)
    } catch (err) {
      console.error("Error loading build:", err)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`builds/${id}/`)
        setBuild(res.data)
        setEditedBuild(res.data)

        const token = localStorage.getItem("access")
        if (token) {
          const decoded: any = jwtDecode(token)
          console.log("Token decoded:", decoded)

          const currentUser = localStorage.getItem("username")
          const isAdmin = decoded.is_superuser
          console.log("Current user:", currentUser)
          console.log("Is admin:", isAdmin)
          setIsSuperuser(isAdmin)

          if (res.data.author?.username === currentUser || isAdmin) {
            setIsAuthor(true)
          }
        }
      } catch (err) {
        console.error("Error loading build:", err)
      }
    }

    if (id) fetchData()
  }, [id])

  const handleUpdateBuild = async () => {
    try {
      await API.patch(
        `/builds/${build?.id}/`,
        {
          name: editedBuild.name,
          description: editedBuild.description,
          role: editedBuild.role,
          keystone: editedBuild.keystone,
          primary_path: editedBuild.primary_path,
          primary_slot1: editedBuild.primary_slot1,
          primary_slot2: editedBuild.primary_slot2,
          primary_slot3: editedBuild.primary_slot3,
          secondary_path: editedBuild.secondary_path,
          secondary_slot1: editedBuild.secondary_slot1,
          secondary_slot2: editedBuild.secondary_slot2,
          shard_offense: editedBuild.shard_offense,
          shard_flex: editedBuild.shard_flex,
          shard_defense: editedBuild.shard_defense,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      )
      alert("Build updated!")
      fetchBuild()
    } catch (err) {
      console.error("Update failed:", err)
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return
    try {
      await API.post(
        `/builds/${id}/avis/`,
        {
          commentaire: newComment,
          positif: isPositive,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      )
      setSubmitMessage("Comment sent !")
      setNewComment("")
      fetchBuild()
    } catch (err) {
      console.error(err)
      setSubmitMessage("Error while sending comment.")
    }
  }

  if (!build) return <p className="p-8 text-white">Loading build...</p>

  return (
    <main className="p-8 max-w-5xl mx-auto text-white space-y-10">
      <div className="flex justify-center mb-6 gap-10">
        <Link
          href="/"
          className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-white text-lg px-5 py-3 rounded-lg transition-all"
        >
          <BsFillHouseDoorFill size={24} />
          Home
        </Link>
        <Link
          href="/builds"
          className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-white text-lg px-5 py-3 rounded-lg transition-all"
        >
          <PiKeyReturnLight size={24} />
          Return
        </Link>
      </div>

      {isAuthor ? (
        <div className="space-y-4">
          <input
            className="text-4xl font-bold bg-gray-900 border border-indigo-500 p-2 rounded text-white w-full"
            value={editedBuild.name || ""}
            onChange={(e) =>
              setEditedBuild({ ...editedBuild, name: e.target.value })
            }
          />
          <textarea
            className="w-full bg-gray-900 text-white p-4 rounded-lg"
            value={editedBuild.description || ""}
            onChange={(e) =>
              setEditedBuild({ ...editedBuild, description: e.target.value })
            }
          />
          <select
            className="bg-gray-800 text-white p-2 rounded"
            value={editedBuild.role || ""}
            onChange={(e) =>
              setEditedBuild({ ...editedBuild, role: e.target.value })
            }
          >
            {["top", "jungle", "mid", "adc", "support"].map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button
            onClick={handleUpdateBuild}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white mt-2"
          >
            Save All Changes
          </button>
        </div>
      ) : (
        <h1 className="text-5xl font-bold text-center">{build.name}</h1>
      )}

      {isAuthor && (
        <div className="flex gap-4 justify-center mt-4">
          <button
            onClick={async () => {
              try {
                await API.patch(
                  `/builds/${build.id}/toggle_visibility/`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                  }
                )
                fetchBuild()
              } catch (err) {
                console.error("Toggle visibility failed:", err)
              }
            }}
            className={`px-4 py-2 rounded text-white ${
              build.is_public
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            {build.is_public ? "Make Private" : "Make Public"}
          </button>

          <button
            onClick={handleUpdateBuild}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white"
          >
            Save Changes
          </button>

          <button
            onClick={async () => {
              if (confirm("Are you sure you want to delete this build?")) {
                try {
                  await API.delete(`/builds/${build.id}/delete/`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                  })
                  window.location.href = "/builds"
                } catch (err) {
                  console.error("Error deleting build:", err)
                }
              }
            }}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
          >
            Delete Build
          </button>
        </div>
      )}

      <section className="flex items-center gap-6 bg-gray-800 bg-opacity-40 p-6 rounded-lg">
        <img
          src={build.champion?.image_url}
          alt={build.champion?.name}
          className="w-32 h-50 rounded-lg object-cover border-2 border-indigo-500"
        />
        <div className="text-lg space-y-2">
          <p>
            <strong>Champion:</strong> {build.champion?.name}
          </p>
          <p>
            <strong>Role:</strong> {build.role}
          </p>
          <p>
            <strong>Author:</strong> {build.author?.username || "Unknown"}
          </p>
        </div>
      </section>

      <section className="bg-gray-800 bg-opacity-40 p-6 rounded-lg">
        <h2 className="text-3xl font-semibold mb-4">Build Description</h2>
        <div
          className="prose prose-invert max-w-none text-white"
          dangerouslySetInnerHTML={{ __html: build.description }}
        />
      </section>

      {/* RUNES */}
      <section className="bg-gray-800 bg-opacity-40 p-6 rounded-lg">
        <h2 className="text-3xl font-semibold mb-6">Runes</h2>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">
            Primary Path: {build.primary_path}
          </h3>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={build.primary_path_icon_url}
              onError={(e) =>
                (e.currentTarget.src = fallback(build.primary_path))
              }
              className="w-10 h-10"
            />
            <img
              src={build.keystone_icon_url}
              onError={(e) => (e.currentTarget.src = fallback(build.keystone))}
              className="w-10 h-10"
            />
            <span>{build.keystone}</span>
          </div>
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                src={
                  build[`primary_slot${i}_icon_url` as keyof Build] as string
                }
                alt={build[`primary_slot${i}` as keyof Build] as string}
                onError={(e) =>
                  (e.currentTarget.src = fallback(
                    build[`primary_slot${i}` as keyof Build] as string
                  ))
                }
                className="w-10 h-10"
              />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">
            Secondary Path: {build.secondary_path}
          </h3>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={build.secondary_path_icon_url}
              onError={(e) =>
                (e.currentTarget.src = fallback(build.secondary_path))
              }
              className="w-10 h-10"
            />
          </div>
          <div className="flex gap-4">
            {[1, 2].map((i) => (
              <img
                key={i}
                src={
                  build[`secondary_slot${i}_icon_url` as keyof Build] as string
                }
                alt={build[`secondary_slot${i}` as keyof Build] as string}
                onError={(e) =>
                  (e.currentTarget.src = fallback(
                    build[`secondary_slot${i}` as keyof Build] as string
                  ))
                }
                className="w-10 h-10"
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Stat Shards</h3>
          <div className="flex gap-4">
            {["shard_offense", "shard_flex", "shard_defense"].map((key) => (
              <img
                key={key}
                src={build[`${key}_icon_url` as keyof Build] as string}
                alt={build[key as keyof Build] as string}
                onError={(e) =>
                  (e.currentTarget.src = fallback(
                    build[key as keyof Build] as string
                  ))
                }
                className="w-8 h-8"
              />
            ))}
          </div>
        </div>
      </section>

      {/* COMMENTS */}

      <section className="bg-gray-800 bg-opacity-40 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {build.avis?.filter((a) => !a.banned).length > 0 ? (
          build.avis
            .filter((a) => !a.banned)
            .map((a, i) => (
              <div
                key={i}
                className="border border-gray-600 p-4 rounded-md mb-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-300">
                    <strong>{a.author?.username || "Anonymous"}</strong> —{" "}
                    {new Date(a.date_poste).toLocaleString()}
                  </p>
                  <span
                    className={`flex items-center gap-1 text-sm px-2 py-1 rounded-md ${
                      a.positif ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {a.positif ? (
                      <BsHandThumbsUpFill className="text-white" />
                    ) : (
                      <BsHandThumbsDownFill className="text-white" />
                    )}
                    {a.positif ? "Positive" : "Negative"}
                  </span>
                </div>
                <p className="text-white">{a.commentaire}</p>
              </div>
            ))
        ) : (
          <p className="text-gray-400">No visible comments yet.</p>
        )}

        <div className="mt-6 border-t border-gray-700 pt-6">
          <h3 className="text-xl mb-4">Write a comment</h3>
          {submitMessage && (
            <p className="text-green-400 mb-2">{submitMessage}</p>
          )}
          <textarea
            placeholder="Write a comment..."
            className="w-full p-3 rounded bg-gray-900 text-white border border-gray-600 mb-3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="avis"
                checked={isPositive}
                onChange={() => setIsPositive(true)}
              />
              <BsHandThumbsUpFill className="text-white" /> Positive
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="avis"
                checked={!isPositive}
                onChange={() => setIsPositive(false)}
              />
              <BsHandThumbsDownFill className="text-white" /> Negative
            </label>
          </div>
          <button
            onClick={handleSubmitComment}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white"
          >
            Submit
          </button>
        </div>
      </section>
    </main>
  )
}

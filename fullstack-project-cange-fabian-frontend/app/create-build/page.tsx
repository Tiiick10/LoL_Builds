"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

const ROLES = ["top", "jungle", "mid", "adc", "support"]

const SHARD_ROW_1 = [
  { label: "Adaptive Force", value: "StatModsAdaptiveForceIcon" },
  { label: "Attack Speed", value: "StatModsAttackSpeedIcon" },
  { label: "Ability Haste (CDR)", value: "StatModsCDRScalingIcon" },
]

const SHARD_ROW_2 = [
  { label: "Adaptive Force", value: "StatModsAdaptiveForceIcon" },
  { label: "Movement Speed", value: "StatModsMoveSpeedIcon" },
  { label: "Health", value: "StatModsHealthScalingIcon" },
]

const SHARD_ROW_3 = [
  { label: "Health", value: "StatModsHealthScalingIcon" },
  { label: "Magic Resist", value: "StatModsMagicResIcon" },
  { label: "Armor", value: "StatModsArmorIcon" },
]

export default function CreateBuildPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    role: "",
    champion_name: "",
    primary_path: "",
    keystone: "",
    primary_slot1: "",
    primary_slot2: "",
    primary_slot3: "",
    secondary_path: "",
    secondary_slot1: "",
    secondary_slot2: "",
    shard_offense: "",
    shard_flex: "",
    shard_defense: "",
  })

  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [champions, setChampions] = useState<any[]>([])
  const [filteredChampions, setFilteredChampions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [runes, setRunes] = useState<any[]>([])

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const token = localStorage.getItem("access")
    if (!token) return setError("Not authenticated.")
    if (!form.champion_name) return setError("Please select a champion.")

    try {
      await axios.post("http://127.0.0.1:8000/api/builds/create/", form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMessage("Build created successfully!")
      setTimeout(() => router.push("/builds"), 1500)
    } catch (err: any) {
      if (err.response) {
        console.error("API Error:", err.response.data)
        setError(`Erreur API : ${JSON.stringify(err.response.data)}`)
      } else {
        setError("Unknown error")
        console.error(err)
      }
    }
  }

  useEffect(() => {
    const fetchChampions = async () => {
      const res = await axios.get(
        "https://ddragon.leagueoflegends.com/cdn/15.9.1/data/en_US/champion.json"
      )
      setChampions(Object.values(res.data.data))
    }
    const fetchRunes = async () => {
      const res = await axios.get(
        "https://ddragon.leagueoflegends.com/cdn/15.9.1/data/en_US/runesReforged.json"
      )
      setRunes(res.data)
    }
    fetchChampions()
    fetchRunes()
  }, [])

  const primary = runes.find((r) => r.name === form.primary_path)
  const secondary = runes.find((r) => r.name === form.secondary_path)
  const secondaryBranches = runes.filter((r) => r.name !== form.primary_path)

  return (
    <div className="max-w-3xl mx-auto p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Create a New Build</h1>
      {message && <p className="text-green-400 mb-2">{message}</p>}
      {error && <p className="text-red-400 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 relative">
        <input
          type="text"
          name="name"
          placeholder="Build name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          className="w-full p-2 bg-gray-800 rounded"
        />

        <textarea
          name="description"
          placeholder="Description (HTML allowed)"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          className="w-full p-2 bg-gray-800 rounded h-32"
        />

        <select
          name="role"
          value={form.role}
          onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
          className="w-full p-2 bg-gray-800 rounded"
        >
          <option value="">Select Role</option>
          {ROLES.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>

        {/* Champion Autocomplete */}
        <div className="relative">
          <input
            type="text"
            name="champion_name"
            placeholder="Champion name"
            value={form.champion_name}
            onChange={(e) => {
              const value = e.target.value
              setForm((prev) => ({ ...prev, champion_name: value }))
              setShowSuggestions(true)
              setFilteredChampions(
                champions.filter((c) =>
                  c.name.toLowerCase().includes(value.toLowerCase())
                )
              )
            }}
            className="w-full p-2 bg-gray-800 rounded"
          />
          {showSuggestions && (
            <ul className="absolute bg-gray-900 border border-gray-700 w-full z-10 max-h-48 overflow-y-auto">
              {filteredChampions.map((c) => (
                <li
                  key={c.id}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, champion_name: c.name }))
                    setShowSuggestions(false)
                  }}
                  className="flex items-center p-2 hover:bg-gray-700 cursor-pointer"
                >
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/${c.image.full}`}
                    alt={c.name}
                    className="w-6 h-6 mr-2"
                  />
                  <span>{c.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Primary Path */}
        <select
          name="primary_path"
          value={form.primary_path}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              primary_path: e.target.value,
              keystone: "",
              primary_slot1: "",
              primary_slot2: "",
              primary_slot3: "",
            }))
          }
          className="w-full p-2 bg-gray-800 rounded"
        >
          <option value="">Select Primary Path</option>
          {runes.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>

        {/* Keystone */}
        {primary && (
          <select
            name="keystone"
            value={form.keystone}
            onChange={(e) => setForm((prev) => ({ ...prev, keystone: e.target.value }))}
            className="w-full p-2 bg-gray-800 rounded"
          >
            <option value="">Select Keystone</option>
            {primary.slots[0]?.runes.map((rune: any) => (
              <option key={rune.id} value={rune.name}>
                {rune.name}
              </option>
            ))}
          </select>
        )}

        {/* Minor Primary Runes */}
        {primary && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {primary.slots.slice(1).map((slot: any, idx: number) => {
              const field = `primary_slot${idx + 1}` as keyof typeof form
              return (
                <select
                  key={idx}
                  value={form[field]}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                  className="p-2 bg-gray-800 rounded"
                >
                  <option value="">{`Primary Slot ${idx + 1}`}</option>
                  {slot.runes.map((rune: any) => (
                    <option key={rune.id} value={rune.name}>
                      {rune.name}
                    </option>
                  ))}
                </select>
              )
            })}
          </div>
        )}

        {/* Secondary Path */}
        <select
          name="secondary_path"
          value={form.secondary_path}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              secondary_path: e.target.value,
              secondary_slot1: "",
              secondary_slot2: "",
            }))
          }
          className="w-full p-2 bg-gray-800 rounded"
        >
          <option value="">Select Secondary Path</option>
          {secondaryBranches.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>

        {/* Secondary Slot Runes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[1, 2].map((idx) => (
            <select
              key={idx}
              value={form[`secondary_slot${idx}` as keyof typeof form]}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  [`secondary_slot${idx}`]: e.target.value,
                }))
              }
              className="p-2 bg-gray-800 rounded"
            >
              <option value="">Secondary Slot {idx}</option>
              {secondary?.slots
                .slice(1)
                .flatMap((slot: any) => slot.runes)
                .map((rune: any) => (
                  <option key={rune.id} value={rune.name}>
                    {rune.name}
                  </option>
                ))}
            </select>
          ))}
        </div>

        {/* Stat Shards */}
        <h2 className="text-lg font-semibold">Select Shards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[SHARD_ROW_1, SHARD_ROW_2, SHARD_ROW_3].map((row, i) => {
            const name = ["shard_offense", "shard_flex", "shard_defense"][i]
            return (
              <select
                key={name}
                value={form[name as keyof typeof form]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [name]: e.target.value }))
                }
                className="p-2 bg-gray-800 rounded"
              >
                <option value="">{`Shard ${i + 1}`}</option>
                {row.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            )
          })}
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white"
        >
          Create Build
        </button>
      </form>
    </div>
  )
}

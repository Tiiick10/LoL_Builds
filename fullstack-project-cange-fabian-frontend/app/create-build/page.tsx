"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

const ROLES = ["top", "jungle", "mid", "adc", "support"]

const SHARD_ROW_1 = [
  { label: 'Adaptive Force', value: 'StatModsAdaptiveForceIcon' },
  { label: 'Attack Speed', value: 'StatModsAttackSpeedIcon' },
  { label: 'Ability Haste (CDR)', value: 'StatModsCDRScalingIcon' },
]

const SHARD_ROW_2 = [
  { label: 'Adaptive Force', value: 'StatModsAdaptiveForceIcon' },
  { label: 'Movement Speed', value: 'StatModsMoveSpeedIcon' },
  { label: 'Health', value: 'StatModsHealthScalingIcon' },
]

const SHARD_ROW_3 = [
  { label: 'Health', value: 'StatModsHealthScalingIcon' },
  { label: 'Magic Resist', value: 'StatModsMagicResIcon' },
  { label: 'Armor', value: 'StatModsArmorIcon' },
]

export default function CreateBuildPage() {
  const [form, setForm] = useState<{
    name: string
    description: string
    role: string
    champion: number | null
    keystone: string
    primary_slot1: string
    primary_slot2: string
    primary_slot3: string
    secondary_path: string
    secondary_slot1: string
    secondary_slot2: string
    shard_offense: string
    shard_flex: string
    shard_defense: string
  }>({
    name: '',
    description: '',
    role: '',
    champion: null,
    keystone: '',
    primary_slot1: '',
    primary_slot2: '',
    primary_slot3: '',
    secondary_path: '',
    secondary_slot1: '',
    secondary_slot2: '',
    shard_offense: '',
    shard_flex: '',
    shard_defense: ''
  })

  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [champions, setChampions] = useState<any[]>([])
  const [filteredChampions, setFilteredChampions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [runes, setRunes] = useState<any[]>([])
  const [selectedChampionName, setSelectedChampionName] = useState('')

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const token = localStorage.getItem("access")
    if (!token) return setError("Not authenticated.")

    try {
      await axios.post("http://127.0.0.1:8000/api/builds/create/", form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMessage("Build created successfully!")
      setTimeout(() => router.push("/builds"), 1500)
    } catch (err: any) {
      if (err.response) {
        console.error("API Error:", err.response.data)
        setError(JSON.stringify(err.response.data))
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

  const secondaryBranches = runes.filter((r) => r.name !== form.keystone)
  const primary = runes.find((r) => r.name === form.keystone)
  const validPrimarySlots = primary ? primary.slots : []
  const secondary = runes.find((r) => r.name === form.secondary_path)
  const validSecondarySlots = secondary ? secondary.slots.slice(1) : []

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
          value={form.name ?? ''}
          onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
          className="w-full p-2 bg-gray-800 rounded"
        />
        <textarea
          name="description"
          placeholder="Description (HTML allowed)"
          value={form.description ?? ''}
          onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
          className="w-full p-2 bg-gray-800 rounded h-32"
        />

        <select
          name="role"
          value={form.role ?? ''}
          onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
          className="w-full p-2 bg-gray-800 rounded"
        >
          <option value="">Select Role</option>
          {ROLES.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>

        <div className="relative">
          <input
            type="text"
            name="champion"
            placeholder="Champion name (e.g. Ahri)"
            value={selectedChampionName}
            onChange={(e) => {
              const value = e.target.value
              setSelectedChampionName(value)
              setShowSuggestions(true)
              const matches = champions.filter(c =>
                c.name.toLowerCase().includes(value.toLowerCase())
              )
              setFilteredChampions(matches)
              setForm(prev => ({ ...prev, champion: null }))
            }}
            className="w-full p-2 bg-gray-800 rounded"
          />
          {showSuggestions && (
            <ul className="absolute bg-gray-900 border border-gray-700 w-full z-10 max-h-48 overflow-y-auto">
              {filteredChampions.map((c) => (
                <li
                  key={c.id}
                  onClick={() => {
                    setForm(prev => ({ ...prev, champion: c.key }))
                    setSelectedChampionName(c.name)
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

        <select
          name="keystone"
          value={form.keystone ?? ''}
          onChange={(e) => setForm(prev => ({ ...prev, keystone: e.target.value }))}
          className="w-full p-2 bg-gray-800 rounded"
        >
          <option value="">Select Keystone Path</option>
          {runes.map(path => (
            <option key={path.id} value={path.name}>{path.name}</option>
          ))}
        </select>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {validPrimarySlots.map((slot: any, idx: number) => (
            <select
              key={idx}
              name={`primary_slot${idx + 1}`}
              value={form[`primary_slot${idx + 1}` as keyof typeof form] ?? ''}
              onChange={(e) => setForm(prev => ({ ...prev, [`primary_slot${idx + 1}`]: e.target.value }))}
              className="p-2 bg-gray-800 rounded"
            >
              <option value="">Primary Slot {idx + 1}</option>
              {slot.runes.map((rune: any) => (
                <option key={rune.id} value={rune.name}>{rune.name}</option>
              ))}
            </select>
          ))}
        </div>

        <select
          name="secondary_path"
          value={form.secondary_path ?? ''}
          onChange={(e) => setForm(prev => ({ ...prev, secondary_path: e.target.value }))}
          className="w-full p-2 bg-gray-800 rounded"
        >
          <option value="">Select Secondary Path</option>
          {secondaryBranches.map((path) => (
            <option key={path.id} value={path.name}>{path.name}</option>
          ))}
        </select>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {validSecondarySlots.map((slot: any, idx: number) => (
            <select
              key={idx}
              name={`secondary_slot${idx + 1}`}
              value={form[`secondary_slot${idx + 1}` as keyof typeof form] ?? ''}
              onChange={(e) => setForm(prev => ({ ...prev, [`secondary_slot${idx + 1}`]: e.target.value }))}
              className="p-2 bg-gray-800 rounded"
            >
              <option value="">Secondary Slot {idx + 1}</option>
              {slot.runes.map((rune: any) => (
                <option key={rune.id} value={rune.name}>{rune.name}</option>
              ))}
            </select>
          ))}
        </div>

        <h2 className="text-lg font-semibold">Select Shards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[{
            name: "shard_offense", label: "Shard 1 (Offense)", options: SHARD_ROW_1
          }, {
            name: "shard_flex", label: "Shard 2 (Flex)", options: SHARD_ROW_2
          }, {
            name: "shard_defense", label: "Shard 3 (Defense)", options: SHARD_ROW_3
          }].map(({ name, label, options }) => (
            <select
              key={name}
              name={name}
              value={form[name as keyof typeof form] ?? ''}
              onChange={(e) => setForm(prev => ({ ...prev, [name]: e.target.value }))}
              className="p-2 bg-gray-800 rounded"
            >
              <option value="">{label}</option>
              {options.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          ))}
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

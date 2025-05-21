'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '@/utils/axios'

export default function CreateArticlePage() {
  const [form, setForm] = useState({
    titre: '',
    image_banner: '',
    categorie: '',
    contenu: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('access')
    if (!token) return setError('You must be logged in.')

    try {
      await API.post('articles/', form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setMessage('Article created successfully!')
      setTimeout(() => router.push('/articles'), 1500)
    } catch (err: any) {
      setError('Erreur : ' + JSON.stringify(err.response?.data || {}))
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-8 text-white">
      <h1 className="text-2xl font-bold mb-4">Create article</h1>
      {message && <p className="text-green-400">{message}</p>}
      {error && <p className="text-red-400">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="titre"
          placeholder="Titre"
          value={form.titre}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 rounded"
        />
        <input
          type="text"
          name="image_banner"
          placeholder="Image Banner URL (landscape recommended)"
          value={form.image_banner}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 rounded"
        />
        <select
          name="categorie"
          value={form.categorie}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 rounded"
        >
          <option value="">Choose a category</option>
          <option value="guide">Guide</option>
          <option value="news">News</option>
          <option value="patch">Patch</option>
          <option value="meta">Meta</option>
        </select>
        <textarea
          name="contenu"
          placeholder="Content (HTML autorized)"
          value={form.contenu}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 rounded h-40"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
        >
          Publish
        </button>
      </form>
    </div>
  )
}

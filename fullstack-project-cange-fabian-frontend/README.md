# LoL Builds Frontend

Frontend Next.js de l'application LoL Builds.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Axios (avec interceptors JWT)

## Prerequisites

- Node.js 18+
- API Django REST disponible localement

## Configuration

Créer (ou adapter) le fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/
```

## Run locally

```bash
npm install
npm run dev
```

Application disponible sur [http://localhost:3000](http://localhost:3000).

## Notes

- Le rendu HTML des articles est sanitizé côté client via `dompurify`.
- Les appels API passent par `utils/axios.ts` pour mutualiser base URL, auth Bearer et refresh automatique des tokens.

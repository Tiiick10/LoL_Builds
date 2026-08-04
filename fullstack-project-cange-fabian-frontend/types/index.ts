/**
 * Shared TypeScript types for the LoL Builds frontend.
 * All interfaces used across pages/components should live here.
 */

export interface User {
  id?: number
  username: string
}

export interface Champion {
  id?: number
  name: string
  image_url: string
  image?: { full: string }
}

export interface Avis {
  id?: number
  author: User
  date_poste: string
  positif: boolean
  commentaire: string
  banned: boolean
}

export interface Build {
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
  created_at?: string
  positive_comments?: number
  negative_comments?: number
}

export interface Article {
  id: number
  titre: string
  image_banner: string
  categorie: string
  contenu: string
  auteur: string
  date_creation?: string
}

export interface JWTPayload {
  user_id?: number
  username?: string
  role?: string
  is_superuser?: boolean
  exp?: number
  iat?: number
}

export interface BuildForm {
  name: string
  description: string
  role: string
  champion_name: string
  primary_path: string
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
}

export interface Rune {
  id: number
  name: string
  icon?: string
}

export interface RuneSlot {
  runes: Rune[]
}

export interface RunePath {
  id: number
  name: string
  icon?: string
  slots: RuneSlot[]
}

export interface ChampionSuggestion {
  id: string
  name: string
  image: { full: string }
  title?: string
}


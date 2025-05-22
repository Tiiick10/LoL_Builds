# League of Builds

## Description

**League of Builds** est une application web fullstack permettant aux utilisateurs de consulter, créer et gérer des builds de champions League of Legends. Les utilisateurs peuvent également publier des articles, voter sur les builds, et commenter les contributions des autres membres. Le projet propose une interface responsive moderne, avec des fonctionnalités spécifiques selon les rôles des utilisateurs (Membre, Rédacteur, Administrateur).

## Technologies utilisées

### Backend
- Python 3 / Django
- Django REST Framework
- Base de données SQLite (dev)

### Frontend
- React (Next.js)
- Tailwind CSS

## Fonctionnalités principales

### Authentification
- Inscription, connexion, déconnexion
- JWT Auth avec stockage local du token
- Middleware d’autorisation basé sur les rôles

### Utilisateurs
- 3 rôles : Admin, Redacteur, Member
- Interface conditionnelle selon les rôles
- Page `HeroSection` adaptative (boutons dynamiques)

### Builds
- Création de builds avec autocomplétion des champions
- Sélection dynamique de runes, shards et rôles
- Votes positifs/négatifs (une seule interaction par utilisateur)
- Édition et suppression inline des builds (par auteur ou admin)

### Articles
- Création d’articles par les rédacteurs et administrateurs
- Vue publique des articles avec filtre par catégorie
- Interface de création stylisée et sécurisée

### Administration
- Seeder complet (`seed.py`) pour :
  - Création d’utilisateurs (admin, rédacteur, membres aléatoires)
  - Importation des champions depuis l’API Riot
  - Importation des runes
  - Création aléatoire d’articles et de builds
- Interface d’administration (Django admin)

## Installation

```bash
# 1. Cloner le projet
git clone <repository_url>
cd fullstack_project_CANGE_FABIAN

# 2. Installer les dépendances backend
cd fullstack_project_CANGE_FABIAN_backend
python -m venv .venv
.venv\Scripts\activate  # ou source .venv/bin/activate sous MacOS
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# 3. Installer les dépendances frontend
cd ../fullstack-project-cange-fabian-frontend
npm install
npm run dev
```

## Scripts utiles

```bash
# Importer les champions
python manage.py import_champions

# Importer les runes
python manage.py populate_runes

# Lancer le seeder complet
python seed.py

```

## Accès à l’application

- **Frontend** : `http://localhost:3000`
- **Backend API** : `http://127.0.0.1:8000/api/`

## Notes

- Un fichier `.env` peut être requis pour configurer certaines variables comme la clé secrète Django.
- Un utilisateur admin par défaut est créé via le script `seed.py`.
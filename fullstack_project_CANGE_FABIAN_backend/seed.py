import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fullstack_project_CANGE_FABIAN_backend.settings')
django.setup()

from django.contrib.auth.models import User, Group
from build_LoL.models import Champion, Build, Article

# Delete all existing data
Build.objects.all().delete()
Article.objects.all().delete()
User.objects.exclude(is_superuser=True).delete()

# Users
admin = User.objects.create_superuser(username="admin", email="admin@test.com", password="admin123")
user = User.objects.create_user(username="user", email="user@test.com", password="user123")
redac = User.objects.create_user(username="Redac", email="redac@test.com", password="redac123")

users = []
for i in range(1, 11):
    u = User.objects.create_user(username=f"testuser{i}", email=f"user{i}@test.com", password="test123")
    users.append(u)

# Create roles if they don't exist
roles = ['User', 'Rédacteur', 'Manager', 'Admin']
for role_name in roles:
    Group.objects.get_or_create(name=role_name)

# Assign roles
admin.groups.add(Group.objects.get(name="Admin"))
user.groups.add(Group.objects.get(name="User"))
redac.groups.add(Group.objects.get(name="Rédacteur"))

for u in users:
    u.groups.add(Group.objects.get(name="User"))

# Builds
roles = ['top', 'jungle', 'mid', 'adc', 'support']

paths = ['Precision', 'Domination', 'Sorcery', 'Resolve', 'Inspiration']

keystones = {
    'Precision': ['Press the Attack', 'Lethal Tempo', 'Fleet Footwork', 'Conqueror'],
    'Domination': ['Electrocute', 'Dark Harvest', 'Hail of Blades'],
    'Sorcery': ['Summon Aery', 'Arcane Comet', 'Phase Rush'],
    'Resolve': ['Grasp of the Undying', 'Aftershock', 'Guardian'],
    'Inspiration': ['Glacial Augment', 'Unsealed Spellbook', 'First Strike'],
}

rune_slots = {
    'Precision': [
        ['Absorb Life', 'Triumph', 'Presence of Mind'],
        ['Legend: Alacrity', 'Legend: Haste', 'Legend: Bloodline'],
        ['Coup de Grace', 'Cut Down', 'Last Stand']
    ],
    'Domination': [
        ['Cheap Shot', 'Taste of Blood', 'Sudden Impact'],
        ['Deep Ward', 'Sixth Sense', 'Grisly Mementos'],
        ['Treasure Hunter', 'Relentless Hunter', 'Ultimate Hunter']
    ],
    'Sorcery': [
        ['Axiom Acanist', 'Manaflow Band', 'Nimbus Cloak'],
        ['Transcendence', 'Celerity', 'Absolute Focus'],
        ['Scorch', 'Waterwalking', 'Gathering Storm']
    ],
    'Resolve': [
        ['Demolish', 'Font of Life', 'Shield Bash'],
        ['Conditioning', 'Second Wind', 'Bone Plating'],
        ['Overgrowth', 'Revitalize', 'Unflinching']
    ],
    'Inspiration': [
        ['Hextech Flashtraption', 'Magical Footwear', 'Cash Back'],
        ['Triple Tonic', 'Time Warp Tonic', 'Biscuit Delivery'],
        ['Cosmic Insight', 'Approach Velocity', 'Jack of All Trades']
    ]
}

shards = [
    'adaptive_force', 'attack_speed', 'ability_haste',
    'movement_speed', 'bonus_health', 'tenacity'
]

champions = list(Champion.objects.all())
if not champions:
    print("No champions found. Please run the import_champions command first.")
    exit()

for i in range(10):
    champ = random.choice(champions)
    auteur = random.choice(users)
    role = random.choice(roles)

    primary_path = random.choice(paths)
    secondary_path = random.choice([p for p in paths if p != primary_path])

    keystone = random.choice(keystones[primary_path])
    primary_slots = [random.choice(slot_group) for slot_group in rune_slots[primary_path]]
    secondary_slots = [random.choice(slot_group) for slot_group in rune_slots[secondary_path][:2]]

    build = Build.objects.create(
        name=f"Build {champ.name} {i+1}",
        description=f"<p>Optimised for {role} with {champ.name}. Perfect synergy with {keystone}.</p>",
        author=auteur,
        role=role,
        champion=champ,
        primary_path=primary_path,
        keystone=keystone,
        primary_slot1=primary_slots[0],
        primary_slot2=primary_slots[1],
        primary_slot3=primary_slots[2],
        secondary_path=secondary_path,
        secondary_slot1=secondary_slots[0],
        secondary_slot2=secondary_slots[1],
        shard_offense=random.choice(shards),
        shard_flex=random.choice(shards),
        shard_defense=random.choice(shards),
    )

print("10 builds generated ")

# Articles
categories = ['guide', 'news', 'patch', 'meta']
for i in range(10):
    titre = f"Article {i+1}"
    image = "https://via.placeholder.com/1200x400.png?text=Banner"
    contenu = f"<h2>LoL Article n°{i+1}</h2><p>Actual Meta : itemis and aggressive gameplay.</p>"

    Article.objects.create(
        titre=titre,
        image_banner=image,
        categorie=random.choice(categories),
        contenu=contenu,
        auteur=redac,
    )

print("10 articles generated ")
print("Users, builds and articles created successfully.")

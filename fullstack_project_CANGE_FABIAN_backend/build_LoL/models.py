from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Champion(models.Model):
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    image_url = models.URLField()

    def __str__(self):
        return self.name

class Build(models.Model):
    ROLE_CHOICES = [
        ('top', 'Top'),
        ('jungle', 'Jungle'),
        ('mid', 'Mid'),
        ('adc', 'ADC'),
        ('support', 'Support'),
    ]

    PATH_CHOICES = [
        ('Precision', 'Precision'),
        ('Domination', 'Domination'),
        ('Sorcery', 'Sorcery'),
        ('Resolve', 'Resolve'),
        ('Inspiration', 'Inspiration'),
    ]

    SHARD_CHOICES = [
        ('adaptive_force', 'Adaptive Force'),
        ('attack_speed', 'Attack Speed'),
        ('ability_haste', 'Ability Haste'),
        ('movement_speed', 'Movement Speed'),
        ('bonus_health', 'Bonus Health'),
        ('tenacity', 'Tenacity and Slow Resist'),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    champion = models.ForeignKey(Champion, on_delete=models.CASCADE)

    # Runes - Primary
    primary_path = models.CharField(max_length=20, choices=PATH_CHOICES, blank=True, null=True)
    keystone = models.CharField(max_length=50, blank=True, null=True)
    primary_slot1 = models.CharField(max_length=50, blank=True, null=True)
    primary_slot2 = models.CharField(max_length=50, blank=True, null=True)
    primary_slot3 = models.CharField(max_length=50, blank=True, null=True)

    # Runes - Secondary
    secondary_path = models.CharField(max_length=20, choices=PATH_CHOICES, blank=True, null=True)
    secondary_slot1 = models.CharField(max_length=50, blank=True, null=True)
    secondary_slot2 = models.CharField(max_length=50, blank=True, null=True)

    # Shards
    shard_offense = models.CharField(max_length=30, choices=SHARD_CHOICES, blank=True, null=True)
    shard_flex = models.CharField(max_length=30, choices=SHARD_CHOICES, blank=True, null=True)
    shard_defense = models.CharField(max_length=30, choices=SHARD_CHOICES, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class AvisBuild(models.Model):
    build = models.ForeignKey('Build', on_delete=models.CASCADE, related_name='avis')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    positif = models.BooleanField()
    commentaire = models.TextField(blank=True)
    date_poste = models.DateTimeField(auto_now_add=True)
    banned = models.BooleanField(default=False)

    def __str__(self):
        return f"Avis de {self.author.username} sur {self.build.name}"


class Article(models.Model):
    CATEGORIE_CHOICES = [
        ('guide', 'Guide'),
        ('news', 'News'),
        ('patch', 'Patch'),
        ('meta', 'Meta'),
    ]

    titre = models.CharField(max_length=200)
    image_banner = models.URLField()
    categorie = models.CharField(max_length=50, choices=CATEGORIE_CHOICES)
    contenu = models.TextField()
    auteur = models.ForeignKey(User, on_delete=models.CASCADE)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titre

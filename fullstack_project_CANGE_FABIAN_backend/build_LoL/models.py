from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

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
    ('StatModsAdaptiveForceIcon', 'Adaptive Force'),
    ('StatModsArmorIcon', 'Armor'),
    ('StatModsAttackSpeedIcon', 'Attack Speed'),
    ('StatModsCDRScalingIcon', 'Ability Haste'),
    ('StatModsHealthScalingIcon', 'Bonus Health'),
    ('StatModsMagicResIcon', 'Magic Resist'),
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
    shard_offense = models.CharField(max_length=64, choices=SHARD_CHOICES, default='StatModsAdaptiveForceIcon')
    shard_flex = models.CharField(max_length=64, choices=SHARD_CHOICES, default='StatModsAdaptiveForceIcon')
    shard_defense = models.CharField( max_length=64, choices=SHARD_CHOICES, default='StatModsArmorIcon')



    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
    is_public = models.BooleanField(default=True)

    def get_rune_icon_url(self, rune_name):
        from build_LoL.models import Rune
        try:
            rune = Rune.objects.get(name__iexact=rune_name)
            return rune.icon_url()
        except Rune.DoesNotExist:
            return None

    def keystone_icon_url(self):
        return self.get_rune_icon_url(self.keystone)

    def primary_slot1_icon_url(self):
        return self.get_rune_icon_url(self.primary_slot1)

    def primary_slot2_icon_url(self):
        return self.get_rune_icon_url(self.primary_slot2)

    def primary_slot3_icon_url(self):
        return self.get_rune_icon_url(self.primary_slot3)

    def secondary_slot1_icon_url(self):
        return self.get_rune_icon_url(self.secondary_slot1)

    def secondary_slot2_icon_url(self):
        return self.get_rune_icon_url(self.secondary_slot2)

    def primary_path_icon_url(self):
        return self.get_rune_icon_url(self.primary_path)

    def secondary_path_icon_url(self):
        return self.get_rune_icon_url(self.secondary_path)
    
    def shard_offense_icon_url(self):
        return self.get_rune_icon_url(self.shard_offense)
    
    def shard_flex_icon_url(self):
        return self.get_rune_icon_url(self.shard_flex)
    
    def shard_defense_icon_url(self):
        return self.get_rune_icon_url(self.shard_defense)

class Rune(models.Model):
    riot_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=100)
    icon_path = models.CharField(max_length=255)

    def icon_url(self):
        return f"https://ddragon.canisback.com/img/{self.icon_path}"

    def __str__(self):
        return self.name


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

class AvisBuild(models.Model):
    build = models.ForeignKey(Build, on_delete=models.CASCADE, related_name='avis')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    positif = models.BooleanField()
    commentaire = models.TextField(blank=True)
    date_poste = models.DateTimeField(default=timezone.now)
    banned = models.BooleanField(default=False)

    def __str__(self):
        return f"Avis by {self.author.username} on {self.build.name}"
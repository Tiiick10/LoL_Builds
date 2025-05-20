from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Champion, Build, AvisBuild, Article, Rune

# User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

# Champion

class ChampionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Champion
        fields = '__all__'

# Rune

class RuneSerializer(serializers.ModelSerializer):
    icon_url = serializers.SerializerMethodField()

    class Meta:
        model = Rune
        fields = ['id', 'name', 'icon_path', 'icon_url']

    def get_icon_url(self, obj):
        if obj.icon_path.startswith("perk-images/"):
            return f"https://ddragon.canisback.com/img/{obj.icon_path}"
        else:
            return f"/images/custom-runes/{obj.icon_path.split('/')[-1]}"

# Avis

class AvisBuildSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = AvisBuild
        fields = ['positif', 'commentaire', 'date_poste', 'banned', 'author']

# Build detail

class BuildSerializer(serializers.ModelSerializer):
    champion = serializers.PrimaryKeyRelatedField(queryset=Champion.objects.all())
    author = UserSerializer(read_only=True)
    avis = AvisBuildSerializer(many=True, read_only=True)

    keystone_icon_url = serializers.SerializerMethodField()
    primary_slot1_icon_url = serializers.SerializerMethodField()
    primary_slot2_icon_url = serializers.SerializerMethodField()
    primary_slot3_icon_url = serializers.SerializerMethodField()
    secondary_slot1_icon_url = serializers.SerializerMethodField()
    secondary_slot2_icon_url = serializers.SerializerMethodField()
    primary_path_icon_url = serializers.SerializerMethodField()
    secondary_path_icon_url = serializers.SerializerMethodField()
    shard_offense_icon_url = serializers.SerializerMethodField()
    shard_flex_icon_url = serializers.SerializerMethodField()
    shard_defense_icon_url = serializers.SerializerMethodField()

    class Meta:
        model = Build
        fields = '__all__'
        read_only_fields = ['author']

    def get_keystone_icon_url(self, obj):
        return obj.keystone_icon_url()

    def get_primary_slot1_icon_url(self, obj):
        return obj.primary_slot1_icon_url()

    def get_primary_slot2_icon_url(self, obj):
        return obj.primary_slot2_icon_url()

    def get_primary_slot3_icon_url(self, obj):
        return obj.primary_slot3_icon_url()

    def get_secondary_slot1_icon_url(self, obj):
        return obj.secondary_slot1_icon_url()

    def get_secondary_slot2_icon_url(self, obj):
        return obj.secondary_slot2_icon_url()

    def get_primary_path_icon_url(self, obj):
        return obj.primary_path_icon_url()

    def get_secondary_path_icon_url(self, obj):
        return obj.secondary_path_icon_url()

    def get_shard_offense_icon_url(self, obj):
        return f"https://ddragon.canisback.com/img/perk-images/StatMods/{obj.shard_offense}.png"

    def get_shard_flex_icon_url(self, obj):
        return f"https://ddragon.canisback.com/img/perk-images/StatMods/{obj.shard_flex}.png"

    def get_shard_defense_icon_url(self, obj):
        return f"https://ddragon.canisback.com/img/perk-images/StatMods/{obj.shard_defense}.png"

# Build List (summary)

class BuildListSerializer(serializers.ModelSerializer):
    champion = ChampionSerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    dislikes = serializers.SerializerMethodField()
    positive_comments = serializers.IntegerField(read_only=True)
    negative_comments = serializers.IntegerField(read_only=True)
    keystone_icon_url = serializers.SerializerMethodField()
    primary_slot1_icon_url = serializers.SerializerMethodField()
    primary_slot2_icon_url = serializers.SerializerMethodField()
    primary_slot3_icon_url = serializers.SerializerMethodField()
    secondary_slot1_icon_url = serializers.SerializerMethodField()
    secondary_slot2_icon_url = serializers.SerializerMethodField()
    primary_path_icon_url = serializers.SerializerMethodField()
    secondary_path_icon_url = serializers.SerializerMethodField()

    class Meta:
        model = Build
        fields = [
            'id', 'name', 'champion', 'image_url', 'role',
            'likes', 'dislikes', 'keystone_icon_url',
            'positive_comments', 'negative_comments',
            'primary_slot1_icon_url', 'primary_slot2_icon_url', 
            'primary_slot3_icon_url','secondary_slot1_icon_url', 
            'secondary_slot2_icon_url','primary_path_icon_url', 
            'secondary_path_icon_url' , 'primary_slot1', 
            'primary_slot2', 'primary_slot3',
            'secondary_slot1', 'secondary_slot2',
        ]

    def get_image_url(self, obj):
        return obj.champion.image_url if obj.champion else None

    def get_likes(self, obj):
        return obj.avis.filter(positif=True).count()

    def get_dislikes(self, obj):
        return obj.avis.filter(positif=False).count()
    def get_keystone_icon_url(self, obj):
        return obj.keystone_icon_url()

    def get_primary_slot1_icon_url(self, obj):
        return obj.primary_slot1_icon_url()

    def get_primary_slot2_icon_url(self, obj):
        return obj.primary_slot2_icon_url()

    def get_primary_slot3_icon_url(self, obj):
        return obj.primary_slot3_icon_url()

    def get_secondary_slot1_icon_url(self, obj):
        return obj.secondary_slot1_icon_url()

    def get_secondary_slot2_icon_url(self, obj):
        return obj.secondary_slot2_icon_url()

    def get_primary_path_icon_url(self, obj):
        return obj.primary_path_icon_url()

    def get_secondary_path_icon_url(self, obj):
        return obj.secondary_path_icon_url()

# Article

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'

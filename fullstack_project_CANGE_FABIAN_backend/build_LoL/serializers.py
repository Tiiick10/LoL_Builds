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
        return f"https://ddragon.canisback.com/img/{obj.icon_path}"

# Avis

class AvisBuildSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = AvisBuild
        fields = ['positif', 'commentaire', 'date_poste', 'banned', 'author']

# Build detail

class BuildSerializer(serializers.ModelSerializer):
    champion = ChampionSerializer()
    avis = AvisBuildSerializer(many=True, read_only=True)
    user_vote = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    dislikes = serializers.SerializerMethodField()

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

    def get_user_vote(self, obj):
        user = self.context.get('request').user
        if not user or not user.is_authenticated:
            return None
        vote = AvisBuild.objects.filter(author=user, build=obj).first()
        return vote.positif if vote else None

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

    def get_shard_offense_icon_url(self, obj):
        return f"https://ddragon.canisback.com/img/perk-images/StatMods/{obj.shard_offense}.png"

    def get_shard_flex_icon_url(self, obj):
        return f"https://ddragon.canisback.com/img/perk-images/StatMods/{obj.shard_flex}.png"

    def get_shard_defense_icon_url(self, obj):
        return f"https://ddragon.canisback.com/img/perk-images/StatMods/{obj.shard_defense}.png"



# Build List (summary)

class BuildListSerializer(serializers.ModelSerializer):
    champion_name = serializers.CharField(source='champion.name')
    image_url = serializers.CharField(source='champion.image_url')
    likes = serializers.SerializerMethodField()
    dislikes = serializers.SerializerMethodField()

    class Meta:
        model = Build
        fields = ['id', 'name', 'champion_name', 'image_url', 'role', 'likes', 'dislikes', 'keystone_icon_url']

    def get_likes(self, obj):
        return obj.avis.filter(positif=True).count()

    def get_dislikes(self, obj):
        return obj.avis.filter(positif=False).count()

# Article

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'

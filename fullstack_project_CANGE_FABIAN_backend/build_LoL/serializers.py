from rest_framework import serializers
from .models import Champion, Build, AvisBuild, Article, Rune

class ChampionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Champion
        fields = '__all__'

class RuneSerializer(serializers.ModelSerializer):
    icon_url = serializers.SerializerMethodField()

    class Meta:
        model = Rune
        fields = ['id', 'name', 'icon_path', 'icon_url']

    def get_icon_url(self, obj):
        return f"https://ddragon.canisback.com/img/{obj.icon_path}"

class BuildListSerializer(serializers.ModelSerializer):
    champion_name = serializers.CharField(source='champion.name')
    image_url = serializers.CharField(source='champion.image_url')
    likes = serializers.SerializerMethodField()
    dislikes = serializers.SerializerMethodField()

    class Meta:
        model = Build
        fields = ['id', 'name', 'champion_name', 'image_url', 'role', 'likes', 'dislikes', 'rune_major']

    def get_likes(self, obj):
        return obj.nb_likes() if hasattr(obj, 'nb_likes') else 0

    def get_dislikes(self, obj):
        return obj.nb_dislikes() if hasattr(obj, 'nb_dislikes') else 0


class BuildSerializer(serializers.ModelSerializer):
    champion = ChampionSerializer()
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
        fields = '__all__'

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

class AvisBuildSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvisBuild
        fields = '__all__'

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'

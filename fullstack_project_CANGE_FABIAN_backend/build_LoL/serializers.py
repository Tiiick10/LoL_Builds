from rest_framework import serializers
from .models import Champion, Build, AvisBuild, Article, AvisBuild

class ChampionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Champion
        fields = '__all__'

class BuildSerializer(serializers.ModelSerializer):
    champion = ChampionSerializer(read_only=True)

    class Meta:
        model = Build
        fields = '__all__'

class AvisBuildSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvisBuild
        fields = '__all__'


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'
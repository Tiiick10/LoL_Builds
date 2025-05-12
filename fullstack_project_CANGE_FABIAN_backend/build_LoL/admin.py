from django.contrib import admin
from .models import Champion, Build, AvisBuild, Article

# Register your models here.

admin.site.register(Champion)
admin.site.register(Build)
admin.site.register(AvisBuild)
admin.site.register(Article)
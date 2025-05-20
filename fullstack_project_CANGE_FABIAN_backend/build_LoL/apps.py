from django.apps import AppConfig


class BuildLolConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'build_LoL'

    def ready(self):
        import build_LoL.signals

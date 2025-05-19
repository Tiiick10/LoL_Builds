import requests
from django.core.management.base import BaseCommand
from build_LoL.models import Rune

RUNES_URL = "https://ddragon.leagueoflegends.com/cdn/15.9.1/data/en_US/runesReforged.json"

class Command(BaseCommand):
    help = 'Populate the database with all available runes from Riot API'

    def handle(self, *args, **kwargs):
        response = requests.get(RUNES_URL)
        data = response.json()
        count = 0

        for path in data:
            # Path (Primary and Secondary Runes)
            Rune.objects.update_or_create(
                riot_id=path["id"],
                defaults={
                    "name": path["name"],
                    "icon_path": path["icon"],
                }
            )
            count += 1

            # Intern Slots (Primary and Secondary Runes)
            for slot in path["slots"]:
                for rune in slot["runes"]:
                    Rune.objects.update_or_create(
                        riot_id=rune["id"],
                        defaults={
                            "name": rune["name"],
                            "icon_path": rune["icon"],
                        }
                    )
                    count += 1

        self.stdout.write(self.style.SUCCESS(f"✅ {count} runes successfully registered."))

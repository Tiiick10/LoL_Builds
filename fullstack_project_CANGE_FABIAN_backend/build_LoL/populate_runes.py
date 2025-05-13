import requests
from build_LoL.models import Rune

RUNES_URL = "https://ddragon.leagueoflegends.com/cdn/15.9.1/data/en_US/runesReforged.json"

def populate_runes():
    response = requests.get(RUNES_URL)
    data = response.json()

    count = 0

    for path in data:
        # Keystone (ex: Domination, Precision)
        Rune.objects.update_or_create(
            riot_id=path["id"],
            defaults={
                "name": path["name"],
                "icon_path": path["icon"],
            }
        )
        count += 1

        # Inner slots (keystones and others)
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

    print(f"{count} registered runes.")

if __name__ == "__main__":
    populate_runes()

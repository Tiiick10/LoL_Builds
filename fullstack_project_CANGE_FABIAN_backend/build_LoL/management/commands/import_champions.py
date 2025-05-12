import requests
from django.core.management.base import BaseCommand
from build_LoL.models import Champion

class Command(BaseCommand):
    help = 'Import champions from Riot Data Dragon'

    def handle(self, *args, **kwargs):
        url = "https://ddragon.leagueoflegends.com/cdn/15.9.1/data/en_US/champion.json"
        response = requests.get(url)

        if response.status_code != 200:
            self.stdout.write(self.style.ERROR("Error wwhile fetching data from Riot API"))
            self.stdout.write(self.style.ERROR(f"Status code: {response.status_code}"))
            self.stdout.write(self.style.ERROR(f"Response: {response.text}"))
            return

        data = response.json()
        champions_data = data['data']

        Champion.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("Old champions deleted"))
        self.stdout.write(self.style.SUCCESS("Importing champions..."))

        for champ_key, champ_info in champions_data.items():
            name = champ_info['id']
            title = champ_info['title']
            image_url = f"https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/{name}.png"

            champion, created = Champion.objects.get_or_create(
                name=name,
                defaults={
                    'title': title,
                    'image_url': image_url
                }
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f"Champion added : {name}"))
            else:
                self.stdout.write(f"Champion already exists : {name}")

from PIL import Image
from pathlib import Path
names = {
    'portrait': '7f68e6a69f28db00',
    'smile': '8599c2a8464b79b6',
    'lip-detail': '66fa05a090020044',
    'skincare': '68eba9be44d3496d',
    'makeup': '6d60bb3fff785bb8',
    'products': 'f49d4d11dad2ee57',
    'brilla': 'e827e55c28c40de0',
    'kiss': 'cb5ff62e51b97469',
}
for name, source in names.items():
    image = Image.open(Path('assets/photos') / (source + '.JPG')).convert('RGB')
    image.save(Path('assets/photos') / (name + '.webp'), quality=86, method=6)

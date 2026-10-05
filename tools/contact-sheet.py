from PIL import Image, ImageOps, ImageDraw
from pathlib import Path
photos = sorted(Path('assets/photos').glob('*.JPG'))
sheet = Image.new('RGB', (1100, ((len(photos)+5)//6)*210), '#f3ede4')
draw = ImageDraw.Draw(sheet)
for i, path in enumerate(photos):
    image = Image.open(path)
    thumb = ImageOps.contain(image, (174, 175))
    x, y = (i%6)*182, (i//6)*210
    sheet.paste(thumb, (x+(174-thumb.width)//2,y))
    draw.text((x+2,y+180),path.stem,fill='#302014')
sheet.save('qa/photo-contact-sheet.jpg')

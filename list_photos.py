import os
from pathlib import Path

photo_dir = Path(r'C:\熊的文件\百天照')
photos = []

# 获取所有jpg文件
for file in sorted(photo_dir.glob('*.jpg')):
    print(f"{{ url: './百天照/{file.name}', title: '熊睿霖百天照' }},") 
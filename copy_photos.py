import os
import shutil
from pathlib import Path

# 源文件夹和目标文件夹
src_dir = r"C:\熊的文件\百天照"
dst_dir = r"C:\熊的文件\代码\images"

# 确保目标文件夹存在
os.makedirs(dst_dir, exist_ok=True)

# 获取所有jpg文件并排序
photos = sorted([f for f in os.listdir(src_dir) if f.lower().endswith('.jpg')])

# 复制并重命名文件
for i, photo in enumerate(photos, start=1116):
    src_file = os.path.join(src_dir, photo)
    dst_file = os.path.join(dst_dir, f"198A{i}.jpg")
    shutil.copy2(src_file, dst_file)
    print(f"复制: {photo} -> 198A{i}.jpg")

print("完成！") 
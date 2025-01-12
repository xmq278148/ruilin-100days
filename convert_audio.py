from pydub import AudioSegment
import os

# 输入和输出文件路径
input_file = os.path.join('music', 'background.flac')
output_file = os.path.join('music', 'background.mp3')

# 转换音频
audio = AudioSegment.from_file(input_file)
audio.export(output_file, format='mp3')

print(f"转换完成: {output_file}") 
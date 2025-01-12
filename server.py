from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 留言数据文件
MESSAGES_FILE = 'messages.json'

# 确保留言文件存在
if not os.path.exists(MESSAGES_FILE):
    with open(MESSAGES_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f)

# 读取留言
def read_messages():
    with open(MESSAGES_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

# 写入留言
def write_messages(messages):
    with open(MESSAGES_FILE, 'w', encoding='utf-8') as f:
        json.dump(messages, f, ensure_ascii=False)

# 获取所有留言
@app.route('/api/messages', methods=['GET'])
def get_messages():
    messages = read_messages()
    return jsonify(messages)

# 添加新留言
@app.route('/api/messages', methods=['POST'])
def add_message():
    message = request.json
    messages = read_messages()
    messages.append(message)
    write_messages(messages)
    return jsonify(message)

# 删除留言
@app.route('/api/messages/<message_id>', methods=['DELETE'])
def delete_message(message_id):
    messages = read_messages()
    messages = [m for m in messages if m['id'] != message_id]
    write_messages(messages)
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(port=5000) 
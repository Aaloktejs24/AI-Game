from flask import Flask, request, jsonify
import os, requests, json, unicodedata
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

API_KEY = os.getenv("GEMINI_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"

def sanitize_text(text):
    return unicodedata.normalize("NFKD", text).encode("utf-8", "ignore").decode("utf-8")

@app.route("/generate-assets", methods=["POST"])
def generate_assets():
    data = request.get_json()
    prompt = sanitize_text(data.get("prompt", ""))

    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{
            "parts": [{
                "text": (
                    f"Create a creative game concept based on the prompt '{prompt}'. "
                    "Give strictly JSON with: `backgroundDescription`, `characterName`, `characterAppearance`, `themeStyle`, `obstacleDescription`. "
                    "Keep it compact for a 2D arcade game."
                )
            }]
        }]
    }

    try:
        res = requests.post(API_URL, headers=headers, json=payload)
        result = res.json()
        raw_text = result["candidates"][0]["content"]["parts"][0]["text"]
        if "```" in raw_text:
            raw_text = raw_text.split("```json")[-1].split("```")[0].strip()
        assets = json.loads(raw_text)

        # 🔥 Generate Pollinations image URLs
        bg_url = f"https://image.pollinations.ai/prompt/a pixel art {assets['themeStyle']} {assets['backgroundDescription']}"
        char_url = f"https://image.pollinations.ai/prompt/a pixel art character {assets['characterName']} {assets['characterAppearance']}"

        assets["backgroundDescription"] = bg_url
        assets["characterSprite"] = char_url

        return jsonify({
            "assets": {
                "background": assets.get("backgroundDescription", ""),
                "character": assets.get("characterName", ""),
                "appearance": assets.get("characterAppearance", ""),
                "themeStyle": assets.get("themeStyle", ""),
                "obstacle": assets.get("obstacleDescription", ""),
                "characterSprite": assets.get("characterSprite", "")
            }
        })
    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=6006)
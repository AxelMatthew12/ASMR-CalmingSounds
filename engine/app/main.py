import json
import os
import shutil
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Import service yang sudah kita buat sebelumnya
from app.services.sst_services import stt_service
from app.services.recommend import recommend_service

app = FastAPI(title="Personalized ASMR Platform API")

# --- CORS MIDDLEWARE ---
# Sangat krusial untuk hackathon agar frontend bisa menembak API tanpa diblokir browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Folder temporary untuk menyimpan file audio rekaman user sebelum di-transcribe
TEMP_DIR = os.path.join(os.path.dirname(__file__), "temp")
os.makedirs(TEMP_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"status": "success", "message": "ASMR Recommendation API is running!"}

@app.post("/api/recommend")
async def get_asmr_recommendation(
    audio: UploadFile = File(...),
    preferences: str = Form(...) # Kita terima data Trigger Test berbentuk JSON string
):
    try:
        # 1. Parse preferensi user dari string ke Python Dictionary
        user_prefs = json.loads(preferences)
    except Exception:
        raise HTTPException(status_code=400, detail="Format preferences harus berupa JSON string yang valid.")

    # 2. Simpan file audio dari frontend ke folder lokal temp secara sementara
    temp_file_path = os.path.join(TEMP_DIR, audio.filename)
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

    try:
        # 3. Proses Audio menggunakan Whisper STT
        print(f"Processing audio: {audio.filename}...")
        transcribed_text = stt_service.transcribe(temp_file_path)
        print(f"Transcription Result: '{transcribed_text}'")

        # Jika suara tidak terdeteksi atau kosong
        if not transcribed_text:
            return {
                "query_text": "",
                "recommendations": [],
                "message": "Suara tidak terdengar jelas, silakan coba lagi."
            }

        # 4. Jalankan Algoritma Cosine Similarity + Hard Filtering
        recommendations = recommend_service.get_recommendations(transcribed_text, user_prefs)

        return {
            "query_text": transcribed_text,
            "recommendations": recommendations
        }

    except Exception as e:
        print(f"Error during processing: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        # 5. Hapus file audio temp agar penyimpanan laptop tidak bengkak saat demo
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
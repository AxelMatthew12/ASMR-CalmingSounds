import os
from transformers import pipeline

class STTService:
    def __init__(self):
        print("Loading Whisper Base Model...")
        # Kita tetap pakai model 'base' karena jauh lebih akurat untuk bahasa Indonesia
        self.pipe = pipeline(
            "automatic-speech-recognition", 
            model="openai/whisper-base"
        )
        print("Whisper Base Model loaded successfully!")

    def transcribe(self, file_path: str) -> str:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File audio tidak ditemukan di: {file_path}")
        
        # Bersihkan generate_kwargs, cukup tentukan bahasa dan task utamanya saja
        result = self.pipe(
            file_path, 
            generate_kwargs={
                "language": "english",
                "task": "transcribe"
            }
        )
        
        if isinstance(result, dict):
            return result.get("text", "").strip()
        elif isinstance(result, list) and len(result) > 0:
            return result[0].get("text", "").strip()
            
        return ""

stt_service = STTService()
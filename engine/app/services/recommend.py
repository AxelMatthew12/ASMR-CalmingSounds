import os
import requests
from dotenv import load_dotenv
from app.services.embed import embed_service

# Load environment variables dari file .env di folder root engine
load_dotenv()

class RecommendService:
    def __init__(self):
        # Mengambil API Key dari environment variable secara aman
        self.api_key = os.getenv("YOUTUBE_API_KEY")
        self.search_url = "https://www.googleapis.com/youtube/v3/search"
        
        if not self.api_key:
            print("⚠️ WARNING: YOUTUBE_API_KEY tidak terbaca! Pastikan file .env sudah dikonfigurasi.")
            
        print("YouTube Live API Recommendation Engine Ready!")

    def search_youtube_asmr(self, query_text: str) -> list:
        """Menembak Live API YouTube untuk mencari video ASMR yang relevan"""
        search_query = f"{query_text} ASMR"
        
        params = {
            "part": "snippet",
            "q": search_query,
            "maxResults": 12,  # Ambil 12 video teratas dari YouTube
            "type": "video",
            "key": self.api_key
        }

        try:
            response = requests.get(self.search_url, params=params)
            results = response.json()
            
            if "error" in results:
                print(f"YouTube API Error: {results['error']['message']}")
                return []

            extracted_videos = []
            for item in results.get("items", []):
                # Validasi untuk memastikan id video ada (menghindari channel/playlist id)
                if "videoId" not in item["id"]:
                    continue
                    
                title = item["snippet"]["title"]
                description = item["snippet"]["description"]
                
                extracted_videos.append({
                    "video_id": item["id"]["videoId"],
                    "title": title,
                    "description": description,
                    # Jalankan fungsi otomatis scanning kata kunci untuk filter misophonia
                    "tags": self.extract_tags_from_text(title, description)
                })
            return extracted_videos
            
        except Exception as e:
            print(f"Gagal terhubung ke YouTube API: {str(e)}")
            return []

    def extract_tags_from_text(self, title: str, description: str) -> list:
        """Memindai teks judul/deskripsi untuk mengelompokkan kategori ASMR demi Hard Filtering"""
        text = f"{title} {description}".lower()
        tags = []
        
        if "tap" in text or "ketuk" in text or "scratch" in text or "gesek" in text:
            tags.append("tapping")
        if "whisper" in text or "bisik" in text or "soft spoken" in text or "suara lembut" in text:
            tags.append("whispering")
        if "rain" in text or "hujan" in text or "ambient" in text or "nature" in text or "sound" in text:
            tags.append("ambient")
        if "visual" in text or "paint" in text or "no audio" in text or "tanpa suara" in text:
            tags.append("visual_only")
            
        return tags

    def get_recommendations(self, query_text: str, user_preferences: dict) -> list:
        """
        Mendapatkan list rekomendasi gabungan YouTube API + Cosine Similarity + Hard Filter
        """
        if not query_text:
            return []

        # 1. Ambil 12 video ASMR real-time langsung dari YouTube lewat API
        live_videos = self.search_youtube_asmr(query_text)
        
        # 2. Ubah teks query suara user menjadi vektor embedding
        query_vector = embed_service.get_embedding(query_text)
        
        recommended_list = []

        for video in live_videos:
            # --- LANGKAH 1: HARD FILTERING (Misophonia Check) ---
            is_allowed = True
            for tag in video['tags']:
                # Jika tag video ditandai 'False' oleh user, blokir video ini
                if user_preferences.get(tag) is False:
                    is_allowed = False
                    break
            
            if not is_allowed:
                continue  # Skip jika mengandung trigger misophonia yang dibenci user
                
            # --- LANGKAH 2: COSINE SIMILARITY ON THE FLY ---
            # Karena datanya live dari YouTube, kita hitung embedding teks video secara real-time
            combined_text = f"{video['title']} {video['description']}"
            video_vector = embed_service.get_embedding(combined_text)
            
            similarity_score = embed_service.calculate_similarity(query_vector, video_vector)
            
            recommended_list.append({
                "video_id": video["video_id"],
                "title": video["title"],
                "tags": video["tags"],
                "description": video["description"],
                "score": round(similarity_score, 4)
            })

        # 3. Urutkan hasil dari skor kemiripan tertinggi ke terendah
        recommended_list.sort(key=lambda x: x["score"], reverse=True)
        
        return recommended_list

# Inisialisasi singleton instance
recommend_service = RecommendService()
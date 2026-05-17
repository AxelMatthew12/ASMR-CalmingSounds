import numpy as np
from sentence_transformers import SentenceTransformer

class EmbedService:
    def __init__(self):
        print("Loading Multilingual MiniLM Model...")
        # Model ini pintar memahami kesamaan makna dalam Bahasa Indonesia & Inggris
        self.model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
        print("MiniLM Model loaded successfully!")

    def get_embedding(self, text: str) -> list:
        """
        Mengubah teks menjadi list koordinat vektor (embedding)
        """
        if not text:
            return []
        embedding = self.model.encode(text)
        # Mengubah numpy array menjadi list biasa agar mudah di-serialize ke JSON
        return embedding.tolist()

    def calculate_similarity(self, vec1: list, vec2: list) -> float:
        """
        Menghitung Cosine Similarity antara dua buah vektor
        """
        a = np.array(vec1)
        b = np.array(vec2)
        
        # Rumus matematika Cosine Similarity
        dot_product = np.dot(a, b)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        
        if norm_a == 0 or norm_b == 0:
            return 0.0
            
        return float(dot_product / (norm_a * norm_b))

# Inisialisasi singleton instance
embed_service = EmbedService()
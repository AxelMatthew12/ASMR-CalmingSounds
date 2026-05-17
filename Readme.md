# 💤 SnoozeAI - AI-Powered Personalized ASMR Therapy Platform

SnoozeAI adalah sebuah platform terapi ASMR personal berbasis web (**Single Page Application**) yang dirancang khusus untuk membantu penderita insomnia, gangguan kecemasan, dan **misophonia** (sensitivitas ekstrem terhadap suara pemicu tertentu). 

Aplikasi ini mengintegrasikan **Speech-to-Text (NLP)** untuk memproses keluhan tidur pengguna lewat suara, melakukan penyaringan berbasis preferensi sensorik (**Hard Filtering Engine**), dan mencocokkan konten video terbaik dari **YouTube API** secara *real-time* menggunakan kalkulasi **Semantic Cosine Similarity**.

---

## 🚀 Fitur Utama

1. **Voice-Activated Audio Search:** Pengguna cukup menekan tombol mikrofon dan membisikkan kondisi atau suasana tidur ideal yang mereka inginkan (misal: *"Saya sedang overthinking dan butuh suara hujan"*).
2. **Anti-Misophonia Hard Filtering Engine:** Fitur mitigasi trauma sensorik. Pengguna dapat memilih pemicu suara yang mereka benci (seperti *Tapping*, *Scratching*, atau *Whispering*). Sistem secara otomatis memblokir video yang mengandung komponen suara tersebut.
3. **Semantic Hybrid Recommendation System:** Mengombinasikan hasil pencarian *live* YouTube API dengan pencocokan kontekstual berbasis vektor *embedding* teks untuk mengurutkan playlist berdasarkan skor kemiripan tertinggi (*% Match*).
4. **Circadian-Friendly Dark Interface:** Desain antarmuka premium berbasis *glassmorphism* dengan spektrum warna dingin (*deep slate, midnight blue*) untuk meredakan ketegangan mata di malam hari.

---

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS
* HTML5 Media Recorder API

**Backend (Engine):**
* FastAPI (Python)
* Uvicorn (ASGI Server)
* Hugging Face Transformers (Whisper Base & MiniLM Multilingual)
* Requests (YouTube Data API v3 Integration)

---

## 📁 Struktur Direktori

```text
SnoozeAI/
├── engine/               # Backend Service (FastAPI)
│   ├── app/
│   │   ├── services/
│   │   │   ├── embed.py      # Cosine Similarity & Vector Embedding
│   │   │   └── recommend.py  # YouTube API & Hard Filtering Logic
│   │   └── main.py       # API Routes Entry Point
│   ├── .env              # Kredensial Rahasia (Diabaikan oleh Git)
│   ├── .gitignore        # Aturan Pengabaian Berkas Backend
│   └── requirements.txt  # Dependensi Python
│
├── frontend/             # Frontend Application (React)
│   ├── src/
│   │   ├── App.jsx       # Logika Antarmuka Utama SPA
│   │   ├── App.css       # Custom Styling & Token Komponen
│   │   └── main.jsx
│   └── package.json
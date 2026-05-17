import { useState, useRef } from "react";

const MOCK_RECOMMENDATIONS = [
  {
    video_id: "1ZYbU82GVz4",
    title: "Midnight Rain & Thunder",
    description: "Suara hujan deras dan petir malam yang menenangkan, cocok untuk tidur nyenyak.",
    score: 0.98,
    tags: ["ambient", "rain"],
    duration: "45:20",
    creator: "Luna ASMR",
  },
  {
    video_id: "2XI5FR3FGvA",
    title: "Close Up Whispering",
    description: "Bisikan lembut jarak dekat yang membantu fokus dan relaksasi mendalam.",
    score: 0.92,
    tags: ["whispering", "focus"],
    duration: "1:15:00",
    creator: "Aura Originals",
  },
  {
    video_id: "Ey2YCzXCmx0",
    title: "Wood & Soap Carving",
    description: "Suara ukiran kayu dan sabun yang ritmis dan sangat memuaskan.",
    score: 0.88,
    tags: ["visual", "tapping"],
    duration: "22:10",
    creator: "Tactile Sounds",
  },
  {
    video_id: "q76bMs-NwRk",
    title: "Deep Forest Stream",
    description: "Aliran sungai di dalam hutan yang dalam, dikelilingi suara alam asli.",
    score: 0.85,
    tags: ["nature", "sleep"],
    duration: "3:00:00",
    creator: "Nature's Canvas",
  },
];

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    width: 100%;
    min-height: 100vh;
    background: #080A14;
    overflow-x: hidden;
  }

  /* Override Vite default #root constraints */
  #root {
    width: 100% !important;
    max-width: 100% !important;
    border-inline: none !important;
    text-align: left !important;
    min-height: 100vh;
  }

  .snooze-wrap {
    font-family: 'Sora', system-ui, sans-serif;
    background: #080A14;
    color: #fff;
    min-height: 100vh;
    width: 100%;
  }

  /* NAVBAR */
  .snooze-nav {
    position: sticky; top: 0; z-index: 100;
    width: 100%;
    background: rgba(8,10,20,0.88);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    height: 64px;
    display: flex; align-items: center;
    padding: 0 48px;
    justify-content: space-between;
  }
  .snooze-logo {
    display: flex; align-items: center; gap: 10px;
    cursor: pointer;
  }
  .snooze-logo-icon {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }
  .snooze-logo-text { font-weight: 700; font-size: 17px; letter-spacing: -0.3px; color: #fff; }
  .snooze-nav-links { display: flex; gap: 36px; align-items: center; }
  .snooze-nav-link {
    color: rgba(255,255,255,0.6); font-size: 14px; font-weight: 500;
    cursor: pointer; transition: color 0.2s;
    background: none; border: none; font-family: inherit; padding: 0;
  }
  .snooze-nav-link:hover, .snooze-nav-link.active { color: #fff; }
  .snooze-nav-right { display: flex; align-items: center; gap: 20px; }
  .snooze-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, #f472b6, #a78bfa); cursor: pointer;
  }

  /* HERO */
  .snooze-hero {
    width: 100%;
    min-height: calc(100vh - 64px);
    background:
      radial-gradient(ellipse 70% 80% at 65% 40%, rgba(120,70,255,0.22) 0%, transparent 65%),
      radial-gradient(ellipse 40% 50% at 82% 15%, rgba(180,80,255,0.14) 0%, transparent 55%),
      #080A14;
    display: flex; align-items: center; padding: 0 48px;
  }
  .snooze-hero-inner {
    max-width: 1280px; width: 100%; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 64px; align-items: center; padding: 80px 0;
  }
  .snooze-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.35);
    border-radius: 999px; padding: 7px 18px;
    font-size: 12px; font-weight: 600; color: #c4b5fd; margin-bottom: 32px;
  }
  .snooze-badge-dot {
    width: 7px; height: 7px; background: #8b5cf6; border-radius: 50%;
    animation: blink 2s ease-in-out infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .snooze-h1 {
    font-size: clamp(40px, 4.8vw, 64px); font-weight: 800;
    line-height: 1.05; letter-spacing: -2px; margin-bottom: 24px; color: #fff;
  }
  .snooze-h1 span { color: #a78bfa; }
  .snooze-hero-desc {
    color: rgba(255,255,255,0.45); font-size: 16px; line-height: 1.75;
    margin-bottom: 44px; max-width: 420px;
  }
  .snooze-hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }

  .btn-primary {
    background: #fff; color: #080A14; border: none; border-radius: 999px;
    padding: 15px 30px; font-size: 14px; font-weight: 700; cursor: pointer;
    display: inline-flex; align-items: center; gap: 8px;
    transition: background 0.2s, transform 0.15s; font-family: inherit;
  }
  .btn-primary:hover { background: #ede9fe; transform: scale(1.02); }
  .btn-secondary {
    background: rgba(255,255,255,0.07); color: #fff;
    border: 1px solid rgba(255,255,255,0.14); border-radius: 999px;
    padding: 15px 30px; font-size: 14px; font-weight: 600; cursor: pointer;
    transition: background 0.2s; font-family: inherit;
  }
  .btn-secondary:hover { background: rgba(255,255,255,0.14); }

  /* ALBUM ART */
  .snooze-album-wrap { position: relative; }
  .snooze-album {
    width: 100%; aspect-ratio: 4/3; border-radius: 22px;
    overflow: hidden; position: relative;
  }
  .snooze-album-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg,
      #ff8c42 0%, #ffb347 15%, #e8a0d8 35%,
      #c084fc 55%, #818cf8 72%, #60a5fa 88%, #38bdf8 100%);
  }
  .snooze-album-waves { position: absolute; inset: 0; width: 100%; height: 100%; }
  .snooze-album-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, transparent 50%, rgba(8,10,20,0.2) 100%);
  }
  .snooze-now-playing {
    position: absolute; bottom: -20px; left: 24px;
    background: rgba(8,10,20,0.92); backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.1); border-radius: 16px;
    padding: 14px 22px; display: flex; align-items: center; gap: 14px;
    min-width: 280px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }
  .snooze-now-icon {
    width: 42px; height: 42px; border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }
  .snooze-now-title { font-weight: 700; font-size: 14px; line-height: 1.3; }
  .snooze-now-sub { color: rgba(255,255,255,0.4); font-size: 12px; margin-top: 3px; }

  /* VOICE SECTION */
  .snooze-voice-section {
    width: 100%; background: rgba(255,255,255,0.018);
    border-top: 1px solid rgba(255,255,255,0.05);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    padding: 90px 48px; text-align: center;
  }
  .snooze-h2 { font-size: clamp(26px, 2.8vw, 38px); font-weight: 800; letter-spacing: -0.8px; margin-bottom: 14px; }
  .snooze-sub { color: rgba(255,255,255,0.42); font-size: 15px; margin-bottom: 52px; }

  .snooze-mic-btn {
    width: 84px; height: 84px; border-radius: 50%; background: #ef4444;
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 30px; transition: all 0.3s; margin: 0 auto;
  }
  .mic-idle { box-shadow: 0 0 0 14px rgba(239,68,68,0.1), 0 0 50px rgba(239,68,68,0.2); }
  .mic-recording { animation: mic-pulse 1.5s ease-in-out infinite; }
  @keyframes mic-pulse {
    0%  { box-shadow: 0 0 0 0 rgba(239,68,68,0.55); }
    70% { box-shadow: 0 0 0 34px rgba(239,68,68,0); }
    100%{ box-shadow: 0 0 0 0 rgba(239,68,68,0); }
  }
  .snooze-transcript { color: #ef4444; font-size: 15px; font-style: italic; margin-top: 18px; }
  .snooze-status { color: rgba(255,255,255,0.35); font-size: 13px; margin-top: 12px; }

  /* TRIGGERS */
  .snooze-trigger-section { width: 100%; padding: 80px 48px; }
  .snooze-inner { max-width: 1280px; margin: 0 auto; }
  .snooze-trigger-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 16px; margin-top: 36px;
  }
  .snooze-trigger-card {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; padding: 24px;
  }
  .snooze-trigger-label { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
  .snooze-trigger-desc { color: rgba(255,255,255,0.35); font-size: 12px; margin-bottom: 18px; }
  .snooze-trigger-btns { display: flex; gap: 8px; }
  .pref-btn {
    flex: 1; padding: 9px 12px; border-radius: 10px;
    font-size: 12px; font-weight: 600; cursor: pointer;
    border: 1px solid transparent; transition: all 0.2s; font-family: inherit;
  }
  .pref-like-on    { background: rgba(139,92,246,0.18); border-color: rgba(139,92,246,0.4); color: #c4b5fd; }
  .pref-dislike-on { background: rgba(239,68,68,0.14);  border-color: rgba(239,68,68,0.35);  color: #fca5a5; }
  .pref-off        { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); color: rgba(255,255,255,0.3); }

  /* RECOMMENDATIONS */
  .snooze-reco-section { width: 100%; padding: 64px 48px; }
  .snooze-reco-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 20px; margin-top: 32px;
  }
  .snooze-reco-card {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; overflow: hidden; cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .snooze-reco-card:hover { transform: translateY(-5px); box-shadow: 0 24px 48px rgba(0,0,0,0.45); }
  .snooze-thumb { position: relative; aspect-ratio: 4/3; background: #0f111a; }
  .snooze-thumb iframe { width: 100%; height: 100%; border: none; display: block; }
  .snooze-match-badge {
    position: absolute; top: 10px; left: 10px;
    background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3);
    color: #34d399; font-size: 11px; font-weight: 700;
    padding: 4px 10px; border-radius: 999px;
    backdrop-filter: blur(6px); display: flex; align-items: center; gap: 4px;
  }
  .snooze-duration {
    position: absolute; bottom: 10px; right: 10px;
    background: rgba(0,0,0,0.72); backdrop-filter: blur(6px);
    color: #fff; font-size: 11px; font-weight: 600;
    padding: 3px 8px; border-radius: 6px;
  }
  .snooze-card-body { padding: 16px; }
  .snooze-card-title { font-weight: 700; font-size: 14px; margin-bottom: 4px; line-height: 1.35; color: #f1f5f9; }
  .snooze-card-creator { color: rgba(255,255,255,0.35); font-size: 12px; margin-bottom: 12px; }
  .snooze-card-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .snooze-tag {
    background: rgba(255,255,255,0.055); border: 1px solid rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.5); font-size: 11px; padding: 3px 10px; border-radius: 999px;
  }

  /* SHIMMER */
  .shimmer {
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 100%);
    background-size: 200% 100%; animation: shimmer 1.6s infinite; border-radius: 10px;
  }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

  /* FOOTER */
  .snooze-footer { border-top: 1px solid rgba(255,255,255,0.05); padding: 56px 48px 40px; margin-top: 32px; }
  .snooze-footer-inner {
    max-width: 1280px; margin: 0 auto;
    display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 48px;
  }
  .snooze-footer-col-title {
    font-weight: 600; font-size: 12px; color: rgba(255,255,255,0.5);
    margin-bottom: 18px; text-transform: uppercase; letter-spacing: 0.8px;
  }
  .snooze-footer-link {
    display: block; color: rgba(255,255,255,0.35); font-size: 13px;
    cursor: pointer; margin-bottom: 12px; transition: color 0.2s;
    background: none; border: none; font-family: inherit; text-align: left; padding: 0;
  }
  .snooze-footer-link:hover { color: rgba(255,255,255,0.7); }

  /* FADE IN */
  .fade-in { animation: fadeIn 0.35s ease; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
`;

function AlbumArt() {
  return (
    <div className="snooze-album-wrap">
      <div className="snooze-album">
        <div className="snooze-album-bg" />
        <svg className="snooze-album-waves" viewBox="0 0 600 450" preserveAspectRatio="none">
          <path d="M0,280 Q120,180 240,240 T480,210 T720,260 L720,450 L0,450 Z" fill="rgba(56,189,248,0.45)" />
          <path d="M0,320 Q150,220 300,290 T600,250 T800,310 L800,450 L0,450 Z" fill="rgba(129,140,248,0.35)" />
          <path d="M0,360 Q200,280 400,340 T700,310 L700,450 L0,450 Z" fill="rgba(139,92,246,0.25)" />
        </svg>
        <div className="snooze-album-overlay" />
      </div>
      <div className="snooze-now-playing">
        <div className="snooze-now-icon">🎧</div>
        <div>
          <div className="snooze-now-title">Deep Sleep Protocol</div>
          <div className="snooze-now-sub">Binaural Beats • 45 min</div>
        </div>
      </div>
    </div>
  );
}

function TriggerPrefs({ preferences, togglePreference }) {
  const items = [
    { id: "whispering", label: "🗣️ Whispering", desc: "Bisikan lembut" },
    { id: "tapping",    label: "🔨 Tapping",    desc: "Ketukan benda" },
    { id: "ambient",    label: "🌧️ Ambient",    desc: "Hujan & alam" },
  ];
  return (
    <div className="snooze-trigger-grid">
      {items.map((item) => (
        <div className="snooze-trigger-card" key={item.id}>
          <div className="snooze-trigger-label">{item.label}</div>
          <div className="snooze-trigger-desc">{item.desc}</div>
          <div className="snooze-trigger-btns">
            <button
              className={`pref-btn ${preferences[item.id] ? "pref-like-on" : "pref-off"}`}
              onClick={() => togglePreference(item.id, true)}
            >Suka</button>
            <button
              className={`pref-btn ${!preferences[item.id] ? "pref-dislike-on" : "pref-off"}`}
              onClick={() => togglePreference(item.id, false)}
            >Tidak Suka</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function RecoCard({ video }) {
  return (
    <div className="snooze-reco-card">
      <div className="snooze-thumb">
        <iframe src={`https://www.youtube.com/embed/${video.video_id}`} title={video.title} allowFullScreen />
        <div className="snooze-match-badge">✓ {(video.score * 100).toFixed(0)}% Match</div>
        <div className="snooze-duration">{video.duration}</div>
      </div>
      <div className="snooze-card-body">
        <div className="snooze-card-title">{video.title}</div>
        <div className="snooze-card-creator">{video.creator}</div>
        <div className="snooze-card-tags">
          {video.tags.map((t) => <span className="snooze-tag" key={t}>#{t}</span>)}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [preferences, setPreferences] = useState({ whispering: true, tapping: true, ambient: true });
  const [isRecording, setIsRecording]       = useState(false);
  const [statusMessage, setStatusMessage]   = useState("");
  const [transcript, setTranscript]         = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading]               = useState(false);
  const [page, setPage]                     = useState("home");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef   = useRef([]);

  const togglePreference = (type, value) =>
    setPreferences((p) => ({ ...p, [type]: value }));

const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      
      // Mengubah logic onstop agar mengirim file asli ke backend
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        await sendAudioToBackend(audioBlob);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setStatusMessage("Mendengarkan... Klik lagi untuk selesai");
    } catch {
      setStatusMessage("Gagal mengakses mikrofon.");
    }
  };

  // Fungsi baru untuk menembak API FastAPI asli
  const sendAudioToBackend = async (audioBlob) => {
    setLoading(true);
    setStatusMessage("Menganalisis audio sensorik...");
    
    const formData = new FormData();
    formData.append("audio", audioBlob, "query_voice.wav");
    formData.append("preferences", JSON.stringify(preferences));

    try {
      const response = await fetch("http://127.0.0.1:8000/api/recommend", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setTranscript(data.query_text);
        setRecommendations(data.recommendations);
        setPage("discover");
      } else {
        setStatusMessage(`Error: ${data.detail || "Gagal memproses data"}`);
      }
    } catch (error) {
      console.error("Error backend:", error);
      setStatusMessage("Error: Gagal terhubung ke server backend.");
    } finally {
      setLoading(false);
      setStatusMessage("");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
    }
  };

  const handleMicClick = () => (isRecording ? stopRecording() : startRecording());

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div className="snooze-wrap">

        {/* NAVBAR */}
        <nav className="snooze-nav">
          <div className="snooze-logo" onClick={() => setPage("home")}>
            <div className="snooze-logo-icon">💤</div>
            <span className="snooze-logo-text">CalmingSounds</span>
          </div>
          <div className="snooze-nav-links">
            {["Discover", "Triggers", "Creators", "Sleep"].map((item) => (
              <button
                key={item}
                className={`snooze-nav-link ${item === "Discover" ? "active" : ""}`}
                onClick={() => item === "Discover" && setPage("home")}
              >{item}</button>
            ))}
          </div>
        </nav>

        {/* HOME */}
        {page === "home" && (
          <div className="fade-in">
            <section className="snooze-hero">
              <div className="snooze-hero-inner">
                <div>
                  <div className="snooze-badge">
                    <span className="snooze-badge-dot" />
                    Now Streaming in Spatial Audio
                  </div>
                  <h1 className="snooze-h1">
                    Find your<br /><span>perfect frequency.</span>
                  </h1>
                  <p className="snooze-hero-desc">
                    Immerse yourself in high-fidelity ASMR and ambient soundscapes designed
                    to lower your heart rate and guide you into deep relaxation.
                  </p>
                  <div className="snooze-hero-btns">
                    <button className="btn-primary" onClick={() => setPage("discover")}>▶ Start Listening</button>
                    <button className="btn-secondary" onClick={() => setPage("discover")}>Explore Triggers</button>
                  </div>
                </div>
                <AlbumArt />
              </div>
            </section>

            <section className="snooze-voice-section">
              <h2 className="snooze-h2">Tell us how you feel</h2>
              <p className="snooze-sub">Tap the mic and describe your mood. We'll generate a custom soundscape instantly.</p>
              <button
                className={`snooze-mic-btn ${isRecording ? "mic-recording" : "mic-idle"}`}
                onClick={handleMicClick}
              >{isRecording ? "⏹️" : "🎙️"}</button>
              {transcript && <p className="snooze-transcript">"{transcript}"</p>}
              {statusMessage && <p className="snooze-status">{statusMessage}</p>}
            </section>

            <section className="snooze-trigger-section">
              <div className="snooze-inner">
                <h2 className="snooze-h2" style={{ textAlign: "left" }}>Interactive Trigger Test</h2>
                <p className="snooze-sub" style={{ textAlign: "left", marginBottom: 0 }}>
                  Pilih preferensimu. Matikan jika suara tersebut membuatmu tidak nyaman (Misophonia).
                </p>
                <TriggerPrefs preferences={preferences} togglePreference={togglePreference} />
              </div>
            </section>
          </div>
        )}

        {/* DISCOVER */}
        {page === "discover" && (
          <div className="snooze-reco-section fade-in">
            <div className="snooze-inner">
              {!loading && recommendations.length === 0 && (
                <div style={{
                  background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 24, padding: "72px 40px", textAlign: "center", marginBottom: 48,
                }}>
                  <h2 className="snooze-h2">Tell us how you feel</h2>
                  <p className="snooze-sub">Tap the mic and describe your mood. We'll generate a custom soundscape instantly.</p>
                  <button
                    className={`snooze-mic-btn ${isRecording ? "mic-recording" : "mic-idle"}`}
                    onClick={handleMicClick}
                  >{isRecording ? "⏹️" : "🎙️"}</button>
                  {statusMessage && <p className="snooze-status" style={{ marginTop: 16 }}>{statusMessage}</p>}
                </div>
              )}

              {loading && (
                <>
                  <div style={{ height: 32, width: 260, borderRadius: 8, marginBottom: 32 }} className="shimmer" />
                  <div className="snooze-reco-grid">
                    {[1,2,3,4].map((i) => (
                      <div key={i} style={{ borderRadius: 18, overflow: "hidden" }}>
                        <div style={{ height: 200 }} className="shimmer" />
                        <div style={{ padding: 16 }}>
                          <div style={{ height: 14, width: "80%", borderRadius: 6, marginBottom: 10 }} className="shimmer" />
                          <div style={{ height: 11, width: "55%", borderRadius: 6 }} className="shimmer" />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {!loading && recommendations.length > 0 && (
                <>
                  {transcript && (
                    <div style={{
                      background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)",
                      borderRadius: 12, padding: "12px 20px", color: "#c4b5fd",
                      fontSize: 14, fontStyle: "italic", marginBottom: 36,
                    }}>
                      Hasil untuk: "{transcript}"
                    </div>
                  )}
                  <h2 className="snooze-h2">Recommended for You</h2>
                  <div className="snooze-reco-grid">
                    {recommendations.map((v) => <RecoCard key={v.video_id} video={v} />)}
                  </div>
                  <div style={{ marginTop: 56 }}>
                    <h2 className="snooze-h2" style={{ marginBottom: 8 }}>Preferensi Trigger</h2>
                    <p className="snooze-sub" style={{ marginBottom: 0 }}>Sesuaikan filter sensorikmu untuk hasil yang lebih akurat.</p>
                    <TriggerPrefs preferences={preferences} togglePreference={togglePreference} />
                  </div>
                  <div style={{ textAlign: "center", marginTop: 48 }}>
                    <button className="btn-secondary" onClick={() => { setRecommendations([]); setTranscript(""); }}>
                      🎙️ Rekam Ulang
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="snooze-footer">
          <div className="snooze-footer-inner">
            <div>
              <div className="snooze-logo" style={{ marginBottom: 14 }}>
                <div className="snooze-logo-icon" style={{ width: 30, height: 30, fontSize: 13 }}>💤</div>
                <span className="snooze-logo-text" style={{ fontSize: 15 }}>CalmingSounds</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, lineHeight: 1.7 }}>
                Elevate your downtime with premium, ad-free soundscapes tailored to your nervous system.
              </p>
            </div>
            <div>
              <div className="snooze-footer-col-title">Platform</div>
              {["Discover", "Sleep Timer", "Spatial Audio"].map((l) => (
                <button key={l} className="snooze-footer-link">{l}</button>
              ))}
            </div>
            <div>
              <div className="snooze-footer-col-title">Account</div>
              {["Premium", "Settings", "Support"].map((l) => (
                <button key={l} className="snooze-footer-link">{l}</button>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
import { useState, useRef } from "react";

const AESTHETICS = [
  { id: "anime", label: "Anime", emoji: "⛩️", description: "Japanese animation style with vibrant colors" },
  { id: "cyberpunk", label: "Cyberpunk", emoji: "🤖", description: "Neon-lit futuristic dystopia" },
  { id: "fantasy", label: "Fantasy", emoji: "🧙", description: "Magical medieval fantasy realm" },
  { id: "minimalist", label: "Minimalist", emoji: "⬜", description: "Clean, simple, modern aesthetic" },
  { id: "vaporwave", label: "Vaporwave", emoji: "🌊", description: "Retro 80s/90s pastel dreamscape" },
  { id: "nature", label: "Nature", emoji: "🌿", description: "Organic earthy natural elements" },
  { id: "space", label: "Space", emoji: "🚀", description: "Cosmic galactic universe vibes" },
  { id: "streetwear", label: "Streetwear", emoji: "👟", description: "Urban hip hop street culture" },
  { id: "gothic", label: "Gothic", emoji: "🖤", description: "Dark mysterious gothic atmosphere" },
  { id: "pixelart", label: "Pixel Art", emoji: "🎮", description: "Retro 8-bit pixel game style" },
  { id: "watercolor", label: "Watercolor", emoji: "🎨", description: "Soft flowing watercolor painting" },
  { id: "neon", label: "Neon", emoji: "💡", description: "Bright glowing neon lights" },
  { id: "vintage", label: "Vintage", emoji: "📷", description: "Classic retro vintage photography" },
];

export default function App() {
  const [tab, setTab] = useState("create");
  const [selected, setSelected] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [gallery, setGallery] = useState([]);
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const generate = async () => {
    if (!selected) { setError("Please select an aesthetic!"); return; }
    setError(null);
    setGenerating(true);
    setResults([]);
    try {
      const aesthetic = AESTHETICS.find(a => a.id === selected);
      const prompt = uploadedImage
        ? `Transform this profile picture into a ${aesthetic.label} style: ${aesthetic.description}. Make it look like a professional social media profile picture with ${aesthetic.label} aesthetic. Keep the person recognizable but apply the ${aesthetic.label} art style transformation.`
        : `Create a unique ${aesthetic.label} style profile picture. ${aesthetic.description}. Make it look like a professional social media avatar. Style: ${aesthetic.label}. Create an interesting character or abstract design that would work as a profile picture.`;

      const messages = uploadedImage
        ? [{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: "image/jpeg", data: uploadedImage.split(",")[1] } }, { type: "text", text: prompt }] }]
        : [{ role: "user", content: prompt }];

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1024, messages })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      
      const text = data.content?.[0]?.text || "Your PFP has been created!";
      const newResult = { id: Date.now(), aesthetic: aesthetic.label, emoji: aesthetic.emoji, description: text, uploadedImage };
      setResults([newResult]);
      setGallery(prev => [newResult, ...prev]);
    } catch (err) {
      setError("Generation failed. Please try again!");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)", color: "white", fontFamily: "sans-serif" }}>
      <header style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <h1 style={{ margin: 0, fontSize: "24px", background: "linear-gradient(90deg, #00d2ff, #7b2ff7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PFP Studio</h1>
        <nav style={{ display: "flex", gap: "10px" }}>
          {["create", "upload", "gallery"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer", background: tab === t ? "linear-gradient(90deg, #00d2ff, #7b2ff7)" : "rgba(255,255,255,0.1)", color: "white", textTransform: "capitalize" }}>{t === "create" ? "✨ Create" : t === "upload" ? "📤 Upload" : "🖼️ Gallery"}</button>
          ))}
        </nav>
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
        {tab === "upload" && (
          <div style={{ textAlign: "center" }}>
            <h2>Upload Your Photo</h2>
            <div onClick={() => fileRef.current.click()} style={{ border: "2px dashed rgba(255,255,255,0.3)", borderRadius: "20px", padding: "60px", cursor: "pointer", marginBottom: "20px" }}>
              {uploadedImage ? <img src={uploadedImage} alt="uploaded" style={{ maxWidth: "200px", borderRadius: "10px" }} /> : <div><div style={{ fontSize: "48px" }}>📸</div><p>Click to upload your photo</p></div>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
            {uploadedImage && <button onClick={() => setTab("create")} style={{ padding: "12px 30px", background: "linear-gradient(90deg, #00d2ff, #7b2ff7)", border: "none", borderRadius: "25px", color: "white", cursor: "pointer", fontSize: "16px" }}>Choose Aesthetic →</button>}
          </div>
        )}

        {tab === "create" && (
          <div>
            <h2 style={{ textAlign: "center" }}>Choose Your Aesthetic</h2>
            {uploadedImage && <p style={{ textAlign: "center", color: "#00d2ff" }}>✅ Photo uploaded! Select an aesthetic to transform it.</p>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "15px", marginBottom: "30px" }}>
              {AESTHETICS.map(a => (
                <div key={a.id} onClick={() => setSelected(a.id)} style={{ padding: "20px", borderRadius: "15px", border: `2px solid ${selected === a.id ? "#00d2ff" : "rgba(255,255,255,0.1)"}`, background: selected === a.id ? "rgba(0,210,255,0.1)" : "rgba(255,255,255,0.05)", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
                  <div style={{ fontSize: "32px" }}>{a.emoji}</div>
                  <div style={{ fontWeight: "bold", marginTop: "8px" }}>{a.label}</div>
                </div>
              ))}
            </div>
            {error && <p style={{ color: "#ff6b6b", textAlign: "center" }}>{error}</p>}
            <div style={{ textAlign: "center" }}>
              <button onClick={generate} disabled={generating} style={{ padding: "15px 50px", background: generating ? "#555" : "linear-gradient(90deg, #00d2ff, #7b2ff7)", border: "none", borderRadius: "30px", color: "white", fontSize: "18px", cursor: generating ? "not-allowed" : "pointer" }}>
                {generating ? "✨ Generating..." : "🎨 Generate PFP"}
              </button>
            </div>
            {results.length > 0 && (
              <div style={{ marginTop: "40px", textAlign: "center" }}>
                <h3>Your PFP is Ready! 🎉</h3>
                {results.map(r => (
                  <div key={r.id} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "20px", padding: "30px", marginBottom: "20px" }}>
                    <div style={{ fontSize: "48px" }}>{r.emoji}</div>
                    <h4>{r.aesthetic} Style PFP</h4>
                    <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>{r.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "gallery" && (
          <div>
            <h2 style={{ textAlign: "center" }}>Your Gallery</h2>
            {gallery.length === 0 ? <p style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}>No PFPs generated yet. Go create some!</p> : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
                {gallery.map(r => (
                  <div key={r.id} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "15px", padding: "20px" }}>
                    <div style={{ fontSize: "36px", textAlign: "center" }}>{r.emoji}</div>
                    <h4 style={{ textAlign: "center" }}>{r.aesthetic}</h4>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>{r.description?.substring(0, 100)}...</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
            }

import { useState, useRef, useEffect } from "react";

const AESTHETICS = [
  { id: "y2k", label: "Y2K", emoji: "💿", colors: ["#ff6ec7", "#00f5ff"], glow: "#ff6ec7", mood: "futuristic nostalgia", desc: "Chrome, glitter & early internet vibes", prompt: "Y2K aesthetic, chrome metallic, glitter, early 2000s internet, holographic, pink and cyan, digital art portrait" },
  { id: "altgoth", label: "Alt/Goth", emoji: "🖤", colors: ["#1a0a2e", "#9b59b6"], glow: "#9b59b6", mood: "dark ethereal", desc: "Shadows, moons & dark romance", prompt: "alt goth aesthetic portrait, dark ethereal, crescent moon, smoke effects, dark purple and black, chains, dramatic lighting, digital art" },
  { id: "anime", label: "Anime", emoji: "⛩️", colors: ["#ff6b9d", "#ffd93d"], glow: "#ff6b9d", mood: "vibrant expressive", desc: "Big eyes, wild hair & epic energy", prompt: "anime style portrait, large expressive eyes, colorful wild hair, vibrant colors, manga art style, dynamic pose, Japanese animation" },
  { id: "cyberpunk", label: "Cyberpunk", emoji: "🤖", colors: ["#00ff9f", "#ff0090"], glow: "#00ff9f", mood: "neon dystopia", desc: "Neon lights & digital rebellion", prompt: "cyberpunk portrait, neon green and pink lights, futuristic city background, glowing circuits, tech augmentations, rain, digital art" },
  { id: "cottagecore", label: "Cottagecore", emoji: "🌿", colors: ["#a8d5a2", "#f7c59f"], glow: "#a8d5a2", mood: "soft pastoral", desc: "Flowers, linen & forest magic", prompt: "cottagecore aesthetic portrait, flower crown, linen clothes, forest background, soft natural lighting, mushrooms, warm pastoral art style" },
  { id: "darkacademia", label: "Dark Academia", emoji: "📚", colors: ["#2c1810", "#8b7355"], glow: "#8b7355", mood: "scholarly mystery", desc: "Old books, candlelight & secrets", prompt: "dark academia aesthetic portrait, old library background, candlelight, vintage books, tweed jacket, moody atmospheric lighting, oil painting style" },
  { id: "softgirl", label: "Soft Girl", emoji: "🎀", colors: ["#ffb3c6", "#ffd6e7"], glow: "#ffb3c6", mood: "dreamy pastel", desc: "Blush, bows & cloud aesthetics", prompt: "soft girl aesthetic portrait, pastel pink, hair bows, blush cheeks, cloud background, cute kawaii style, dreamy soft lighting" },
  { id: "grunge", label: "Grunge", emoji: "🎸", colors: ["#4a4a4a", "#8b0000"], glow: "#8b0000", mood: "raw distorted", desc: "Torn edges & raw authenticity", prompt: "grunge aesthetic portrait, distressed clothing, dark moody colors, band tees, raw gritty texture, 90s Seattle style, dark background" },
  { id: "minimalist", label: "Minimalist", emoji: "⬜", colors: ["#e8e8e8", "#555555"], glow: "#aaaaaa", mood: "clean precise", desc: "Less is more. Clean lines only.", prompt: "minimalist portrait, clean white background, simple elegant composition, monochrome, precise lines, modern art style, sophisticated" },
  { id: "maximalist", label: "Maximalist", emoji: "✨", colors: ["#ff3cac", "#fffc00"], glow: "#ff3cac", mood: "bold chaotic", desc: "More is more. Everything at once.", prompt: "maximalist portrait, bold colors everywhere, patterns, glitter, rhinestones, multiple textures, neon pink and yellow, chaotic beautiful composition" },
  { id: "fairy", label: "Fairy", emoji: "🧚", colors: ["#c3a6ff", "#ffd1dc"], glow: "#c3a6ff", mood: "whimsical magic", desc: "Wings, sparkles & enchanted woods", prompt: "fairy aesthetic portrait, butterfly wings, enchanted forest, purple pink sparkles, magical glow, flowers, ethereal fantasy art style" },
  { id: "retro", label: "Retro", emoji: "📺", colors: ["#f4a261", "#e76f51"], glow: "#f4a261", mood: "warm vintage", desc: "Warm tones & timeless nostalgia", prompt: "retro vintage portrait, warm orange tones, 70s style, grain texture, vintage photography aesthetic, nostalgic warm lighting" },
  { id: "indie", label: "Indie", emoji: "🎵", colors: ["#6a994e", "#bc6c25"], glow: "#6a994e", mood: "earthy authentic", desc: "Film grain & genuine expression", prompt: "indie aesthetic portrait, film grain, earthy tones, vintage camera, authentic expression, indie music vibe, polaroid style" },
];

const GENDERS = ["Any", "Feminine", "Masculine", "Androgynous", "Non-binary"];
const MOODS = ["Happy", "Mysterious", "Chill", "Fierce", "Dreamy", "Edgy", "Playful", "Serene"];
const ERAS = ["Modern", "90s", "80s", "70s", "2000s", "Fantasy", "Futuristic"];

const css = `
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes pulse-glow { 0%,100%{opacity:0.6} 50%{opacity:1} }
  @keyframes reveal { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes card-in { from{opacity:0;transform:scale(0.85) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes pop { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }

  .aesthetic-card { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); cursor:pointer; }
  .aesthetic-card:hover { transform: scale(1.07) translateY(-4px) !important; }
  .aesthetic-card.selected { transform: scale(1.06) translateY(-4px) !important; }
  .chip-btn { transition: all 0.15s ease; cursor:pointer; border:none; }
  .chip-btn:hover { transform: scale(1.05); }
  .page-enter { animation: reveal 0.4s ease forwards; }
  .card-enter { animation: card-in 0.3s ease forwards; }
  .generate-btn { transition: all 0.2s ease; border:none; cursor:pointer; }
  .generate-btn:hover:not(:disabled) { transform: scale(1.02); box-shadow: 0 12px 40px rgba(43,127,255,0.5) !important; }
  .generate-btn:active:not(:disabled) { transform: scale(0.98); }
  .floating { animation: float 3s ease-in-out infinite; }
  .floating-2 { animation: float 3.5s ease-in-out infinite 0.5s; }
  .floating-3 { animation: float 4s ease-in-out infinite 1s; }
  .shimmer-text { background: linear-gradient(90deg,#fff 0%,#6eb5ff 30%,#fff 50%,#6eb5ff 70%,#fff 100%); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:shimmer 3s linear infinite; }
  .nav-btn { transition: all 0.2s ease; border:none; cursor:pointer; }
  .nav-btn:hover { transform: scale(1.05); }
  .result-pop { animation: pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .spinner { animation: spin 1s linear infinite; display:inline-block; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(43,127,255,0.3); border-radius: 3px; }
`;

export default function PFPGenerator() {
  const [page, setPage] = useState("home");
  const [selectedAesthetic, setSelectedAesthetic] = useState(null);
  const [gender, setGender] = useState("Any");
  const [mood, setMood] = useState("Happy");
  const [era, setEra] = useState("Modern");
  const [customText, setCustomText] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadAesthetic, setUploadAesthetic] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generatedPFP, setGeneratedPFP] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [genStep, setGenStep] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const GEN_STEPS = ["Analyzing your vibe...", "Crafting your aesthetic...", "Generating your image...", "Adding the finishing touches..."];

  useEffect(() => {
    let interval;
    if (generating) interval = setInterval(() => setGenStep(s => (s + 1) % GEN_STEPS.length), 1200);
    else setGenStep(0);
    return () => clearInterval(interval);
  }, [generating]);

  // Generate real AI image using Pollinations.ai (free, no key needed)
  const generateAIImage = async (prompt) => {
    const encoded = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 999999);
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&seed=${seed}&nologo=true&model=flux`;
    
    // Return as image URL directly
    return url;
  };

  const callClaude = async (prompt) => {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    return data.content[0].text;
  };

  const generateFromIdea = async () => {
    if (!selectedAesthetic) return;
    setGenerating(true); setGeneratedPFP(null); setError(null); setPage("result");
    const aesthetic = AESTHETICS.find(a => a.id === selectedAesthetic);
    try {
      const genderPrompt = gender !== "Any" ? `${gender} presenting person,` : "person,";
      const fullPrompt = `${aesthetic.prompt}, ${genderPrompt} ${mood} mood, ${era} era, ${customText || ""}, profile picture, centered portrait, high quality, detailed`;
      
      const [desc, imageUrl] = await Promise.all([
        callClaude(`You are a creative PFP art director. In 2 sentences describe a ${aesthetic.label} aesthetic PFP for someone ${gender !== "Any" ? `who is ${gender}` : ""} with a ${mood} mood in a ${era} era. ${customText ? `Extra: ${customText}.` : ""}
Format EXACTLY:
VISUAL: [vivid 2 sentence description]
VIBE: [one punchy line]`),
        generateAIImage(fullPrompt)
      ]);
      
      setGeneratedDescription(desc);
      setGeneratedPFP(imageUrl);
    } catch(e) {
      setError("Generation failed. Please try again!");
    }
    setGenerating(false);
  };

  const generateFromUpload = async () => {
    if (!uploadedImage) return;
    setGenerating(true); setGeneratedPFP(null); setError(null); setPage("result");
    // Use selected aesthetic or pick a random one
    const aestheticId = uploadAesthetic || AESTHETICS[Math.floor(Math.random() * AESTHETICS.length)].id;
    const aesthetic = AESTHETICS.find(a => a.id === aestheticId);
    try {
      // Use Claude vision to analyze the uploaded photo first
      const base64Data = uploadedImage.split(",")[1];
      const mediaType = uploadedImage.split(";")[0].split(":")[1];

      const analysisRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType, data: base64Data } },
              { type: "text", text: `Describe this person's appearance in detail: hair color, hair style, facial features, skin tone, age range, any distinctive features. Be specific and concise in 2-3 sentences. Then on a new line write: STYLE: ${aesthetic.label}` }
            ]
          }]
        })
      });
      const analysisData = await analysisRes.json();
      const personDesc = analysisData.content[0].text;

      // Build a detailed prompt using their actual appearance
      const transformPrompt = `${aesthetic.prompt}, portrait of a person with these features: ${personDesc.split("STYLE:")[0].trim()}, maintaining facial likeness, profile picture, centered portrait, high quality, detailed, artistic`;

      const seed = Math.floor(Math.random() * 999999);
      const encoded = encodeURIComponent(transformPrompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&seed=${seed}&nologo=true&model=flux`;

      const desc = `VISUAL: Your photo transformed into the ${aesthetic.label} aesthetic — ${aesthetic.desc}.\nVIBE: ${aesthetic.mood.charAt(0).toUpperCase() + aesthetic.mood.slice(1)} energy, fully realized.`;

      setGeneratedDescription(desc);
      setGeneratedPFP(imageUrl);
    } catch(e) {
      setError("Generation failed. Please try again!");
    }
    setGenerating(false);
  };

  const savePFP = () => {
    if (!generatedPFP) return;
    const aesthetic = AESTHETICS.find(a => a.id === (selectedAesthetic || uploadAesthetic));
    setGallery(prev => [{ id: Date.now(), url: generatedPFP, aesthetic: aesthetic?.label, description: generatedDescription, mood, era }, ...prev]);
  };

  const downloadPFP = () => {
    if (!generatedPFP) return;
    // Open image in new tab - right-click to save or it auto-downloads
    window.open(generatedPFP, "_blank");
  };

  const S = {
    app: { minHeight:"100vh", background:"linear-gradient(135deg,#e8f4fd 0%,#daeeff 50%,#c8e8ff 100%)", fontFamily:"'Inter',-apple-system,sans-serif", color:"#1a2744" },
    nav: { background:"rgba(255,255,255,0.8)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(100,170,255,0.2)", padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:"64px", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 20px rgba(43,127,255,0.08)" },
    logo: { fontSize:"22px", fontWeight:"900", background:"linear-gradient(135deg,#2b7fff,#6eb5ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" },
    navLinks: { display:"flex", gap:"6px" },
    navBtn: (a) => ({ padding:"8px 16px", borderRadius:"20px", background: a?"linear-gradient(135deg,#2b7fff,#6eb5ff)":"transparent", color: a?"#fff":"#5a7fa8", fontSize:"14px", fontWeight:"600" }),
    hero: { textAlign:"center", padding:"70px 24px 50px", position:"relative", overflow:"hidden" },
    heroTitle: { fontSize:"clamp(38px,8vw,70px)", fontWeight:"900", lineHeight:1.1, marginBottom:"16px" },
    heroSub: { fontSize:"18px", color:"#5a7fa8", maxWidth:"500px", margin:"0 auto 40px", lineHeight:1.6 },
    ctaRow: { display:"flex", gap:"14px", justifyContent:"center", flexWrap:"wrap" },
    btnPrimary: { padding:"16px 36px", borderRadius:"50px", border:"none", cursor:"pointer", fontSize:"16px", fontWeight:"700", background:"linear-gradient(135deg,#2b7fff,#6eb5ff)", color:"#fff", boxShadow:"0 8px 32px rgba(43,127,255,0.35)", transition:"all 0.2s" },
    btnSecondary: { padding:"16px 36px", borderRadius:"50px", border:"2px solid rgba(43,127,255,0.3)", cursor:"pointer", fontSize:"16px", fontWeight:"700", background:"rgba(255,255,255,0.7)", color:"#2b7fff", transition:"all 0.2s", backdropFilter:"blur(10px)" },
    section: { maxWidth:"1100px", margin:"0 auto", padding:"0 24px 60px" },
    sTitle: { fontSize:"26px", fontWeight:"800", marginBottom:"6px", color:"#1a2744" },
    sSub: { fontSize:"15px", color:"#5a7fa8", marginBottom:"28px" },
    grid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))", gap:"14px" },
    glass: { background:"rgba(255,255,255,0.65)", backdropFilter:"blur(20px)", borderRadius:"24px", border:"1px solid rgba(255,255,255,0.8)", boxShadow:"0 8px 40px rgba(43,127,255,0.08)", padding:"28px", marginBottom:"20px" },
    label: { fontSize:"12px", fontWeight:"700", color:"#2b7fff", textTransform:"uppercase", letterSpacing:"1.2px", marginBottom:"12px", display:"block" },
    chipRow: { display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"20px" },
    chip: (a) => ({ padding:"8px 16px", borderRadius:"50px", border: a?"2px solid #2b7fff":"2px solid rgba(43,127,255,0.15)", background: a?"linear-gradient(135deg,#2b7fff,#6eb5ff)":"rgba(255,255,255,0.7)", color: a?"#fff":"#5a7fa8", fontSize:"13px", fontWeight:"600" }),
    input: { width:"100%", padding:"14px 18px", borderRadius:"14px", border:"2px solid rgba(43,127,255,0.2)", background:"rgba(255,255,255,0.8)", fontSize:"15px", color:"#1a2744", outline:"none", boxSizing:"border-box", fontFamily:"inherit", marginBottom:"20px" },
    genBtn: (d) => ({ width:"100%", padding:"18px", borderRadius:"50px", border:"none", cursor: d?"not-allowed":"pointer", fontSize:"17px", fontWeight:"800", background: d?"#c8dff7":"linear-gradient(135deg,#2b7fff,#6eb5ff)", color: d?"#8ab0d4":"#fff", boxShadow: d?"none":"0 8px 32px rgba(43,127,255,0.35)", transition:"all 0.2s", letterSpacing:"0.5px" }),
    uploadZone: { border:"2px dashed rgba(43,127,255,0.3)", borderRadius:"20px", padding:"48px", textAlign:"center", cursor:"pointer", background:"rgba(255,255,255,0.5)", marginBottom:"20px", transition:"all 0.2s" },
    result: { display:"flex", flexDirection:"column", alignItems:"center", gap:"24px", padding:"40px 24px 60px", maxWidth:"600px", margin:"0 auto" },
    pfpWrap: { width:"320px", height:"320px", borderRadius:"50%", overflow:"hidden", position:"relative" },
    descBox: { background:"rgba(255,255,255,0.7)", backdropFilter:"blur(20px)", borderRadius:"20px", padding:"24px", width:"100%", border:"1px solid rgba(43,127,255,0.1)" },
    actionRow: { display:"flex", gap:"12px", width:"100%" },
    galleryGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))", gap:"18px" },
  };

  const AestheticCard = ({ a, selected, onSelect }) => {
    const [hov, setHov] = useState(false);
    return (
      <div className={`aesthetic-card ${selected?"selected":""}`}
        style={{ borderRadius:"20px", overflow:"hidden", border: selected?`3px solid ${a.glow}`:"3px solid transparent", boxShadow: selected?`0 0 24px ${a.glow}66,0 8px 30px rgba(0,0,0,0.1)`:"0 4px 20px rgba(0,0,0,0.07)", transform: selected?"scale(1.06) translateY(-4px)":hov?"scale(1.04) translateY(-3px)":"scale(1)" }}
        onClick={() => onSelect(a.id)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
        <div style={{ background:`linear-gradient(145deg,${a.colors[0]},${a.colors[1]})`, padding:"20px 12px 14px", textAlign:"center", position:"relative", overflow:"hidden", minHeight:"90px" }}>
          {(selected||hov) && <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle,${a.glow}44,transparent)`, animation:"pulse-glow 1.5s ease-in-out infinite" }} />}
          <div style={{ fontSize:"36px", marginBottom:"6px", position:"relative", zIndex:1 }}>{a.emoji}</div>
          <div style={{ fontSize:"11px", fontWeight:"800", color:"rgba(255,255,255,0.97)", textShadow:"0 1px 4px rgba(0,0,0,0.35)", letterSpacing:"0.5px", position:"relative", zIndex:1 }}>{a.label.toUpperCase()}</div>
          {hov && <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.8)", marginTop:"3px", position:"relative", zIndex:1, lineHeight:1.3 }}>{a.desc}</div>}
        </div>
        {selected && <div style={{ background:`linear-gradient(135deg,${a.colors[0]}22,${a.colors[1]}22)`, padding:"5px", textAlign:"center", fontSize:"11px", fontWeight:"700", color:a.glow }}>✓ SELECTED</div>}
      </div>
    );
  };

  const HomePage = () => (
    <div className="page-enter">
      <div style={S.hero}>
        <div className="floating" style={{ position:"absolute", top:"30px", left:"8%", fontSize:"30px", opacity:0.35 }}>✨</div>
        <div className="floating-2" style={{ position:"absolute", top:"50px", right:"10%", fontSize:"24px", opacity:0.3 }}>💫</div>
        <div className="floating-3" style={{ position:"absolute", bottom:"30px", right:"18%", fontSize:"22px", opacity:0.25 }}>⚡</div>
        <div style={{ fontSize:"60px", marginBottom:"12px" }} className="floating">🎭</div>
        <h1 style={S.heroTitle}>
          <span style={{ display:"block", color:"#1a2744" }}>Your Vibe,</span>
          <span className="shimmer-text">Your PFP</span>
        </h1>
        <p style={S.heroSub}>AI-powered profile pictures in 13 unique aesthetics. Real images, real vibes, totally free.</p>
        <div style={S.ctaRow}>
          <button className="generate-btn" style={S.btnPrimary} onClick={() => setPage("create")}>✨ Create from Idea</button>
          <button className="nav-btn" style={S.btnSecondary} onClick={() => setPage("upload")}>📸 Upload & Transform</button>
        </div>
        <div style={{ marginTop:"32px", display:"flex", gap:"24px", justifyContent:"center", flexWrap:"wrap" }}>
          {["🎨 13 Aesthetics","⚡ AI Generated","💾 Free Downloads","🔄 Unlimited Tries"].map(f => (
            <div key={f} style={{ background:"rgba(255,255,255,0.6)", backdropFilter:"blur(10px)", padding:"8px 18px", borderRadius:"50px", fontSize:"13px", fontWeight:"600", color:"#2b7fff", border:"1px solid rgba(43,127,255,0.2)" }}>{f}</div>
          ))}
        </div>
      </div>
      <div style={S.section}>
        <h2 style={S.sTitle}>13 Aesthetics. Infinite Vibes.</h2>
        <p style={S.sSub}>Tap any aesthetic to start — each one generates a completely unique AI image.</p>
        <div style={S.grid}>
          {AESTHETICS.map((a,i) => (
            <div key={a.id} style={{ animation:`card-in 0.3s ease ${i*0.035}s both` }}>
              <AestheticCard a={a} selected={false} onSelect={(id) => { setSelectedAesthetic(id); setPage("create"); }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CreatePage = () => (
    <div className="page-enter" style={S.section}>
      <h2 style={S.sTitle}>Create from Idea</h2>
      <p style={S.sSub}>Pick your aesthetic, customize your vibe, and let AI generate your perfect PFP.</p>
      <div style={S.glass}>
        <span style={S.label}>① Choose Your Aesthetic</span>
        <div style={S.grid}>
          {AESTHETICS.map(a => <AestheticCard key={a.id} a={a} selected={selectedAesthetic===a.id} onSelect={setSelectedAesthetic} />)}
        </div>
      </div>
      <div style={S.glass}>
        <span style={S.label}>② Customize Your Vibe</span>
        <div style={{ fontSize:"13px", fontWeight:"600", color:"#5a7fa8", marginBottom:"8px" }}>Gender Expression</div>
        <div style={S.chipRow}>{GENDERS.map(g => <button key={g} className="chip-btn" style={S.chip(gender===g)} onClick={()=>setGender(g)}>{g}</button>)}</div>
        <div style={{ fontSize:"13px", fontWeight:"600", color:"#5a7fa8", marginBottom:"8px" }}>Mood</div>
        <div style={S.chipRow}>{MOODS.map(m => <button key={m} className="chip-btn" style={S.chip(mood===m)} onClick={()=>setMood(m)}>{m}</button>)}</div>
        <div style={{ fontSize:"13px", fontWeight:"600", color:"#5a7fa8", marginBottom:"8px" }}>Era</div>
        <div style={S.chipRow}>{ERAS.map(e => <button key={e} className="chip-btn" style={S.chip(era===e)} onClick={()=>setEra(e)}>{e}</button>)}</div>
        <div style={{ fontSize:"13px", fontWeight:"600", color:"#5a7fa8", marginBottom:"8px" }}>Extra Details (optional)</div>
        <input style={S.input} placeholder="e.g. blue hair, glasses, holding a sword, dragon..." value={customText} onChange={e=>setCustomText(e.target.value)} />
        <button className="generate-btn" style={S.genBtn(!selectedAesthetic)} onClick={generateFromIdea} disabled={!selectedAesthetic}>
          {selectedAesthetic ? `✨ Generate ${AESTHETICS.find(a=>a.id===selectedAesthetic)?.label} PFP` : "Select an aesthetic first"}
        </button>
      </div>
    </div>
  );

  const UploadPage = () => (
    <div className="page-enter" style={S.section}>
      <h2 style={S.sTitle}>Upload & Transform</h2>
      <p style={S.sSub}>Upload your photo, pick a style, and AI transforms it into that aesthetic.</p>
      <div style={S.glass}>
        <span style={S.label}>① Your Photo</span>
        <label htmlFor="photo-upload" style={{ ...S.uploadZone, borderColor: uploadedImage?"rgba(43,127,255,0.5)":"rgba(43,127,255,0.3)", display:"block", cursor:"pointer" }}>
          {uploadedImage
            ? <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"12px" }}>
                <img src={uploadedImage} alt="upload" style={{ width:"140px", height:"140px", borderRadius:"50%", objectFit:"cover", border:"4px solid #2b7fff", boxShadow:"0 0 24px rgba(43,127,255,0.4)" }} />
                <div style={{ fontSize:"14px", color:"#2b7fff", fontWeight:"600" }}>✓ Photo uploaded — tap to change</div>
              </div>
            : <>
                <div style={{ fontSize:"52px", marginBottom:"12px" }}>📸</div>
                <div style={{ fontSize:"16px", fontWeight:"700", color:"#2b7fff", marginBottom:"4px" }}>Tap to upload your photo</div>
                <div style={{ fontSize:"13px", color:"#8ab0d4" }}>Any selfie works — JPG, PNG, GIF</div>
              </>
          }
        </label>
        <input id="photo-upload" ref={fileInputRef} type="file" accept="image/*" capture="user" style={{ display:"none" }} onChange={e=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=ev=>setUploadedImage(ev.target.result);r.readAsDataURL(f);}}} />
      </div>
      <div style={S.glass}>
        <span style={S.label}>② Pick Your Transformation Style</span>
        <div style={S.grid}>
          {AESTHETICS.map(a => <AestheticCard key={a.id} a={a} selected={uploadAesthetic===a.id} onSelect={setUploadAesthetic} />)}
        </div>
      </div>
      <button className="generate-btn" style={S.genBtn(!uploadedImage||!uploadAesthetic)} onClick={generateFromUpload} disabled={!uploadedImage||!uploadAesthetic}>
        {!uploadedImage?"Upload a photo first":!uploadAesthetic?"Select a style":"🎨 Transform My Photo Now"}
      </button>
    </div>
  );

  const ResultPage = () => {
    const aesthetic = AESTHETICS.find(a => a.id === (selectedAesthetic || uploadAesthetic));
    return (
      <div style={S.result}>
        {generating ? (
          <div style={{ textAlign:"center", padding:"60px 20px" }}>
            <div style={{ width:"130px", height:"130px", borderRadius:"50%", background:`linear-gradient(135deg,${aesthetic?.colors[0]||"#2b7fff"},${aesthetic?.colors[1]||"#6eb5ff"})`, margin:"0 auto 28px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"52px", boxShadow:`0 0 50px ${aesthetic?.glow||"#2b7fff"}88`, animation:"float 1.5s ease-in-out infinite" }}>
              {aesthetic?.emoji || "✨"}
            </div>
            <div style={{ fontSize:"22px", fontWeight:"800", color:"#1a2744", marginBottom:"8px" }}>{GEN_STEPS[genStep]}</div>
            <div style={{ fontSize:"14px", color:"#5a7fa8", marginBottom:"20px" }}>This takes about 10-15 seconds...</div>
            <div style={{ display:"flex", gap:"8px", justifyContent:"center" }}>
              {[0,1,2,3].map(i => <div key={i} style={{ width:"8px", height:"8px", borderRadius:"50%", background:aesthetic?.glow||"#2b7fff", opacity: genStep===i?1:0.25, transform: genStep===i?"scale(1.4)":"scale(1)", transition:"all 0.3s" }} />)}
            </div>
          </div>
        ) : error ? (
          <div style={{ textAlign:"center", padding:"40px" }}>
            <div style={{ fontSize:"48px", marginBottom:"16px" }}>😅</div>
            <div style={{ fontSize:"18px", fontWeight:"700", color:"#1a2744", marginBottom:"8px" }}>Oops! Something went wrong</div>
            <div style={{ color:"#5a7fa8", marginBottom:"24px" }}>{error}</div>
            <button className="generate-btn" style={S.btnPrimary} onClick={() => { setError(null); setPage("create"); }}>Try Again</button>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize:"26px", fontWeight:"900", textAlign:"center", color:"#1a2744", margin:0 }}>Your PFP is Ready! ✨</h2>
            {generatedPFP && (
              <div className="result-pop" style={{ position:"relative" }}>
                <div style={{ ...S.pfpWrap, boxShadow:`0 20px 60px ${aesthetic?.glow||"#2b7fff"}55, 0 0 0 6px rgba(255,255,255,0.95)` }}>
                  <img src={generatedPFP} alt="Generated PFP" style={{ width:"100%", height:"100%", objectFit:"cover" }} crossOrigin="anonymous" />
                </div>
                {aesthetic && <div style={{ position:"absolute", top:"-6px", right:"-6px", background:`linear-gradient(135deg,${aesthetic.colors[0]},${aesthetic.colors[1]})`, borderRadius:"50%", width:"44px", height:"44px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", boxShadow:`0 4px 15px ${aesthetic.glow}88`, border:"3px solid white" }}>{aesthetic.emoji}</div>}
              </div>
            )}
            {generatedDescription && (
              <div style={{ ...S.descBox, borderLeft:`4px solid ${aesthetic?.glow||"#2b7fff"}` }}>
                {generatedDescription.split("\n").filter(Boolean).map((line,i) => (
                  <p key={i} style={{ margin:"0 0 8px", fontSize: i===1?"17px":"15px", lineHeight:"1.65", color: i===0?"#1a2744":"#2b7fff", fontWeight: i===1?"800":"400", fontStyle: i===1?"italic":"normal" }}>
                    {line.replace(/^(VISUAL:|VIBE:)\s*/,"")}
                  </p>
                ))}
              </div>
            )}
            <div style={S.actionRow}>
              <button className="generate-btn" style={{ ...S.btnPrimary, flex:1 }} onClick={downloadPFP}>⬇️ Download</button>
              <button className="nav-btn" style={{ ...S.btnSecondary, flex:1 }} onClick={()=>{savePFP();setPage("gallery");}}>💾 Save</button>
            </div>
            <button className="nav-btn" style={{ ...S.btnSecondary, width:"100%" }} onClick={()=>{setSelectedAesthetic(null);setUploadAesthetic(null);setUploadedImage(null);setGeneratedPFP(null);setPage("create");}}>🔄 Make Another</button>
          </>
        )}
      </div>
    );
  };

  const GalleryPage = () => (
    <div className="page-enter" style={S.section}>
      <h2 style={S.sTitle}>Your Gallery</h2>
      <p style={S.sSub}>{gallery.length} PFP{gallery.length!==1?"s":""} saved</p>
      {gallery.length===0
        ? <div style={{ ...S.glass, textAlign:"center", padding:"60px" }}>
            <div style={{ fontSize:"52px", marginBottom:"16px" }}>🖼️</div>
            <div style={{ fontSize:"18px", fontWeight:"700", color:"#1a2744", marginBottom:"8px" }}>No PFPs yet</div>
            <div style={{ color:"#5a7fa8", marginBottom:"24px" }}>Create your first and save it here!</div>
            <button className="generate-btn" style={S.btnPrimary} onClick={()=>setPage("create")}>✨ Create Now</button>
          </div>
        : <div style={S.galleryGrid}>
            {gallery.map(item => {
              const a = AESTHETICS.find(x=>x.label===item.aesthetic);
              return (
                <div key={item.id} style={{ borderRadius:"20px", overflow:"hidden", background:"rgba(255,255,255,0.75)", boxShadow:"0 4px 20px rgba(0,0,0,0.08)", border:"1px solid rgba(255,255,255,0.9)" }}>
                  <div style={{ position:"relative" }}>
                    <img src={item.url} alt={item.aesthetic} style={{ width:"100%", aspectRatio:"1", objectFit:"cover", display:"block" }} />
                    {a && <div style={{ position:"absolute", top:"8px", right:"8px", background:`linear-gradient(135deg,${a.colors[0]},${a.colors[1]})`, borderRadius:"50%", width:"32px", height:"32px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", boxShadow:`0 2px 10px ${a.glow}66` }}>{a.emoji}</div>}
                  </div>
                  <div style={{ padding:"12px" }}>
                    <div style={{ fontSize:"13px", fontWeight:"700", color:"#1a2744" }}>{item.aesthetic}</div>
                    <div style={{ fontSize:"11px", color:"#8ab0d4", marginBottom:"10px" }}>{item.mood} · {item.era}</div>
                    <button className="nav-btn" style={{ ...S.btnSecondary, padding:"7px 12px", fontSize:"12px", width:"100%" }} onClick={()=>window.open(item.url,"_blank")}>⬇️ Download</button>
                  </div>
                </div>
              );
            })}
          </div>
      }
    </div>
  );

  return (
    <div style={S.app}>
      <style>{css}</style>
      <nav style={S.nav}>
        <div style={S.logo}>✨ PFP Studio</div>
        <div style={S.navLinks}>
          {[["home","🏠"],["create","✨ Create"],["upload","📸 Upload"],["gallery","🖼️ Gallery"]].map(([id,label])=>(
            <button key={id} className="nav-btn" style={S.navBtn(page===id)} onClick={()=>setPage(id)}>{label}</button>
          ))}
        </div>
      </nav>
      {page==="home" && <HomePage />}
      {page==="create" && <CreatePage />}
      {page==="upload" && <UploadPage />}
      {page==="result" && <ResultPage />}
      {page==="gallery" && <GalleryPage />}
    </div>
  );
}

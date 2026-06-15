import { useState, useRef } from 'react'

const STYLES = [
  { id: 'y2k', label: 'Y2K', emoji: '💿', desc: 'Chrome, pink, futuristic 2000s' },
  { id: 'anime', label: 'Anime', emoji: '🌸', desc: 'Japanese animation style' },
  { id: 'cyberpunk', label: 'Cyberpunk', emoji: '🤖', desc: 'Neon, dark, dystopian' },
  { id: 'goth', label: 'Goth', emoji: '🖤', desc: 'Dark, moody, Victorian' },
  { id: 'cottagecore', label: 'Cottagecore', emoji: '🌿', desc: 'Soft, nature, cozy' },
  { id: 'vaporwave', label: 'Vaporwave', emoji: '🌊', desc: 'Purple, pink, retro digital' },
  { id: 'streetwear', label: 'Streetwear', emoji: '🧢', desc: 'Urban, hypebeast, cool' },
  { id: 'dark_academia', label: 'Dark Academia', emoji: '📚', desc: 'Moody, scholarly, vintage' },
  { id: 'e_girl', label: 'E-Girl', emoji: '🎀', desc: 'Alt, pastel, edgy cute' },
  { id: 'fantasy', label: 'Fantasy', emoji: '🧝', desc: 'Magical, elven, mystical' },
  { id: 'minimalist', label: 'Minimalist', emoji: '⬜', desc: 'Clean, simple, modern' },
  { id: 'retro', label: 'Retro', emoji: '📺', desc: '80s/90s nostalgia vibes' },
  { id: 'grunge', label: 'Grunge', emoji: '🎸', desc: 'Distressed, raw, punk rock' },
]

const STYLE_PROMPTS = {
  y2k: 'Y2K aesthetic, chrome metallic finish, hot pink and silver colors, futuristic 2000s style, glossy, butterfly clips, sparkles, digital art portrait',
  anime: 'anime style portrait, Japanese animation, big expressive eyes, colorful hair, clean line art, vibrant colors, Studio Ghibli inspired',
  cyberpunk: 'cyberpunk portrait, neon lights, dark dystopian city background, glowing implants, blue and purple neon, rain, high tech low life',
  goth: 'gothic portrait, dark Victorian aesthetic, pale skin, dark makeup, black roses, moody atmosphere, dramatic lighting, elegant darkness',
  cottagecore: 'cottagecore aesthetic portrait, soft natural lighting, flowers in hair, warm earthy tones, cozy, forest background, whimsical',
  vaporwave: 'vaporwave aesthetic portrait, purple and pink gradient, retro digital, palm trees, sunset, 80s computer graphics, dreamy',
  streetwear: 'streetwear fashion portrait, urban style, hypebeast, designer brands, city background, cool confident pose, editorial photography',
  dark_academia: 'dark academia aesthetic portrait, vintage library background, moody lighting, tweed and plaid, books, autumnal colors, intellectual',
  e_girl: 'e-girl aesthetic portrait, pastel hair, heart face paint, alternative fashion, cute but edgy, pink and black, headphones',
  fantasy: 'fantasy portrait, magical elf or wizard, mystical forest, glowing magic effects, ethereal lighting, epic fantasy art style',
  minimalist: 'minimalist portrait, clean white background, simple composition, neutral tones, modern, elegant, high fashion editorial',
  retro: 'retro portrait, 1980s aesthetic, film grain, vintage colors, polaroid style, nostalgia, warm orange and brown tones',
  grunge: 'grunge aesthetic portrait, distressed texture, punk rock, flannel, raw energy, moody desaturated colors, rebellious',
}

export default function App() {
  const [selectedStyle, setSelectedStyle] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [generatedImages, setGeneratedImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [gallery, setGallery] = useState([])
  const [activeTab, setActiveTab] = useState('generate')
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setUploadedImage(ev.target.result)
    reader.readAsDataURL(file)
  }

  const generatePFP = async () => {
    if (!selectedStyle) {
      setError('Pick a style first!')
      return
    }
    setError(null)
    setLoading(true)
    setGeneratedImages([])

    try {
      const prompt = STYLE_PROMPTS[selectedStyle] + ', profile picture, portrait, high quality, detailed'
      const images = []
      for (let i = 0; i < 4; i++) {
        const seed = Math.floor(Math.random() * 999999)
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&seed=${seed}&nologo=true`
        images.push(url)
      }
      setGeneratedImages(images)
    } catch (err) {
      setError('Generation failed. Try again!')
    } finally {
      setLoading(false)
    }
  }

  const saveToGallery = (url) => {
    const style = STYLES.find(s => s.id === selectedStyle)
    setGallery(prev => [{ url, style: style?.label, emoji: style?.emoji, id: Date.now() }, ...prev])
  }

  const downloadImage = async (url) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `pfp-studio-${selectedStyle}-${Date.now()}.jpg`
      link.click()
    } catch {
      window.open(url, '_blank')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0f1a2e 100%)', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>✨</span>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', background: 'linear-gradient(90deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PFP Studio</h1>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '1px' }}>AI Profile Picture Generator</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['generate', 'gallery'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', background: activeTab === tab ? 'linear-gradient(90deg, #7c3aed, #db2777)' : 'rgba(255,255,255,0.08)', color: '#fff', transition: 'all 0.2s' }}>
              {tab === 'generate' ? '🎨 Generate' : `🖼️ Gallery${gallery.length > 0 ? ` (${gallery.length})` : ''}`}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        {activeTab === 'generate' ? (
          <>
            {/* Style Picker */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Choose Your Aesthetic</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                {STYLES.map(style => (
                  <button key={style.id} onClick={() => setSelectedStyle(style.id)} style={{ padding: '14px 10px', borderRadius: '12px', border: selectedStyle === style.id ? '2px solid #a78bfa' : '2px solid rgba(255,255,255,0.08)', background: selectedStyle === style.id ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.04)', cursor: 'pointer', color: '#fff', textAlign: 'center', transition: 'all 0.15s' }}>
                    <div style={{ fontSize: '24px', marginBottom: '6px' }}>{style.emoji}</div>
                    <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '3px' }}>{style.label}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.3' }}>{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Upload */}
            <div style={{ marginBottom: '28px', padding: '20px', borderRadius: '14px', border: '2px dashed rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>📸 Optional: Upload your photo for reference</p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              <button onClick={() => fileInputRef.current?.click()} style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                {uploadedImage ? '✅ Photo uploaded' : 'Upload Photo'}
              </button>
              {uploadedImage && <img src={uploadedImage} alt="uploaded" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginLeft: '12px', verticalAlign: 'middle', border: '2px solid #a78bfa' }} />}
            </div>

            {/* Generate Button */}
            {error && <p style={{ color: '#f87171', marginBottom: '12px', fontSize: '13px', textAlign: 'center' }}>{error}</p>}
            <button onClick={generatePFP} disabled={loading} style={{ width: '100%', padding: '16px', borderRadius: '14px', border: 'none', background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(90deg, #7c3aed, #db2777)', color: '#fff', fontSize: '16px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '32px', transition: 'all 0.2s', letterSpacing: '0.02em' }}>
              {loading ? '✨ Generating your PFPs...' : '✨ Generate My PFPs'}
            </button>

            {/* Results */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px', animation: 'spin 2s linear infinite', display: 'inline-block' }}>✨</div>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>Creating 4 unique PFPs for you...</p>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {generatedImages.length > 0 && (
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your PFPs are ready! 🎉</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {generatedImages.map((url, i) => (
                    <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', position: 'relative' }}>
                      <img src={url} alt={`PFP ${i + 1}`} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} onError={(e) => { e.target.style.display = 'none' }} />
                      <div style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                        <button onClick={() => downloadImage(url)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: 'linear-gradient(90deg, #7c3aed, #db2777)', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>⬇️ Download</button>
                        <button onClick={() => saveToGallery(url)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>🖼️ Save</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Saved PFPs</h2>
            {gallery.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🖼️</div>
                <p>No saved PFPs yet. Generate some and save your favorites!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                {gallery.map(item => (
                  <div key={item.id} style={{ borderRadius: '14px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}>
                    <img src={item.url} alt={item.style} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
                    <div style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{item.emoji} {item.style}</span>
                      <button onClick={() => downloadImage(item.url)} style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', background: 'linear-gradient(90deg, #7c3aed, #db2777)', color: '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}>⬇️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

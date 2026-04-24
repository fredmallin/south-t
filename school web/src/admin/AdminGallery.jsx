import { useState, useEffect, useRef } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const CLOUDINARY_URL    = "https://api.cloudinary.com/v1_1/dwe1cwhgj/image/upload";
const CLOUDINARY_PRESET = "freddy";

const DEFAULT_HERO = {
  heroImage:    null, 
  heroTitle:    "Our School Gallery",
  heroSubtitle: "Capturing memories of learning, sports, and community at South Tetu Girl's.",
};

export default function AdminGallery() {
  const [images,        setImages]        = useState([]);
  const [uploading,     setUploading]     = useState(false);

  // Hero state
  const [hero,          setHero]          = useState(DEFAULT_HERO);
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroSaved,     setHeroSaved]     = useState(false);

  const fileRef     = useRef();
  const heroFileRef = useRef();

  const fetchImages = async () => {
    const snap = await getDocs(collection(db, "gallery"));
    setImages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchImages();

    // Load hero settings
    getDoc(doc(db, "pages", "gallery"))
      .then(snap => {
        if (snap.exists()) setHero(prev => ({ ...prev, ...snap.data() }));
      })
      .catch(() => {});
  }, []);

  // ── Upload gallery image ──
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);
    try {
      const res  = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      const data = await res.json();
      if (data.secure_url) {
        await addDoc(collection(db, "gallery"), {
          url:        data.secure_url,
          publicId:   data.public_id,
          uploadedAt: new Date().toISOString(),
        });
        await fetchImages();
      } else {
        alert("Upload failed. Check your Cloudinary preset.");
      }
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      fileRef.current.value = "";
    }
  };

  // ── Upload hero background image ──
  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setHeroUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);
    try {
      const res  = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      const data = await res.json();
      if (data.secure_url) {
        setHero(prev => ({ ...prev, heroImage: data.secure_url }));
      } else {
        alert("Upload failed. Check your Cloudinary preset.");
      }
    } catch (err) {
      alert("Upload error: " + err.message);
    } finally {
      setHeroUploading(false);
    }
  };

  const handleHeroSave = async () => {
    await setDoc(doc(db, "pages", "gallery"), hero);
    setHeroSaved(true);
    setTimeout(() => setHeroSaved(false), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    await deleteDoc(doc(db, "gallery", id));
    setImages(prev => prev.filter(i => i.id !== id));
  };

  const inp = {
    display: "block", width: "100%", padding: "9px 12px",
    borderRadius: 8, border: "1px solid #ddd", fontSize: 14,
    marginBottom: 12, boxSizing: "border-box",
  };

  const sectionCard = {
    background: "#fff", border: "1px solid #e8e8e8",
    borderRadius: 12, padding: 24, marginBottom: 28,
  };

  const sectionHeading = {
    fontSize: 16, fontWeight: 700, marginBottom: 16,
    color: "#1a7c3e", borderBottom: "2px solid #e8f5e9", paddingBottom: 8,
  };

  return (
    <div>

      {/* ══════════════════════════════════════
          HERO SECTION EDITOR
      ══════════════════════════════════════ */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>Gallery Hero Section</h2>

        {/* Title + Subtitle */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Hero Title</label>
            <input
              style={inp}
              value={hero.heroTitle}
              onChange={e => setHero(prev => ({ ...prev, heroTitle: e.target.value }))}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Hero Subtitle</label>
            <input
              style={inp}
              value={hero.heroSubtitle}
              onChange={e => setHero(prev => ({ ...prev, heroSubtitle: e.target.value }))}
            />
          </div>
        </div>

        {/* Hero background image */}
        <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>
          Hero Background Image
        </label>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap", marginBottom: 16 }}>
          {/* Preview */}
          {hero.heroImage ? (
            <img
              src={hero.heroImage}
              alt="Hero preview"
              style={{ width: 220, height: 110, objectFit: "cover",
                borderRadius: 8, border: "2px solid #1a7c3e" }}
            />
          ) : (
            <div style={{ width: 220, height: 110, borderRadius: 8,
              border: "2px dashed #ccc", display: "flex",
              alignItems: "center", justifyContent: "center",
              color: "#bbb", fontSize: 12 }}>
              No image
            </div>
          )}

          <div>
            <input
              type="file"
              accept="image/*"
              ref={heroFileRef}
              style={{ display: "none" }}
              onChange={handleHeroImageUpload}
            />
            <button
              onClick={() => heroFileRef.current.click()}
              disabled={heroUploading}
              style={{ padding: "9px 18px", background: "#2471a3", color: "#fff",
                border: "none", borderRadius: 8, cursor: "pointer",
                fontWeight: 600, fontSize: 13, display: "block", marginBottom: 8,
                opacity: heroUploading ? 0.7 : 1 }}
            >
               Choose Image
            </button>

            {heroUploading && (
              <p style={{ color: "#1a7c3e", fontSize: 13, margin: "0 0 6px" }}>Uploading...</p>
            )}

            {hero.heroImage && !heroUploading && (
              <button
                onClick={() => setHero(prev => ({ ...prev, heroImage: "" }))}
                style={{ fontSize: 12, color: "#c0392b", background: "none",
                  border: "none", cursor: "pointer", textDecoration: "underline" }}
              >
                Remove image
              </button>
            )}
          </div>
        </div>

        <button
          onClick={handleHeroSave}
          disabled={heroUploading}
          style={{ padding: "10px 28px",
            background: heroSaved ? "#27ae60" : "#1a7c3e",
            color: "#fff", border: "none", borderRadius: 8,
            fontWeight: 700, cursor: "pointer", fontSize: 14,
            opacity: heroUploading ? 0.7 : 1 }}
        >
          {heroSaved ? "✓ Saved!" : "Save Hero"}
        </button>
      </div>

      {/* ══════════════════════════════════════
          UPLOAD NEW GALLERY IMAGE
      ══════════════════════════════════════ */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>Upload Gallery Image</h2>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleUpload}
          style={{ fontSize: 14, marginBottom: 8, display: "block" }}
        />
        {uploading && (
          <p style={{ color: "#1a7c3e", fontWeight: 600, fontSize: 13 }}> Uploading...</p>
        )}
      </div>

      {/* ══════════════════════════════════════
          ALL GALLERY IMAGES
      ══════════════════════════════════════ */}
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
        All Images ({images.length})
      </h2>

      {images.length === 0 && (
        <p style={{ color: "#888" }}>No images uploaded yet.</p>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: 16,
      }}>
        {images.map(img => (
          <div
            key={img.id}
            style={{ position: "relative", borderRadius: 10,
              overflow: "hidden", border: "1px solid #e8e8e8" }}
          >
            <img
              src={img.url}
              alt=""
              style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
            />
            <button
              onClick={() => handleDelete(img.id)}
              style={{ position: "absolute", top: 8, right: 8,
                background: "#c0392b", color: "#fff", border: "none",
                borderRadius: 6, padding: "4px 10px",
                cursor: "pointer", fontSize: 12, fontWeight: 700 }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
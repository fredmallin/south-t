import { useState, useEffect, useRef } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const CLOUDINARY_URL    = "https://api.cloudinary.com/v1_1/dwe1cwhgj/image/upload";
const CLOUDINARY_PRESET = "freddy";

const DEFAULT_HERO = {
  heroImage:    "/images/south home.png",
  heroTitle:    "Our School Management",
  heroSubtitle: "Shaping Character, Nurturing Excellence",
};

const emptyStaff = { name: "", role: "", title: "", description: "", imageUrl: "" };

export default function AdminManagement() {
  const [staff,         setStaff]         = useState([]);
  const [form,          setForm]          = useState(emptyStaff);
  const [editId,        setEditId]        = useState(null);
  const [uploading,     setUploading]     = useState(false);
  const [loading,       setLoading]       = useState(false);

  // Hero state
  const [hero,          setHero]          = useState(DEFAULT_HERO);
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroSaved,     setHeroSaved]     = useState(false);

  const fileRef     = useRef();
  const heroFileRef = useRef();

  const fetchStaff = async () => {
    const snap = await getDocs(collection(db, "management"));
    setStaff(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchStaff();

    // Load hero settings
    getDoc(doc(db, "pages", "management"))
      .then(snap => {
        if (snap.exists()) setHero(prev => ({ ...prev, ...snap.data() }));
      })
      .catch(() => {});
  }, []);

  // ── Upload staff photo ──
  const handleImageUpload = async (e) => {
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
        setForm(prev => ({ ...prev, imageUrl: data.secure_url }));
      } else {
        alert("Image upload failed. Check your Cloudinary preset.");
      }
    } catch {
      alert("Image upload failed");
    } finally {
      setUploading(false);
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
    await setDoc(doc(db, "pages", "management"), hero);
    setHeroSaved(true);
    setTimeout(() => setHeroSaved(false), 3000);
  };

  // ── Staff CRUD ──
  const handleSave = async () => {
    if (!form.name || !form.role) return alert("Name and role are required");
    setLoading(true);
    try {
      if (editId) {
        await updateDoc(doc(db, "management", editId), form);
      } else {
        await addDoc(collection(db, "management"), form);
      }
      setForm(emptyStaff);
      setEditId(null);
      await fetchStaff();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this staff member?")) return;
    await deleteDoc(doc(db, "management", id));
    setStaff(prev => prev.filter(s => s.id !== id));
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
        <h2 style={sectionHeading}>Management Hero Section</h2>

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
              <p style={{ color: "#1a7c3e", fontSize: 13, margin: "0 0 6px" }}>⏳ Uploading...</p>
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
          ADD / EDIT STAFF FORM
      ══════════════════════════════════════ */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>
          {editId ? "Edit Staff Member" : "Add Staff Member"}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          {[
            ["name",  "Full Name"],
            ["role",  "Role (e.g. Senior Principal)"],
            ["title", "Title (e.g. Mr. / Dr. / Prof.)"],
          ].map(([key, label]) => (
            <div key={key}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>{label}</label>
              <input
                style={inp}
                placeholder={label}
                value={form[key] || ""}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>

        <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Description / Bio</label>
        <textarea
          rows={3}
          style={{ ...inp, resize: "vertical" }}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        {/* Staff photo upload */}
        <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>
          Photo
        </label>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleImageUpload}
          style={{ fontSize: 14, marginBottom: 8, display: "block" }}
        />
        {uploading && (
          <p style={{ color: "#1a7c3e", fontSize: 13, marginBottom: 8 }}>Uploading photo...</p>
        )}
        {form.imageUrl && !uploading && (
          <div style={{ marginBottom: 12 }}>
            <img
              src={form.imageUrl}
              alt="Preview"
              style={{ width: 80, height: 80, objectFit: "cover",
                borderRadius: "50%", border: "2px solid #1a7c3e", display: "block" }}
            />
            <button
              onClick={() => setForm(prev => ({ ...prev, imageUrl: "" }))}
              style={{ marginTop: 6, fontSize: 12, color: "#c0392b",
                background: "none", border: "none",
                cursor: "pointer", textDecoration: "underline" }}
            >
              Remove photo
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            onClick={handleSave}
            disabled={loading || uploading}
            style={{ padding: "10px 28px", background: "#1a7c3e", color: "#fff",
              border: "none", borderRadius: 8, fontWeight: 700,
              cursor: loading || uploading ? "not-allowed" : "pointer",
              fontSize: 14, opacity: loading || uploading ? 0.7 : 1 }}
          >
            {loading ? "Saving..." : editId ? "Update" : "Add Staff"}
          </button>
          {editId && (
            <button
              onClick={() => { setForm(emptyStaff); setEditId(null); }}
              style={{ padding: "10px 20px", background: "#eee", border: "none",
                borderRadius: 8, cursor: "pointer", fontSize: 14 }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          STAFF LIST
      ══════════════════════════════════════ */}
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Staff Members</h2>
      {staff.length === 0 && <p style={{ color: "#888" }}>No staff added yet.</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {staff.map(s => (
          <div
            key={s.id}
            style={{ background: "#fff", border: "1px solid #e8e8e8",
              borderRadius: 10, padding: "16px 20px",
              display: "flex", alignItems: "center",
              gap: 16, flexWrap: "wrap" }}
          >
            <img
              src={s.imageUrl || "/images/principal south.png"}
              alt={s.name}
              style={{ width: 56, height: 56, borderRadius: "50%",
                objectFit: "cover", border: "2px solid #e8e8e8", flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <strong>{s.title} {s.name}</strong>
              <p style={{ color: "#1a7c3e", fontSize: 13, margin: "2px 0" }}>{s.role}</p>
              <p style={{ color: "#666", fontSize: 13, margin: 0 }}>{s.description}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => { setForm(s); setEditId(s.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                style={{ padding: "6px 14px", background: "#2471a3", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                style={{ padding: "6px 14px", background: "#c0392b", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
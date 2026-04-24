import { useState, useEffect, useRef } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const CLOUDINARY_URL    = "https://api.cloudinary.com/v1_1/dwe1cwhgj/image/upload";
const CLOUDINARY_PRESET = "freddy";

const DEFAULT_HERO = {
  heroImage:    "/images/south home.png",
  heroTitle:    "School Events",
  heroSubtitle: "Stay up to date with all our upcoming and past events.",
};

const empty = {
  title: "", category: "", description: "", time: "",
  location: "", image: "", month: "", day: "", year: "", type: "upcoming",
};

export default function AdminEvents() {
  const [events,       setEvents]       = useState([]);
  const [form,         setForm]         = useState(empty);
  const [editId,       setEditId]       = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [uploading,    setUploading]    = useState(false);

  // Hero state
  const [hero,         setHero]         = useState(DEFAULT_HERO);
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroSaved,    setHeroSaved]    = useState(false);

  const fileInputRef = useRef();
  const cameraRef    = useRef();
  const heroFileRef  = useRef();

  const fetchEvents = async () => {
    const snap = await getDocs(collection(db, "events"));
    setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchEvents();

    // Load hero settings from Firestore
    getDoc(doc(db, "pages", "events"))
      .then(snap => {
        if (snap.exists()) setHero(prev => ({ ...prev, ...snap.data() }));
      })
      .catch(() => {});
  }, []);

  // ── Upload for event image ──
  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CLOUDINARY_PRESET);
    try {
      const res  = await fetch(CLOUDINARY_URL, { method: "POST", body: fd });
      const data = await res.json();
      if (data.secure_url) {
        setForm(prev => ({ ...prev, image: data.secure_url }));
      } else {
        alert("Upload failed. Check your Cloudinary preset.");
      }
    } catch (err) {
      alert("Upload error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // ── Upload for hero background image ──
  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setHeroUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CLOUDINARY_PRESET);
    try {
      const res  = await fetch(CLOUDINARY_URL, { method: "POST", body: fd });
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
    await setDoc(doc(db, "pages", "events"), hero);
    setHeroSaved(true);
    setTimeout(() => setHeroSaved(false), 3000);
  };

  // ── Event CRUD ──
  const handleSave = async () => {
    if (!form.title) return alert("Title is required");
    setLoading(true);
    try {
      if (editId) {
        await updateDoc(doc(db, "events", editId), form);
      } else {
        await addDoc(collection(db, "events"), form);
      }
      setForm(empty);
      setEditId(null);
      await fetchEvents();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ev) => {
    setForm({ ...ev });
    setEditId(ev.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await deleteDoc(doc(db, "events", id));
    setEvents(prev => prev.filter(e => e.id !== id));
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
        <h2 style={sectionHeading}>Events Hero Section</h2>

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
            {/* Hidden file input */}
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
          {heroSaved ? "Saved!" : "Save Hero"}
        </button>
      </div>

      {/* ══════════════════════════════════════
          ADD / EDIT EVENT FORM
      ══════════════════════════════════════ */}
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>
        {editId ? "Edit Event" : "Add Event"}
      </h1>

      <div style={sectionCard}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          {[
            ["title",    "Title"],
            ["category", "Category (ACADEMIC, SPORTS, ARTS, COMMUNITY)"],
            ["month",    "Month (e.g. FEB)"],
            ["day",      "Day (e.g. 15)"],
            ["year",     "Year (e.g. 2025)"],
            ["time",     "Time (e.g. 09:00 AM – 03:00 PM)"],
            ["location", "Location"],
          ].map(([key, placeholder]) => (
            <div key={key}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>{placeholder}</label>
              <input
                style={inp}
                value={form[key] || ""}
                placeholder={placeholder}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>

        {/* Description */}
        <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Description</label>
        <textarea
          rows={3}
          style={{ ...inp, resize: "vertical" }}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        {/* Event type */}
        <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Event Type</label>
        <select
          style={inp}
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
        >
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>

        {/* Event image upload */}
        <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>
          Event Image
        </label>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            style={{ padding: "9px 18px", background: "#2471a3", color: "#fff",
              border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}
          >
             Choose from Files / Gallery
          </button>

          <button
            type="button"
            onClick={() => cameraRef.current.click()}
            style={{ padding: "9px 18px", background: "#7d3c98", color: "#fff",
              border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}
          >
             Take Photo
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={e => handleImageUpload(e.target.files[0])}
          />
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={cameraRef}
            style={{ display: "none" }}
            onChange={e => handleImageUpload(e.target.files[0])}
          />
        </div>

        {uploading && (
          <p style={{ color: "#1a7c3e", fontWeight: 600, fontSize: 13, marginBottom: 12 }}>
             Uploading image...
          </p>
        )}

        {form.image && !uploading && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: "#27ae60", fontWeight: 600, marginBottom: 6 }}>
              Image ready
            </p>
            <img
              src={form.image}
              alt="Event preview"
              style={{ width: 200, height: 130, objectFit: "cover",
                borderRadius: 10, border: "1px solid #e8e8e8" }}
            />
            <button
              onClick={() => setForm(prev => ({ ...prev, image: "" }))}
              style={{ display: "block", marginTop: 6, fontSize: 12,
                color: "#c0392b", background: "none", border: "none",
                cursor: "pointer", textDecoration: "underline" }}
            >
              Remove image
            </button>
          </div>
        )}

        {/* Save / Cancel */}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            onClick={handleSave}
            disabled={loading || uploading}
            style={{ padding: "10px 28px", background: "#1a7c3e", color: "#fff",
              border: "none", borderRadius: 8, fontWeight: 700,
              cursor: loading || uploading ? "not-allowed" : "pointer",
              fontSize: 14, opacity: loading || uploading ? 0.7 : 1 }}
          >
            {loading ? "Saving..." : editId ? "Update Event" : "Add Event"}
          </button>
          {editId && (
            <button
              onClick={() => { setForm(empty); setEditId(null); }}
              style={{ padding: "10px 20px", background: "#eee", border: "none",
                borderRadius: 8, cursor: "pointer", fontSize: 14 }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          ALL EVENTS LIST
      ══════════════════════════════════════ */}
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>All Events</h2>
      {events.length === 0 && <p style={{ color: "#888" }}>No events yet.</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {events.map(ev => (
          <div
            key={ev.id}
            style={{ background: "#fff", border: "1px solid #e8e8e8",
              borderRadius: 10, padding: "16px 20px",
              display: "flex", justifyContent: "space-between",
              alignItems: "center", flexWrap: "wrap", gap: 12 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {ev.image && (
                <img
                  src={ev.image}
                  alt={ev.title}
                  style={{ width: 64, height: 48, objectFit: "cover",
                    borderRadius: 8, flexShrink: 0, border: "1px solid #e8e8e8" }}
                />
              )}
              <div>
                <span style={{ fontSize: 11, fontWeight: 700,
                  background: ev.type === "upcoming" ? "#e8f5e9" : "#fce4e4",
                  color: ev.type === "upcoming" ? "#1a7c3e" : "#c0392b",
                  padding: "2px 10px", borderRadius: 20, marginRight: 8 }}>
                  {ev.type?.toUpperCase()}
                </span>
                <strong>{ev.title}</strong>
                <p style={{ color: "#888", fontSize: 13, margin: "2px 0 0" }}>
                  {ev.month} {ev.day}, {ev.year} — {ev.location}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => handleEdit(ev)}
                style={{ padding: "6px 16px", background: "#2471a3", color: "#fff",
                  border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(ev.id)}
                style={{ padding: "6px 16px", background: "#c0392b", color: "#fff",
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
import { useState, useEffect, useRef } from "react";
import { doc, getDoc, setDoc, collection, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dwe1cwhgj/image/upload";
const UPLOAD_PRESET  = "freddy";

const defaultContent = {
  heroImages: [
    "/images/south%20home.png",
    "/images/st%20johnladies.png",
    "/images/SOUTH%20TEE.png",
  ],
  heroTitle: "South Tetu Girl's High School",
  heroSubtitle: "Empowering students to achieve excellence in academics and character.",
  heroButtonText: "View Assignments",

  principal_name: "Mr. Onesmas Mwangi", principal_title: "Senior Principal",
  principal_msg: "Welcome to South Tetu Girl's, where we empower young women to reach their full potential...",
  principal_img: "/images/principal south.png",

  bom_name: "Dr. Josephine Kinya", bom_title: "BOM Chairperson",
  bom_msg: "On behalf of the Board of Management, we are committed to your academic and personal growth...",
  bom_img: "/images/principal south.png",

  pta_name: "Mr. Isaac Nyabicha", pta_title: "P.A Chairperson",
  pta_msg: "As the chairman of the Parent Association, I am proud to address our school community...",
  pta_img: "/images/principal south.png",

  motto: "Discipline and character makes a man.",
  vision: "To be a leading institution in producing well-rounded individuals.",
  mission: "To provide quality education that nurtures academic excellence.",
  coreValues: "Integrity, Godliness, Teamwork, Professionalism, Social responsibility, Courtesy, Commitment.",

  stat_teachers: "50", stat_students: "1200", stat_classrooms: "20", stat_years: "60",
  joinTitle: "Join Us",
  joinText: "South Tetu Girl's empowers students with high-quality education.",
};

const defaultOfferings = [
  { title: "Academics",                   description: "Our rigorous curriculum is designed to challenge and inspire students...", image: "/images/Academics.jpeg", section: "program" },
  { title: "Arts",                        description: "Explore creativity through our vibrant arts program...",                  image: "/images/arts.jpeg",      section: "program" },
  { title: "Extra-Curricular Activities", description: "Our vibrant extra-curricular programs promote teamwork, sports, and clubs...", image: "/images/sports.jpeg", section: "program" },
];

const emptyOffering = { title: "", description: "", image: "", section: "program" };

export default function AdminHome() {
  const [content,          setContent]          = useState(defaultContent);
  const [saving,           setSaving]           = useState(false);
  const [saved,            setSaved]            = useState(false);
  const [uploading,        setUploading]        = useState("");

  // Offerings state
  const [offerings,        setOfferings]        = useState([]);
  const [offeringForm,     setOfferingForm]     = useState(emptyOffering);
  const [offeringEditId,   setOfferingEditId]   = useState(null);
  const [offeringSaving,   setOfferingSaving]   = useState(false);
  const [offeringUploading, setOfferingUploading] = useState(false);

  const offeringImgRef = useRef();

  // ── Load page content + offerings ──
  useEffect(() => {
    getDoc(doc(db, "pages", "home")).then(snap => {
      if (snap.exists()) setContent({ ...defaultContent, ...snap.data() });
    });

    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    const snap = await getDocs(collection(db, "offerings"));
    const programs = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(o => o.section === "program");
    setOfferings(programs);
  };

  // ── Save page content ──
  const handleSave = async () => {
    setSaving(true);
    await setDoc(doc(db, "pages", "home"), content);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // ── Upload single image field (principal/bom/pta) ──
  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(field);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    try {
      const res  = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      const data = await res.json();
      setContent(prev => ({ ...prev, [field]: data.secure_url }));
    } catch { alert("Upload failed"); }
    finally  { setUploading(""); }
  };

  // ── Upload hero slideshow image ──
  const handleHeroImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(`hero_${index}`);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    try {
      const res  = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      const data = await res.json();
      setContent(prev => {
        const updated = [...(prev.heroImages || ["", "", ""])];
        updated[index] = data.secure_url;
        return { ...prev, heroImages: updated };
      });
    } catch { alert("Upload failed"); }
    finally  { setUploading(""); }
  };

  const handleHeroImageRemove = (index) => {
    setContent(prev => {
      const updated = [...(prev.heroImages || ["", "", ""])];
      updated[index] = "";
      return { ...prev, heroImages: updated };
    });
  };

  // ── Upload offering image ──
  const handleOfferingImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setOfferingUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    try {
      const res  = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      const data = await res.json();
      if (data.secure_url) {
        setOfferingForm(prev => ({ ...prev, image: data.secure_url }));
      } else {
        alert("Upload failed.");
      }
    } catch { alert("Upload failed"); }
    finally  { setOfferingUploading(false); }
  };

  // ── Save / update offering ──
  const handleOfferingSave = async () => {
    if (!offeringForm.title) return alert("Title is required");
    setOfferingSaving(true);
    try {
      if (offeringEditId) {
        await updateDoc(doc(db, "offerings", offeringEditId), offeringForm);
      } else {
        await addDoc(collection(db, "offerings"), { ...offeringForm, section: "program" });
      }
      setOfferingForm(emptyOffering);
      setOfferingEditId(null);
      await fetchOfferings();
    } finally {
      setOfferingSaving(false);
    }
  };

  const handleOfferingEdit = (o) => {
    setOfferingForm({ ...o });
    setOfferingEditId(o.id);
    // Scroll to offering editor
    document.getElementById("offering-editor")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOfferingDelete = async (id) => {
    if (!window.confirm("Delete this offering?")) return;
    await deleteDoc(doc(db, "offerings", id));
    setOfferings(prev => prev.filter(o => o.id !== id));
  };

  // ── Styles ──
  const inp = {
    display: "block", width: "100%", padding: "9px 12px",
    borderRadius: 8, border: "1px solid #ddd", fontSize: 14,
    marginBottom: 12, boxSizing: "border-box",
  };

  const sectionCard = {
    background: "#fff", border: "1px solid #e8e8e8",
    borderRadius: 12, padding: 24, marginBottom: 20,
  };

  const sectionHeading = {
    fontSize: 16, fontWeight: 700, marginBottom: 16,
    color: "#1a7c3e", borderBottom: "2px solid #e8f5e9", paddingBottom: 8,
  };

  const sections = [
    {
      title: "Hero Section",
      heroImages: true,
      fields: [
        { key: "heroTitle",      label: "School Name / Hero Title" },
        { key: "heroSubtitle",   label: "Hero Subtitle" },
        { key: "heroButtonText", label: "Button Text" },
      ],
    },
    {
      title: "Principal's Message",
      fields: [
        { key: "principal_name",  label: "Name" },
        { key: "principal_title", label: "Title" },
        { key: "principal_msg",   label: "Message", multiline: true },
      ],
      imageField: "principal_img", imageLabel: "Principal Photo",
    },
    {
      title: "BOM Chair's Message",
      fields: [
        { key: "bom_name",  label: "Name" },
        { key: "bom_title", label: "Title" },
        { key: "bom_msg",   label: "Message", multiline: true },
      ],
      imageField: "bom_img", imageLabel: "BOM Chair Photo",
    },
    {
      title: "PTA Chair's Message",
      fields: [
        { key: "pta_name",  label: "Name" },
        { key: "pta_title", label: "Title" },
        { key: "pta_msg",   label: "Message", multiline: true },
      ],
      imageField: "pta_img", imageLabel: "PTA Chair Photo",
    },
    {
      title: "Values",
      fields: [
        { key: "motto",      label: "Motto" },
        { key: "vision",     label: "Vision",      multiline: true },
        { key: "mission",    label: "Mission",     multiline: true },
        { key: "coreValues", label: "Core Values", multiline: true },
      ],
    },
    {
      title: "Stats",
      fields: [
        { key: "stat_teachers",   label: "Number of Teachers" },
        { key: "stat_students",   label: "Student Population" },
        { key: "stat_classrooms", label: "Number of Classrooms" },
        { key: "stat_years",      label: "Years of Operation" },
      ],
    },
    {
      title: "Join Us Section",
      fields: [
        { key: "joinTitle", label: "Title" },
        { key: "joinText",  label: "Text", multiline: true },
      ],
    },
  ];

  const saveBtn = (style = {}) => (
    <button
      onClick={handleSave}
      disabled={saving}
      style={{
        padding: "10px 28px",
        background: saved ? "#27ae60" : "#1a7c3e",
        color: "#fff", border: "none", borderRadius: 8,
        fontWeight: 700, cursor: "pointer", fontSize: 14,
        ...style,
      }}
    >
      {saving ? "Saving..." : saved ? "Saved!" : "Save All Changes"}
    </button>
  );

  return (
    <div>

      {/* Top header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Edit Home Page</h1>
        {saveBtn()}
      </div>

      {/* ── Page content sections (hero, messages, values, stats, join us) ── */}
      {sections.map(section => (
        <div key={section.title} style={sectionCard}>
          <h2 style={sectionHeading}>{section.title}</h2>

          {/* Hero slideshow uploader */}
          {section.heroImages && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#444", display: "block", marginBottom: 4 }}>
                Hero Slideshow Images (up to 3)
              </label>
              <p style={{ fontSize: 12, color: "#888", margin: "0 0 12px" }}>
                These images cycle automatically on the homepage. Leave a slot empty to skip it.
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ border: "1px solid #e0e0e0", borderRadius: 10,
                    padding: 12, width: 180, background: "#fafafa" }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#555",
                      marginBottom: 8, textAlign: "center" }}>
                      Slide {i + 1}
                    </p>
                    {content.heroImages?.[i] ? (
                      <img src={content.heroImages[i]} alt={`Slide ${i + 1}`}
                        style={{ width: "100%", height: 100, objectFit: "cover",
                          borderRadius: 6, marginBottom: 8, border: "2px solid #1a7c3e" }} />
                    ) : (
                      <div style={{ width: "100%", height: 100, borderRadius: 6,
                        border: "2px dashed #ccc", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        color: "#bbb", fontSize: 12, marginBottom: 8 }}>
                        No image
                      </div>
                    )}
                    <input type="file" accept="image/*"
                      onChange={e => handleHeroImageUpload(e, i)}
                      style={{ fontSize: 11, width: "100%" }} />
                    {uploading === `hero_${i}` && (
                      <p style={{ color: "#1a7c3e", fontSize: 11, margin: "6px 0 0", textAlign: "center" }}>
                        Uploading...
                      </p>
                    )}
                    {content.heroImages?.[i] && (
                      <button onClick={() => handleHeroImageRemove(i)}
                        style={{ display: "block", width: "100%", marginTop: 6,
                          fontSize: 11, color: "#e74c3c", background: "none",
                          border: "none", cursor: "pointer", textDecoration: "underline" }}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Text fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            {section.fields.map(({ key, label, multiline }) => (
              <div key={key} style={multiline ? { gridColumn: "1 / -1" } : {}}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>{label}</label>
                {multiline ? (
                  <textarea rows={3} style={{ ...inp, resize: "vertical" }}
                    value={content[key] || ""}
                    onChange={e => setContent({ ...content, [key]: e.target.value })} />
                ) : (
                  <input style={inp} value={content[key] || ""}
                    onChange={e => setContent({ ...content, [key]: e.target.value })} />
                )}
              </div>
            ))}
          </div>

          {/* Single image uploader (principal / bom / pta) */}
          {section.imageField && (
            <div style={{ marginTop: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>{section.imageLabel}</label>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 6 }}>
                <img src={content[section.imageField] || "/images/principal south.png"}
                  alt="preview"
                  style={{ width: 64, height: 64, borderRadius: "50%",
                    objectFit: "cover", border: "2px solid #1a7c3e" }} />
                <div>
                  <input type="file" accept="image/*"
                    onChange={e => handleImageUpload(e, section.imageField)}
                    style={{ fontSize: 13 }} />
                  {uploading === section.imageField && (
                    <p style={{ color: "#1a7c3e", fontSize: 13, margin: "4px 0 0" }}>Uploading...</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* ══════════════════════════════════════
          OFFERINGS SECTION (Academics / Arts / Extra-Curricular)
      ══════════════════════════════════════ */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>Home Page Offerings (Program Cards)</h2>
        <p style={{ fontSize: 13, color: "#666", marginBottom: 20, marginTop: -8 }}>
          These are the 3 program cards shown on the home page under "Our Offerings".
          Only the first 3 are displayed.
        </p>

        {/* Current offerings list */}
        <div style={{ display: "grid", gap: 12, marginBottom: 28 }}>
          {(offerings.length > 0 ? offerings : defaultOfferings).map((o, i) => (
            <div key={o.id || i} style={{ display: "flex", alignItems: "center", gap: 16,
              border: "1px solid #e8e8e8", borderRadius: 10,
              padding: "14px 16px", background: "#fafafa", flexWrap: "wrap" }}>

              {/* Image preview */}
              <img
                src={o.image || "/images/Academics.jpeg"}
                alt={o.title}
                style={{ width: 80, height: 60, objectFit: "cover",
                  borderRadius: 8, border: "1px solid #e0e0e0", flexShrink: 0 }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ fontSize: 14 }}>{o.title}</strong>
                <p style={{ fontSize: 12, color: "#888", margin: "4px 0 0",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {o.description}
                </p>
              </div>

              {/* Only show edit/delete for real Firestore entries */}
              {o.id && (
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => handleOfferingEdit(o)}
                    style={{ padding: "6px 14px", background: "#2471a3", color: "#fff",
                      border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
                    Edit
                  </button>
                  <button onClick={() => handleOfferingDelete(o.id)}
                    style={{ padding: "6px 14px", background: "#c0392b", color: "#fff",
                      border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add / Edit offering form */}
        <div id="offering-editor" style={{ borderTop: "2px solid #e8f5e9", paddingTop: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "#1a7c3e" }}>
            {offeringEditId ? "Edit Offering" : "Add New Offering"}
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Title</label>
              <input style={inp} value={offeringForm.title}
                placeholder="e.g. Academics"
                onChange={e => setOfferingForm(prev => ({ ...prev, title: e.target.value }))} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Description</label>
              <textarea rows={3} style={{ ...inp, resize: "vertical" }}
                value={offeringForm.description}
                placeholder="Short description shown on the card..."
                onChange={e => setOfferingForm(prev => ({ ...prev, description: e.target.value }))} />
            </div>
          </div>

          {/* Offering image */}
          <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>
            Card Image
          </label>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
            {offeringForm.image ? (
              <img src={offeringForm.image} alt="preview"
                style={{ width: 140, height: 90, objectFit: "cover",
                  borderRadius: 8, border: "2px solid #1a7c3e" }} />
            ) : (
              <div style={{ width: 140, height: 90, borderRadius: 8,
                border: "2px dashed #ccc", display: "flex",
                alignItems: "center", justifyContent: "center",
                color: "#bbb", fontSize: 12 }}>
                No image
              </div>
            )}
            <div>
              <input type="file" accept="image/*" ref={offeringImgRef}
                style={{ display: "none" }}
                onChange={handleOfferingImageUpload} />
              <button onClick={() => offeringImgRef.current.click()}
                disabled={offeringUploading}
                style={{ padding: "9px 18px", background: "#2471a3", color: "#fff",
                  border: "none", borderRadius: 8, cursor: "pointer",
                  fontWeight: 600, fontSize: 13, display: "block", marginBottom: 8,
                  opacity: offeringUploading ? 0.7 : 1 }}>
                 Choose Image
              </button>
              {offeringUploading && (
                <p style={{ color: "#1a7c3e", fontSize: 13, margin: 0 }}>⏳ Uploading...</p>
              )}
              {offeringForm.image && !offeringUploading && (
                <button onClick={() => setOfferingForm(prev => ({ ...prev, image: "" }))}
                  style={{ fontSize: 12, color: "#c0392b", background: "none",
                    border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  Remove image
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={handleOfferingSave}
              disabled={offeringSaving || offeringUploading}
              style={{ padding: "10px 28px", background: "#1a7c3e", color: "#fff",
                border: "none", borderRadius: 8, fontWeight: 700,
                cursor: offeringSaving || offeringUploading ? "not-allowed" : "pointer",
                fontSize: 14, opacity: offeringSaving || offeringUploading ? 0.7 : 1 }}>
              {offeringSaving ? "Saving..." : offeringEditId ? "Update Offering" : "Add Offering"}
            </button>
            {offeringEditId && (
              <button onClick={() => { setOfferingForm(emptyOffering); setOfferingEditId(null); }}
                style={{ padding: "10px 20px", background: "#eee", border: "none",
                  borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom save button */}
      {saveBtn({ padding: "12px 36px", fontSize: 15, marginTop: 8 })}
    </div>
  );
}
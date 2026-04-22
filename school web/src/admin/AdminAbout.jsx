import { useState, useEffect, useRef } from "react";
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const CLOUDINARY_URL    = "https://api.cloudinary.com/v1_1/dwe1cwhgj/image/upload"; // ← replace
const CLOUDINARY_PRESET = "freddy"; // ← replace

const DEFAULT_TEXT = {
  heroTitle:    "About South Tetu Girl's",
  heroSubtitle: "Empowering students to achieve excellence in academics and character.",
  visionTitle:  "Our Vision",
  visionP1:     "South Tetu Girl's High School is a distinguished educational facility situated in Nyeri county, Kenya.",
  visionP2:     "Founded in 1962, South Tetu Girl's started with a mission to provide quality education.",
  joinTitle:    "Get Involved",
  joinText:     "Discover how you can support the growth of our students.",
};

export default function AdminAbout() {
  const [text,          setText]         = useState(DEFAULT_TEXT);
  const [sports,        setSports]       = useState([]);
  const [clubs,         setClubs]        = useState([]);
  const [dorms,         setDorms]        = useState([]);
  const [values,        setValues]       = useState([]);
  const [saving,        setSaving]       = useState(false);
  const [saved,         setSaved]        = useState(false);
  const [uploading,     setUploading]    = useState("");
  const [activeSection, setActive]       = useState("text");

  // Sports form
  const [newSport,    setNewSport]    = useState({ name: "", desc: "", image: "" });
  const [editSportId, setEditSportId] = useState(null);

  // Club form
  const [newClub,    setNewClub]    = useState({ name: "", image: "" });
  const [editClubId, setEditClubId] = useState(null);

  // Dorm form
  const [newDorm,    setNewDorm]    = useState({ name: "", desc: "", image: "" });
  const [editDormId, setEditDormId] = useState(null);

  // Value form
  const [newValue,    setNewValue]    = useState({ name: "", desc: "", image: "" });
  const [editValueId, setEditValueId] = useState(null);

  // File input refs
  const sportFileRef   = useRef(); const sportCameraRef  = useRef();
  const clubFileRef    = useRef(); const clubCameraRef   = useRef();
  const dormFileRef    = useRef(); const dormCameraRef   = useRef();
  const valueFileRef   = useRef(); const valueCameraRef  = useRef();
  const sportsImgRef   = useRef();

  useEffect(() => {
    getDoc(doc(db, "pages", "about"))
      .then(snap => { if (snap.exists()) setText(prev => ({ ...prev, ...snap.data() })); })
      .catch(() => {});
    fetchCol("about_sports", setSports);
    fetchCol("about_clubs",  setClubs);
    fetchCol("about_dorms",  setDorms);
    fetchCol("about_values", setValues);
  }, []);

  const fetchCol = (name, setter) => {
    getDocs(collection(db, name))
      .then(snap => setter(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .catch(() => {});
  };

  const uploadImage = async (file, onDone, key) => {
    setUploading(key);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CLOUDINARY_PRESET);
    try {
      const res  = await fetch(CLOUDINARY_URL, { method: "POST", body: fd });
      const data = await res.json();
      if (data.secure_url) onDone(data.secure_url);
      else alert("Upload failed. Check your Cloudinary preset.");
    } catch { alert("Upload error"); }
    finally { setUploading(""); }
  };

  const saveText = async () => {
    setSaving(true);
    await setDoc(doc(db, "pages", "about"), text);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Generic save (add or update) for any collection
  const saveItem = async (colName, data, editId, setter, resetForm) => {
    if (editId) {
      await updateDoc(doc(db, colName, editId), data);
      setter(prev => prev.map(i => i.id === editId ? { id: editId, ...data } : i));
    } else {
      const ref = await addDoc(collection(db, colName), data);
      setter(prev => [...prev, { id: ref.id, ...data }]);
    }
    resetForm();
  };

  const deleteItem = async (colName, id, setter) => {
    if (!window.confirm("Delete this item?")) return;
    await deleteDoc(doc(db, colName, id));
    setter(prev => prev.filter(i => i.id !== id));
  };

  const inp = {
    display: "block", width: "100%", padding: "9px 12px",
    borderRadius: 8, border: "1px solid #ddd", fontSize: 14,
    marginBottom: 12, boxSizing: "border-box",
  };

  const tabBtn = (key, label) => (
    <button key={key} onClick={() => setActive(key)}
      style={{ padding: "9px 20px", borderRadius: 8, border: "none", cursor: "pointer",
        fontWeight: 600, fontSize: 14, marginRight: 8, marginBottom: 16,
        background: activeSection === key ? "#1a7c3e" : "#e8f5e9",
        color:      activeSection === key ? "#fff"    : "#1a7c3e" }}>
      {label}
    </button>
  );

  const card = (children) => (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8",
      borderRadius: 12, padding: 24, marginBottom: 20 }}>
      {children}
    </div>
  );

  const secTitle = (t) => (
    <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16,
      color: "#1a7c3e", borderBottom: "2px solid #e8f5e9", paddingBottom: 8 }}>
      {t}
    </h2>
  );

  // Reusable image picker buttons
  const imgPicker = (fileRef, cameraRef, uploadKey, onUpload) => (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        <button type="button" onClick={() => fileRef.current.click()}
          style={{ padding: "7px 14px", background: "#2471a3", color: "#fff",
            border: "none", borderRadius: 7, cursor: "pointer", fontWeight: 600, fontSize: 12 }}>
           Files / Gallery
        </button>
        <button type="button" onClick={() => cameraRef.current.click()}
          style={{ padding: "7px 14px", background: "#7d3c98", color: "#fff",
            border: "none", borderRadius: 7, cursor: "pointer", fontWeight: 600, fontSize: 12 }}>
           Take Photo
        </button>
      </div>
      <input type="file" accept="image/*" ref={fileRef} style={{ display: "none" }}
        onChange={async e => { const f = e.target.files[0]; if (f) await uploadImage(f, onUpload, uploadKey); }} />
      <input type="file" accept="image/*" capture="environment" ref={cameraRef} style={{ display: "none" }}
        onChange={async e => { const f = e.target.files[0]; if (f) await uploadImage(f, onUpload, uploadKey); }} />
      {uploading === uploadKey && <p style={{ color: "#1a7c3e", fontSize: 13 }}>⏳ Uploading...</p>}
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Edit About Page</h1>
        {activeSection === "text" && (
          <button onClick={saveText} disabled={saving}
            style={{ padding: "10px 28px", background: saved ? "#27ae60" : "#1a7c3e",
              color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
          </button>
        )}
      </div>

      <div style={{ marginBottom: 8 }}>
        {tabBtn("text",   " Text")}
        {tabBtn("sports", " Sports")}
        {tabBtn("clubs",  " Clubs")}
        {tabBtn("dorms",  " Dorms")}
        {tabBtn("values", " Values")}
      </div>

      {/* ── TEXT ── */}
      {activeSection === "text" && (
        <>
          {card(<>
            {secTitle("Hero Section")}
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Page Title</label>
            <input style={inp} value={text.heroTitle} onChange={e => setText({ ...text, heroTitle: e.target.value })} />
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Subtitle</label>
            <input style={inp} value={text.heroSubtitle} onChange={e => setText({ ...text, heroSubtitle: e.target.value })} />
          </>)}

          {card(<>
            {secTitle("Vision Section")}
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Section Title</label>
            <input style={inp} value={text.visionTitle} onChange={e => setText({ ...text, visionTitle: e.target.value })} />
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Paragraph 1</label>
            <textarea rows={4} style={{ ...inp, resize: "vertical" }} value={text.visionP1}
              onChange={e => setText({ ...text, visionP1: e.target.value })} />
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Paragraph 2</label>
            <textarea rows={4} style={{ ...inp, resize: "vertical" }} value={text.visionP2}
              onChange={e => setText({ ...text, visionP2: e.target.value })} />
          </>)}

          {card(<>
            {secTitle("Join Us Section")}
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Title</label>
            <input style={inp} value={text.joinTitle} onChange={e => setText({ ...text, joinTitle: e.target.value })} />
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Text</label>
            <textarea rows={3} style={{ ...inp, resize: "vertical" }} value={text.joinText}
              onChange={e => setText({ ...text, joinText: e.target.value })} />
          </>)}

          <button onClick={saveText} disabled={saving}
            style={{ padding: "12px 36px", background: saved ? "#27ae60" : "#1a7c3e",
              color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save All Changes"}
          </button>
        </>
      )}

      {/* ── SPORTS ── */}
      {activeSection === "sports" && (
        <>
          {card(<>
            {secTitle(editSportId ? "✏️ Edit Sport" : "Add Sport")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Sport Name</label>
                <input style={inp} placeholder="e.g. Football" value={newSport.name}
                  onChange={e => setNewSport({ ...newSport, name: e.target.value })} />
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Description</label>
                <textarea rows={3} style={{ ...inp, resize: "vertical" }} placeholder="Brief description..."
                  value={newSport.desc}
                  onChange={e => setNewSport({ ...newSport, desc: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Sport Photo</label>
                {imgPicker(sportFileRef, sportCameraRef, "sport",
                  url => setNewSport(prev => ({ ...prev, image: url })))}
                {newSport.image && (
                  <img src={newSport.image} alt="preview"
                    style={{ width: 100, height: 70, objectFit: "cover", borderRadius: 8, marginTop: 6 }} />
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button
                onClick={() => saveItem(
                  "about_sports", newSport, editSportId, setSports,
                  () => { setNewSport({ name: "", desc: "", image: "" }); setEditSportId(null); }
                )}
                disabled={uploading === "sport"}
                style={{ padding: "10px 24px", background: editSportId ? "#2471a3" : "#1a7c3e",
                  color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
                {editSportId ? "Update Sport" : "Add Sport"}
              </button>
              {editSportId && (
                <button onClick={() => { setNewSport({ name: "", desc: "", image: "" }); setEditSportId(null); }}
                  style={{ padding: "10px 20px", background: "#eee", border: "none",
                    borderRadius: 8, cursor: "pointer" }}>
                  Cancel
                </button>
              )}
            </div>
          </>)}

          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>All Sports ({sports.length})</h2>
          {sports.length === 0 && <p style={{ color: "#888" }}>No sports added yet.</p>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {sports.map(sport => (
              <div key={sport.id} style={{ background: "#fff", border: "1px solid #e8e8e8",
                borderRadius: 10, overflow: "hidden" }}>
                <img src={sport.image || "/images/sports.jpeg"} alt={sport.name}
                  style={{ width: "100%", height: 120, objectFit: "cover" }} />
                <div style={{ padding: "10px 12px" }}>
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>{sport.name}</p>
                  {sport.desc && <p style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>{sport.desc}</p>}
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => {
                      setNewSport({ name: sport.name, desc: sport.desc, image: sport.image });
                      setEditSportId(sport.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                      style={{ flex: 1, padding: "5px 0", background: "#2471a3", color: "#fff",
                        border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
                      Edit
                    </button>
                    <button onClick={() => deleteItem("about_sports", sport.id, setSports)}
                      style={{ flex: 1, padding: "5px 0", background: "#c0392b", color: "#fff",
                        border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── CLUBS ── */}
      {activeSection === "clubs" && (
        <>
          {card(<>
            {secTitle(editClubId ? "✏️ Edit Club" : "Add Club / Society")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Club Name</label>
                <input style={inp} placeholder="e.g. Debate Club" value={newClub.name}
                  onChange={e => setNewClub({ ...newClub, name: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Club Photo</label>
                {imgPicker(clubFileRef, clubCameraRef, "club",
                  url => setNewClub(prev => ({ ...prev, image: url })))}
                {newClub.image && (
                  <img src={newClub.image} alt="preview"
                    style={{ width: 80, height: 70, objectFit: "cover", borderRadius: 8, marginTop: 4 }} />
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button
                onClick={() => saveItem(
                  "about_clubs", newClub, editClubId, setClubs,
                  () => { setNewClub({ name: "", image: "" }); setEditClubId(null); }
                )}
                disabled={uploading === "club"}
                style={{ padding: "10px 24px", background: editClubId ? "#2471a3" : "#1a7c3e",
                  color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
                {editClubId ? "Update Club" : "Add Club"}
              </button>
              {editClubId && (
                <button onClick={() => { setNewClub({ name: "", image: "" }); setEditClubId(null); }}
                  style={{ padding: "10px 20px", background: "#eee", border: "none",
                    borderRadius: 8, cursor: "pointer" }}>
                  Cancel
                </button>
              )}
            </div>
          </>)}

          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>All Clubs ({clubs.length})</h2>
          {clubs.length === 0 && <p style={{ color: "#888" }}>No clubs added yet.</p>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {clubs.map(club => (
              <div key={club.id} style={{ background: "#fff", border: "1px solid #e8e8e8",
                borderRadius: 10, padding: 12, textAlign: "center" }}>
                <img src={club.image || "/images/st johnladies.png"} alt={club.name}
                  style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 8, marginBottom: 8 }} />
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{club.name}</p>
                <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                  <button onClick={() => {
                    setNewClub({ name: club.name, image: club.image });
                    setEditClubId(club.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                    style={{ padding: "4px 12px", background: "#2471a3", color: "#fff",
                      border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
                    Edit
                  </button>
                  <button onClick={() => deleteItem("about_clubs", club.id, setClubs)}
                    style={{ padding: "4px 12px", background: "#c0392b", color: "#fff",
                      border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── DORMS ── */}
      {activeSection === "dorms" && (
        <>
          {card(<>
            {secTitle(editDormId ? "✏️ Edit Dorm" : "Add Dormitory")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Dorm Name</label>
                <input style={inp} placeholder="e.g. Livingstone House" value={newDorm.name}
                  onChange={e => setNewDorm({ ...newDorm, name: e.target.value })} />
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Description</label>
                <input style={inp} placeholder="e.g. Named after Dr. David Livingstone" value={newDorm.desc}
                  onChange={e => setNewDorm({ ...newDorm, desc: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Dorm Photo</label>
                {imgPicker(dormFileRef, dormCameraRef, "dorm",
                  url => setNewDorm(prev => ({ ...prev, image: url })))}
                {newDorm.image && (
                  <img src={newDorm.image} alt="preview"
                    style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 8 }} />
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button
                onClick={() => saveItem(
                  "about_dorms", newDorm, editDormId, setDorms,
                  () => { setNewDorm({ name: "", desc: "", image: "" }); setEditDormId(null); }
                )}
                disabled={uploading === "dorm"}
                style={{ padding: "10px 24px", background: editDormId ? "#2471a3" : "#1a7c3e",
                  color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
                {editDormId ? "Update Dorm" : "Add Dormitory"}
              </button>
              {editDormId && (
                <button onClick={() => { setNewDorm({ name: "", desc: "", image: "" }); setEditDormId(null); }}
                  style={{ padding: "10px 20px", background: "#eee", border: "none",
                    borderRadius: 8, cursor: "pointer" }}>
                  Cancel
                </button>
              )}
            </div>
          </>)}

          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>All Dormitories ({dorms.length})</h2>
          {dorms.length === 0 && <p style={{ color: "#888" }}>No dormitories added yet.</p>}
          <div style={{ display: "grid", gap: 10 }}>
            {dorms.map(dorm => (
              <div key={dorm.id} style={{ background: "#fff", border: "1px solid #e8e8e8",
                borderRadius: 10, padding: "14px 20px",
                display: "flex", alignItems: "center", gap: 16 }}>
                <img src={dorm.image || "/images/dorms.png"} alt={dorm.name}
                  style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <strong>{dorm.name}</strong>
                  <p style={{ color: "#666", fontSize: 13, margin: "2px 0 0" }}>{dorm.desc}</p>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => {
                    setNewDorm({ name: dorm.name, desc: dorm.desc, image: dorm.image });
                    setEditDormId(dorm.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                    style={{ padding: "6px 14px", background: "#2471a3", color: "#fff",
                      border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
                    Edit
                  </button>
                  <button onClick={() => deleteItem("about_dorms", dorm.id, setDorms)}
                    style={{ padding: "6px 14px", background: "#c0392b", color: "#fff",
                      border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── VALUES ── */}
      {activeSection === "values" && (
        <>
          {card(<>
            {secTitle(editValueId ? "✏️ Edit Value" : "Add Core Value")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Value Name</label>
                <input style={inp} placeholder="e.g. Integrity" value={newValue.name}
                  onChange={e => setNewValue({ ...newValue, name: e.target.value })} />
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Description</label>
                <textarea rows={3} style={{ ...inp, resize: "vertical" }} value={newValue.desc}
                  onChange={e => setNewValue({ ...newValue, desc: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Icon / Image</label>
                {imgPicker(valueFileRef, valueCameraRef, "value",
                  url => setNewValue(prev => ({ ...prev, image: url })))}
                {newValue.image && (
                  <img src={newValue.image} alt="preview"
                    style={{ width: 60, height: 60, objectFit: "contain", borderRadius: 8, marginTop: 4 }} />
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button
                onClick={() => saveItem(
                  "about_values", newValue, editValueId, setValues,
                  () => { setNewValue({ name: "", desc: "", image: "" }); setEditValueId(null); }
                )}
                disabled={uploading === "value"}
                style={{ padding: "10px 24px", background: editValueId ? "#2471a3" : "#1a7c3e",
                  color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
                {editValueId ? "Update Value" : "Add Value"}
              </button>
              {editValueId && (
                <button onClick={() => { setNewValue({ name: "", desc: "", image: "" }); setEditValueId(null); }}
                  style={{ padding: "10px 20px", background: "#eee", border: "none",
                    borderRadius: 8, cursor: "pointer" }}>
                  Cancel
                </button>
              )}
            </div>
          </>)}

          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>All Core Values ({values.length})</h2>
          {values.length === 0 && <p style={{ color: "#888" }}>No values added yet.</p>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {values.map(v => (
              <div key={v.id} style={{ background: "#fff", border: "1px solid #e8e8e8",
                borderRadius: 10, padding: 16, textAlign: "center" }}>
                <img src={v.image} alt={v.name}
                  style={{ width: 60, height: 60, objectFit: "contain", marginBottom: 8 }} />
                <p style={{ fontWeight: 700, marginBottom: 4 }}>{v.name}</p>
                <p style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>{v.desc}</p>
                <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                  <button onClick={() => {
                    setNewValue({ name: v.name, desc: v.desc, image: v.image });
                    setEditValueId(v.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                    style={{ padding: "4px 12px", background: "#2471a3", color: "#fff",
                      border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
                    Edit
                  </button>
                  <button onClick={() => deleteItem("about_values", v.id, setValues)}
                    style={{ padding: "4px 12px", background: "#c0392b", color: "#fff",
                      border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
import { useState, useEffect, useRef } from "react";
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, setDoc, getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [forms, setForms] = useState(["Form One", "Form Two", "Form Three", "Form Four"]);
  const [form, setForm] = useState({ formLevel: "Form One", subject: "", fileUrl: "", fileName: "" });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeForm, setActiveForm] = useState("Form One");
  const fileRef = useRef();

  const fetchFormNames = async () => {
    try {
      const settingsSnap = await getDoc(doc(db, "schoolSettings", "formLevels"));
      if (settingsSnap.exists()) {
        const savedForms = settingsSnap.data().forms || [];
        if (savedForms.length > 0) {
          setForms(savedForms);
          setForm((prev) => ({ ...prev, formLevel: savedForms[0] }));
          setActiveForm(savedForms[0]);
        }
      }
    } catch (error) { console.error("Failed to fetch form names:", error); }
  };

  const saveFormNames = async () => {
    try {
      await setDoc(doc(db, "schoolSettings", "formLevels"), { forms });
      alert("Form names updated successfully!");
    } catch (error) { alert("Failed to save form names"); }
  };

  const fetchAssignments = async () => {
    const snap = await getDocs(collection(db, "assignments"));
    setAssignments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchAssignments(); fetchFormNames(); }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") { alert("Only PDF documents are allowed."); return; }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "freddy");
    formData.append("resource_type", "raw");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dwe1cwhgj/raw/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.secure_url) {
        setForm((prev) => ({ ...prev, fileUrl: data.secure_url, fileName: prev.fileName || file.name }));
        alert("File uploaded successfully!");
      } else { alert("Upload failed."); }
    } catch (err) { alert("Upload error: " + err.message); }
    finally { setUploading(false); }
  };

  const handleAdd = async () => {
    if (!form.subject) return alert("Subject is required");
    if (!form.fileUrl) return alert("Please upload a file first");
    setLoading(true);
    try {
      await addDoc(collection(db, "assignments"), form);
      setForm({ formLevel: form.formLevel, subject: "", fileUrl: "", fileName: "" });
      if (fileRef.current) fileRef.current.value = "";
      await fetchAssignments();
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    await deleteDoc(doc(db, "assignments", id));
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const filtered = assignments.filter((a) => a.formLevel === activeForm);

  // ── Styles ──────────────────────────────────────────────
  const s = {
    page: {
      maxWidth: 800, margin: "0 auto", padding: "32px 24px",
      fontFamily: "'Segoe UI', sans-serif", color: "#1a1a1a",
    },
    pageTitle: {
      fontSize: "1.8rem", fontWeight: 700, color: "#653115",
      marginBottom: 24, borderBottom: "3px solid #653115",
      paddingBottom: 12,
    },
    sectionCard: {
      background: "#fff", borderRadius: 12, padding: 24,
      marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      border: "1px solid #f0e6df",
    },
    sectionTitle: {
      fontSize: "1.1rem", fontWeight: 700, color: "#653115",
      marginBottom: 16, display: "flex", alignItems: "center", gap: 8,
    },
    formNamesGrid: {
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16,
    },
    input: {
      width: "100%", padding: "10px 14px", borderRadius: 8,
      border: "1.5px solid #e0d0c8", fontSize: "0.92rem",
      outline: "none", boxSizing: "border-box",
      transition: "border-color 0.2s",
      fontFamily: "inherit",
    },
    inputGroup: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 },
    row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    select: {
      width: "100%", padding: "10px 14px", borderRadius: 8,
      border: "1.5px solid #e0d0c8", fontSize: "0.92rem",
      background: "#616161", outline: "none", fontFamily: "inherit",
      cursor: "pointer",
    },
    fileBox: {
      border: "2px dashed #e0d0c8", borderRadius: 8, padding: "16px",
      textAlign: "center", cursor: "pointer", background: "#fdf8f6",
    },
    fileInput: { width: "100%", fontSize: "0.88rem", cursor: "pointer" },
    btnPrimary: {
      background: "#653115", color: "#fff", border: "none",
      padding: "11px 24px", borderRadius: 8, fontSize: "0.92rem",
      fontWeight: 600, cursor: "pointer", transition: "background 0.2s",
      width: "100%",
    },
    btnSave: {
      background: "#2a6f97", color: "#fff", border: "none",
      padding: "10px 20px", borderRadius: 8, fontSize: "0.88rem",
      fontWeight: 600, cursor: "pointer",
    },
    uploadBadge: {
      display: "inline-block", background: "#dcfce7", color: "#166534",
      fontSize: "0.78rem", fontWeight: 600, padding: "4px 10px",
      borderRadius: 20, marginTop: 8,
    },
    tabRow: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 },
    tab: (active) => ({
      padding: "8px 18px", borderRadius: 20, border: "1.5px solid #653115",
      background: active ? "#653115" : "#fff",
      color: active ? "#fff" : "#653115",
      fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
      transition: "all 0.2s",
    }),
    assignmentItem: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 16px", borderRadius: 10, marginBottom: 10,
      background: "#fdf8f6", border: "1px solid #f0e6df",
      flexWrap: "wrap", gap: 8,
    },
    assignmentLeft: { display: "flex", flexDirection: "column", gap: 2 },
    assignmentName: { fontWeight: 700, fontSize: "0.95rem", color: "#1a1a1a" },
    assignmentFile: { fontSize: "0.78rem", color: "#888" },
    assignmentRight: { display: "flex", alignItems: "center", gap: 8 },
    viewBtn: {
      padding: "6px 14px", borderRadius: 6, background: "#e0f2fe",
      color: "#0369a1", border: "none", fontSize: "0.82rem",
      fontWeight: 600, cursor: "pointer", textDecoration: "none",
      display: "inline-block",
    },
    deleteBtn: {
      padding: "6px 14px", borderRadius: 6, background: "#fee2e2",
      color: "#dc2626", border: "none", fontSize: "0.82rem",
      fontWeight: 600, cursor: "pointer",
    },
    empty: {
      textAlign: "center", color: "#aaa", padding: "32px 0",
      fontSize: "0.9rem",
    },
    divider: { border: "none", borderTop: "1px solid #f0e6df", margin: "4px 0 16px" },
  };

  return (
    <div style={s.page}>
      <h1 style={s.pageTitle}> Assignments Admin</h1>

      {/* ── Edit Form Names ── */}
      <div style={s.sectionCard}>
        <div style={s.sectionTitle}>Edit Form Names</div>
        <hr style={s.divider} />
        <div style={s.formNamesGrid}>
          {forms.map((f, index) => (
            <input
              key={index}
              value={f}
              style={s.input}
              onChange={(e) => {
                const updated = [...forms];
                updated[index] = e.target.value;
                setForms(updated);
              }}
            />
          ))}
        </div>
        <button style={s.btnSave} onClick={saveFormNames}>
           Save Form Names
        </button>
      </div>

      {/* ── Add Assignment ── */}
      <div style={s.sectionCard}>
        <div style={s.sectionTitle}>Add Assignment</div>
        <hr style={s.divider} />

        <div style={s.inputGroup}>
          <div style={s.row}>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#666", marginBottom: 4, display: "block" }}>
                Form Level
              </label>
              <select
                style={s.select}
                value={form.formLevel}
                onChange={(e) => setForm({ ...form, formLevel: e.target.value })}
              >
                {forms.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", color: "#666", marginBottom: 4, display: "block" }}>
                Subject
              </label>
              <input
                style={s.input}
                placeholder="e.g. Mathematics"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", color: "#666", marginBottom: 4, display: "block" }}>
              Display Name
            </label>
            <input
              style={s.input}
              placeholder="e.g. Form 1 Maths Holiday Assignment"
              value={form.fileName}
              onChange={(e) => setForm({ ...form, fileName: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", color: "#666", marginBottom: 4, display: "block" }}>
              Upload PDF
            </label>
            <div style={s.fileBox}>
              <input
                type="file"
                accept=".pdf"
                ref={fileRef}
                style={s.fileInput}
                onChange={handleFileUpload}
              />
              {uploading && (
                <p style={{ marginTop: 8, fontSize: "0.82rem", color: "#653115" }}>
                  Uploading...
                </p>
              )}
              {form.fileUrl && !uploading && (
                <span style={s.uploadBadge}>File uploaded</span>
              )}
            </div>
          </div>
        </div>

        <button
          style={{ ...s.btnPrimary, opacity: loading || uploading ? 0.6 : 1 }}
          onClick={handleAdd}
          disabled={loading || uploading}
        >
          {loading ? "Saving..." : uploading ? "Uploading..." : "Add Assignment"}
        </button>
      </div>

      {/* ── View Assignments ── */}
      <div style={s.sectionCard}>
        <div style={s.sectionTitle}>Assignments by Form</div>
        <hr style={s.divider} />

        <div style={s.tabRow}>
          {forms.map((f) => (
            <button key={f} style={s.tab(activeForm === f)} onClick={() => setActiveForm(f)}>
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p style={s.empty}>No assignments for {activeForm} yet.</p>
        ) : (
          filtered.map((a) => (
            <div key={a.id} style={s.assignmentItem}>
              <div style={s.assignmentLeft}>
                <span style={s.assignmentName}>{a.subject}</span>
                <span style={s.assignmentFile}>{a.fileName}</span>
              </div>
              <div style={s.assignmentRight}>
                <a href={a.fileUrl} target="_blank" rel="noopener noreferrer" style={s.viewBtn}>
                  👁 View
                </a>
                <button style={s.deleteBtn} onClick={() => handleDelete(a.id)}>
                  🗑 Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
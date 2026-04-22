import { useState, useEffect, useRef } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const FORMS = ["Form One", "Form Two", "Form Three", "Form Four"];

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ formLevel: "Form One", subject: "", fileUrl: "", fileName: "" });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeForm, setActiveForm] = useState("Form One");
  const fileRef = useRef();

  const fetchAssignments = async () => {
    const snap = await getDocs(collection(db, "assignments"));
    setAssignments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchAssignments(); }, []);

  // Upload PDF to Cloudinary
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Only allow PDF, DOC, DOCX
    const allowed = ["application/pdf"];

if (!allowed.includes(file.type)) {
  alert("Only PDF documents are allowed.");
  return;
}

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "freddy"); // ← replace
    formData.append("resource_type", "raw"); // required for non-image files

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dwe1cwhgj/raw/upload", 
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        setForm(prev => ({
          ...prev,
          fileUrl: data.secure_url,
          fileName: prev.fileName || file.name, // auto-fill filename if empty
        }));
        alert("File uploaded successfully!");
      } else {
        alert("Upload failed. Check your Cloudinary preset.");
      }
    } catch (err) {
      alert("Upload error: " + err.message);
    } finally {
      setUploading(false);
    }
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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    await deleteDoc(doc(db, "assignments", id));
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const filtered = assignments.filter(a => a.formLevel === activeForm);

  const inp = {
    display: "block", width: "100%", padding: "9px 12px",
    borderRadius: 8, border: "1px solid #ddd", fontSize: 14,
    marginBottom: 12, boxSizing: "border-box"
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Assignments</h1>

      {/* Add Assignment Form */}
      <div style={{ background: "#fff", border: "1px solid #e8e8e8",
        borderRadius: 12, padding: 24, marginBottom: 36 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Add Assignment</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Form Level</label>
            <select style={inp} value={form.formLevel}
              onChange={e => setForm({ ...form, formLevel: e.target.value })}>
              {FORMS.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Subject</label>
            <input style={inp} placeholder="e.g. Mathematics" value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })} />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>
              Display Name (shown to students)
            </label>
            <input style={inp} placeholder="e.g. Form 1 Maths Holiday Assignment"
              value={form.fileName}
              onChange={e => setForm({ ...form, fileName: e.target.value })} />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>
              Upload PDF 
            </label>
            <input
              type="file"
              accept=".pdf"
              ref={fileRef}
              onChange={handleFileUpload}
              style={{ fontSize: 14, marginBottom: 8, display: "block" }}
            />
            {uploading && (
              <p style={{ color: "#1a7c3e", fontSize: 13, fontWeight: 600 }}>
                ⏳ Uploading file...
              </p>
            )}
            {form.fileUrl && !uploading && (
              <p style={{ color: "#27ae60", fontSize: 13, fontWeight: 600 }}>
                ✓ File uploaded and ready
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={loading || uploading}
          style={{
            padding: "10px 28px", background: "#1a7c3e", color: "#fff",
            border: "none", borderRadius: 8, fontWeight: 700,
            cursor: loading || uploading ? "not-allowed" : "pointer",
            fontSize: 14, opacity: loading || uploading ? 0.7 : 1,
            marginTop: 8
          }}>
          {loading ? "Saving..." : "Add Assignment"}
        </button>
      </div>

      {/* View by form */}
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>All Assignments</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {FORMS.map(f => (
          <button key={f} onClick={() => setActiveForm(f)}
            style={{
              padding: "8px 20px", borderRadius: 8, border: "none",
              cursor: "pointer", fontWeight: 600, fontSize: 14,
              background: activeForm === f ? "#1a7c3e" : "#e8f5e9",
              color: activeForm === f ? "#fff" : "#1a7c3e"
            }}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: "#888" }}>No assignments for {activeForm} yet.</p>
      )}

      <div style={{ display: "grid", gap: 10 }}>
        {filtered.map(a => (
          <div key={a.id} style={{
            background: "#fff", border: "1px solid #e8e8e8",
            borderRadius: 10, padding: "14px 20px",
            display: "flex", justifyContent: "space-between",
            alignItems: "center", gap: 12
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>

              {/* PDF icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 8,
                background: "#fdecea", display: "flex",
                alignItems: "center", justifyContent: "center",
                flexShrink: 0
              }}>
                <span style={{ fontSize: 20 }}>📄</span>
              </div>

              <div>
                <strong style={{ fontSize: 15 }}>{a.subject}</strong>
                {a.fileName && (
  <p style={{ color: "#555", fontSize: 13, margin: "2px 0 0" }}>
    {a.fileName}
  </p>
)}

<a
  href={a.fileUrl}
  target="_blank"
  rel="noopener noreferrer"
  style={{ fontSize: 12, color: "#2471a3" }}
>
  View / Download file ↗
</a>
              </div>
            </div>

            <button onClick={() => handleDelete(a.id)}
              style={{
                padding: "6px 16px", background: "#c0392b", color: "#fff",
                border: "none", borderRadius: 6, cursor: "pointer",
                fontSize: 13, whiteSpace: "nowrap"
              }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
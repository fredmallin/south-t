import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const emptyProgram = { id: "", title: "", description: "", section: "program" };

export default function AdminOfferings() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyProgram);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    const snap = await getDocs(collection(db, "offerings"));
    setItems(snap.docs.map(d => ({ docId: d.id, ...d.data() })));
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    if (!form.title) return alert("Title is required");
    setLoading(true);
    try {
      if (editId) {
        await updateDoc(doc(db, "offerings", editId), form);
      } else {
        await addDoc(collection(db, "offerings"), form);
      }
      setForm(emptyProgram);
      setEditId(null);
      await fetchItems();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Delete?")) return;
    await deleteDoc(doc(db, "offerings", docId));
    setItems(prev => prev.filter(i => i.docId !== docId));
  };

  const inp = { display: "block", width: "100%", padding: "9px 12px",
    borderRadius: 8, border: "1px solid #ddd", fontSize: 14,
    marginBottom: 12, boxSizing: "border-box" };

  const programs = items.filter(i => i.section === "program");
  const whyChoose = items.filter(i => i.section === "why");

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Offerings</h1>

      <div style={{ background: "#fff", border: "1px solid #e8e8e8",
        borderRadius: 12, padding: 24, marginBottom: 36 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>
          {editId ? "Edit Item" : "Add Item"}
        </h2>

        <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Section</label>
        <select style={inp} value={form.section}
          onChange={e => setForm({ ...form, section: e.target.value })}>
          <option value="program">Program Card</option>
          <option value="why">Why Choose Us</option>
        </select>

        <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>
          {form.section === "program" ? "Number (e.g. 01)" : "Title"}
        </label>
        {form.section === "program" && (
          <input style={inp} placeholder="01" value={form.id}
            onChange={e => setForm({ ...form, id: e.target.value })} />
        )}

        <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Title</label>
        <input style={inp} placeholder="Title" value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })} />

        <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Description</label>
        <textarea rows={3} style={{ ...inp, resize: "vertical" }}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })} />

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={handleSave} disabled={loading}
            style={{ padding: "10px 28px", background: "#1a7c3e", color: "#fff",
              border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Saving..." : editId ? "Update" : "Add"}
          </button>
          {editId && (
            <button onClick={() => { setForm(emptyProgram); setEditId(null); }}
              style={{ padding: "10px 20px", background: "#eee", border: "none",
                borderRadius: 8, cursor: "pointer" }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {[["Programs", programs, "program"], ["Why Choose Us", whyChoose, "why"]].map(([title, list]) => (
        <div key={title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{title}</h2>
          {list.length === 0 && <p style={{ color: "#888" }}>None added yet.</p>}
          <div style={{ display: "grid", gap: 10 }}>
            {list.map(item => (
              <div key={item.docId} style={{ background: "#fff", border: "1px solid #e8e8e8",
                borderRadius: 10, padding: "14px 20px",
                display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  {item.id && <span style={{ fontWeight: 800, color: "#1a7c3e", marginRight: 8 }}>{item.id}</span>}
                  <strong>{item.title}</strong>
                  <p style={{ color: "#666", fontSize: 13, margin: "4px 0 0" }}>{item.description}</p>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => { setForm(item); setEditId(item.docId); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    style={{ padding: "6px 14px", background: "#2471a3", color: "#fff",
                      border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.docId)}
                    style={{ padding: "6px 14px", background: "#c0392b", color: "#fff",
                      border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
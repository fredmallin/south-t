import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [counts, setCounts] = useState({ events: 0, assignments: 0, gallery: 0, offerings: 0, management: 0 });

  useEffect(() => {
    const collections = ["events", "assignments", "gallery", "offerings", "management"];
    Promise.all(collections.map(c => getDocs(collection(db, c)))).then(results => {
      const [events, assignments, gallery, offerings, management] = results.map(r => r.size);
      setCounts({ events, assignments, gallery, offerings, management });
    });
  }, []);

  const cards = [
    { label: "Events",      count: counts.events,      link: "/admin/events",      color: "#1a7c3e" },
    { label: "Assignments", count: counts.assignments, link: "/admin/assignments", color: "#2471a3" },
    { label: "Gallery",     count: counts.gallery,     link: "/admin/gallery",     color: "#7d3c98" },
    { label: "Offerings",   count: counts.offerings,   link: "/admin/offerings",   color: "#d4800a" },
    { label: "Management",  count: counts.management,  link: "/admin/management",  color: "#c0392b" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: "#666", marginBottom: 32 }}>
        Welcome back! Manage all content on the South Tetu Girl's website from here.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        {cards.map(({ label, count, link, color }) => (
          <Link key={label} to={link} style={{ textDecoration: "none" }}>
            <div style={{
              background: "#fff", border: "1px solid #e8e8e8",
              borderRadius: 12, padding: "24px 20px",
              borderTop: `4px solid ${color}`, textAlign: "center",
              transition: "box-shadow 0.2s",
            }}>
              <p style={{ fontSize: 36, fontWeight: 800, color, margin: "0 0 6px" }}>{count}</p>
              <p style={{ fontSize: 15, color: "#444", margin: 0, fontWeight: 600 }}>{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 40, background: "#fff",
        border: "1px solid #e8e8e8", borderRadius: 12, padding: 24 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Add Event",      link: "/admin/events" },
            { label: "Upload Image",   link: "/admin/gallery" },
            { label: "Post Assignment",link: "/admin/assignments" },
            { label: "Add Offering",   link: "/admin/offerings" },
            { label: "Update Staff",   link: "/admin/management" },
          ].map(({ label, link }) => (
            <Link key={label} to={link}>
              <button style={{
                padding: "10px 20px", background: "#1a7c3e",
                color: "#fff", border: "none", borderRadius: 8,
                cursor: "pointer", fontWeight: 600, fontSize: 14
              }}>{label}</button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
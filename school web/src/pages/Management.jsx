import React, { useEffect, useState } from "react";
import "../App.css";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const DEFAULT_HERO = {
  heroImage:    "/images/south home.png",
  heroTitle:    "Our School Management",
  heroSubtitle: "Shaping Character, Nurturing Excellence",
};

const fallback = [
  {
    name: "[Insert BOM Chair's Name]",
    role: "The Board of Management (B.O.M.)",
    description: "Led by this dedicated team provides strategic direction and support. The board has remained the backbone of South Tetu Girl's, ensuring resources, policies, and structures are in place to nurture success.",
    imageUrl: "/images/principal south.png",
  },
  {
    name: "[Insert PTA Chair's Name]",
    role: "The Parent Teacher Association (P.T.A.)",
    description: "The PTA unites parents and teachers to collaborate in shaping the future of South Tetu Girl's. Together, they strengthen the school's academic and co-curricular programs.",
    imageUrl: "/images/principal south.png",
  },
  {
    name: "[Insert Principal's Name]",
    role: "The School Administration",
    description: "Led by the Principal, the administration forms the heart of South Tetu Girl's. Supported by the 'Pentagon' — Deputy Principals and Senior Masters ensuring discipline and academic excellence.",
    imageUrl: "/images/principal south.png",
  },
];

function SchoolManagement() {
  const [staff, setStaff] = useState([]);
  const [hero,  setHero]  = useState(DEFAULT_HERO);

  useEffect(() => {
    // Load staff
    getDocs(collection(db, "management"))
      .then(snap => {
        setStaff(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      })
      .catch(() => {});

    // Load hero settings
    getDoc(doc(db, "pages", "management"))
      .then(snap => {
        if (snap.exists()) setHero(prev => ({ ...prev, ...snap.data() }));
      })
      .catch(() => {});
  }, []);

  const displayStaff = staff.length > 0 ? staff : fallback;

  return (
    <div className="management-page">

      {/* Hero — background image driven by Firestore */}
      <section
        className="hero management-hero"
        style={{
          backgroundImage: `url("${hero.heroImage || DEFAULT_HERO.heroImage}")`,
        }}
      >
        <div className="hero-overlay">
          <h1>{hero.heroTitle    || DEFAULT_HERO.heroTitle}</h1>
          <p> {hero.heroSubtitle || DEFAULT_HERO.heroSubtitle}</p>
        </div>
      </section>

      <section className="management-section">
        <h2>School Management</h2>
        <p className="intro">
          South Tetu Girl's High School is guided by a strong leadership team that
          works tirelessly to ensure academic excellence, discipline, and holistic growth.
        </p>

        {displayStaff.map((s, i) => (
          <div className="management-card" key={s.id || i}>
            <img
              src={s.imageUrl || "/images/principal south.png"}
              alt={s.name}
              className="management-image"
            />
            <h3>{s.title} {s.name}</h3>
            <p><strong>{s.role}</strong></p>
            <p>{s.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default SchoolManagement;
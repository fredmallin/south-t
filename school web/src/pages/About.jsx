import React, { useState, useEffect } from "react";
import "../App.css";
import useScrollAnimation from "../hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const DEFAULT = {
  heroTitle:    "About South Tetu Girl's",
  heroSubtitle: "Empowering students to achieve excellence in academics and character.",
  visionTitle:  "Our Vision",
  visionP1:     "South Tetu Girl's High School is a distinguished educational facility situated in Nyeri county, Kenya. Since its inception, the school has been committed to delivering exceptional educational experiences that foster well-rounded development among students.",
  visionP2:     "Founded in 1962, South Tetu Girl's started with a mission to provide quality education tailored to the needs of young women. Its establishment was driven by the desire to empower students through education.",
  joinTitle:    "Get Involved",
  joinText:     "Discover how you can support the growth of our students and be part of their successful journey in education.",
};

const DEFAULT_SPORTS = [
  { name: "Football",    desc: "Competitive football team participating in regional leagues.", image: "/images/sports.jpeg" },
  { name: "Basketball",  desc: "Basketball training and inter-school competitions.",           image: "/images/sports.jpeg" },
  { name: "Athletics",   desc: "Track and field events including sprints and long jump.",     image: "/images/sports.jpeg" },
  { name: "St John's Ambulance", desc: "First aid and community service training.",           image: "/images/st john.jpeg" },
];

const DEFAULT_CLUBS = [
  { name: "St John's Ambulance", image: "/images/st johnladies.png" },
  { name: "Debate Club",         image: "/images/debate.jpg" },
];

const DEFAULT_DORMS = [
  { name: "Livingstone House", desc: "Named after Dr. David Livingstone",       image: "/images/dorms.png" },
  { name: "Aggrey House",      desc: "Named after Dr. Aggrey of Achimota",      image: "/images/dorms.png" },
  { name: "Wilberforce House", desc: "Named after Sir William Wilberforce",     image: "/images/dorms.png" },
];

const DEFAULT_VALUES = [
  { name: "Integrity",             image: "/images/integrity.png",            desc: "In South Tetu Girl's we instill integrity one child at a time." },
  { name: "Godliness",             image: "/images/Godliness.png",            desc: "We ensure that each child is equipped with religious values." },
  { name: "Teamwork",              image: "/images/teamwork.png",             desc: "With teamwork, all students are well equipped to work collaboratively." },
  { name: "Professionalism",       image: "/images/proffesion.png",           desc: "Professionalism is highly valued. We create responsible citizens." },
  { name: "Social Responsibility", image: "/images/social responsibilty.png", desc: "Every student is a responsible contributor to society." },
  { name: "Courtesy",              image: "/images/courtesy.png",             desc: "Courtesy ensures that students are responsible and polite." },
];

function About() {
  useScrollAnimation();
  const [activeTab, setActiveTab] = useState("sports");
  const [content,   setContent]   = useState(DEFAULT);
  const [sports,    setSports]    = useState(DEFAULT_SPORTS);
  const [clubs,     setClubs]     = useState(DEFAULT_CLUBS);
  const [dorms,     setDorms]     = useState(DEFAULT_DORMS);
  const [values,    setValues]    = useState(DEFAULT_VALUES);

  useEffect(() => {
    getDoc(doc(db, "pages", "about"))
      .then(snap => { if (snap.exists()) setContent(prev => ({ ...prev, ...snap.data() })); })
      .catch(() => {});

    const collections = [
      ["about_sports", setSports],
      ["about_clubs",  setClubs],
      ["about_dorms",  setDorms],
      ["about_values", setValues],
    ];
    collections.forEach(([name, setter]) => {
      getDocs(collection(db, name))
        .then(snap => { if (!snap.empty) setter(snap.docs.map(d => ({ id: d.id, ...d.data() }))); })
        .catch(() => {});
    });
  }, []);

  return (
    <div className="page-container">

      <section className="hero about-hero scroll-fade">
        <h1>{content.heroTitle}</h1>
        <p>{content.heroSubtitle}</p>
      </section>

      <section className="about-vision scroll-fade">
        <h1>{content.visionTitle}</h1>
        <p>{content.visionP1}</p>
        <p>{content.visionP2}</p>
      </section>

      <section className="about-tabs scroll-fade">
        <div className="tabs">
          <button className={activeTab === "sports" ? "tab active" : "tab"} onClick={() => setActiveTab("sports")}>Sports</button>
          <button className={activeTab === "clubs"  ? "tab active" : "tab"} onClick={() => setActiveTab("clubs")}>Clubs & Societies</button>
          <button className={activeTab === "dorms"  ? "tab active" : "tab"} onClick={() => setActiveTab("dorms")}>Dormitories</button>
        </div>

        <div className="tab-content">

          {/* ── SPORTS TAB ── */}
          {activeTab === "sports" && (
            <div>
              <h2>Sports</h2>
              <div className="grid">
                {sports.map((sport, i) => (
                  <div className="card" key={sport.id || i}>
                    <img src={sport.image} alt={sport.name} />
                    <p><strong>{sport.name}</strong></p>
                    {sport.desc && <p style={{ fontSize: "0.9rem", color: "#555" }}>{sport.desc}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CLUBS TAB ── */}
          {activeTab === "clubs" && (
            <div>
              <h2>Clubs & Societies</h2>
              <div className="grid">
                {clubs.map((club, i) => (
                  <div className="card" key={club.id || i}>
                    <img src={club.image} alt={club.name} />
                    <p>{club.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── DORMS TAB ── */}
          {activeTab === "dorms" && (
            <div>
              <h2>Dormitories</h2>
              <div className="grid">
                {dorms.map((dorm, i) => (
                  <div className="card" key={dorm.id || i}>
                    <img src={dorm.image} alt={dorm.name} />
                    <p>{dorm.name}: {dorm.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="about-values scroll-fade">
        <h2>Core Values</h2>
        <div className="values-grid">
          {values.map((v, i) => (
            <div className="value-card scroll-fade" key={v.id || i}>
              <img src={v.image} alt={v.name} className="value-icon" />
              <h3>{v.name}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="join-us scroll-fade">
        <h2>{content.joinTitle}</h2>
        <p>{content.joinText}</p>
        <Link to="/contact">Join Us</Link>
      </section>

    </div>
  );
}

export default About;
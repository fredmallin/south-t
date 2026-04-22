import React, { useEffect, useState } from "react";
import "../App.css";
import StatsCounter from "../StatsCounter";
import useScrollAnimation from "../hooks/useScrollAnimation";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const DEFAULT = {
  heroImages: [
    "/images/south%20home.png",
    "/images/st%20johnladies.png",
    "/images/SOUTH%20TEE.png",
  ],
  heroTitle: "South Tetu Girl's High School",
  heroSubtitle: "Empowering students to achieve excellence in academics and character.",
  heroButtonText: "View Assignments",

  principal_name: "Mr. Onesmas Mwangi",
  principal_title: "Senior Principal",
  principal_msg: "Welcome to South Tetu Girl's, where we empower young women to reach their full potential...",
  principal_img: "/images/principal south.png",

  bom_name: "Dr. Josephine Kinya",
  bom_title: "BOM Chairperson",
  bom_msg: "On behalf of the Board of Management, we are committed to your academic and personal growth...",
  bom_img: "/images/principal south.png",

  pta_name: "Mr. Isaac Nyabicha",
  pta_title: "P.A Chairperson",
  pta_msg: "As the chairman of the Parent Association, I am proud to address our school community...",
  pta_img: "/images/principal south.png",

  motto: "Discipline and character makes a man.",
  vision: "To be a leading institution in producing well-rounded individuals who excel academically, socially, and morally, contributing positively to society and the nation.",
  mission: "To provide quality education that nurtures academic excellence, discipline, and holistic development in a conducive environment, empowering students to become responsible and innovative leaders.",
  coreValues: "Integrity, Godliness, Teamwork, Professionalism, Social responsibility, Courtesy, Commitment.",

  stat_teachers: "50",
  stat_students: "1200",
  stat_classrooms: "20",
  stat_years: "60",

  joinTitle: "Join Us",
  joinText: "South Tetu Girl's empowers students with high-quality education, fostering academic excellence and confidence.",
};

const DEFAULT_OFFERINGS = [
  { img: "/images/Academics.jpeg", title: "Academics",                   desc: "Our rigorous curriculum is designed to challenge and inspire students..." },
  { img: "/images/arts.jpeg",      title: "Arts",                        desc: "Explore creativity through our vibrant arts program that encourages self-expression..." },
  { img: "/images/sports.jpeg",    title: "Extra-Curricular Activities", desc: "Our vibrant extra-curricular programs promote teamwork, sports, and clubs..." },
];

function Home() {
  useScrollAnimation();

  const [content,   setContent]   = useState(DEFAULT);
  const [offerings, setOfferings] = useState(DEFAULT_OFFERINGS);

  useEffect(() => {
    getDoc(doc(db, "pages", "home"))
      .then(snap => {
        if (snap.exists() && snap.data()) {
          setContent(prev => ({ ...prev, ...snap.data() }));
        }
      })
      .catch(() => {});

    getDocs(collection(db, "offerings"))
      .then(snap => {
        const programs = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(o => o.section === "program")
          .slice(0, 3);
        if (programs.length > 0) {
          setOfferings(programs.map(o => ({
            img:   o.image || "/images/Academics.jpeg",
            title: o.title,
            desc:  o.description,
          })));
        }
      })
      .catch(() => {});
  }, []);

  // filter(Boolean) removes any empty strings left by removed slides
  const heroImages = Array.isArray(content.heroImages) && content.heroImages.filter(Boolean).length > 0
    ? content.heroImages.filter(Boolean)
    : DEFAULT.heroImages;

  return (
    <div className="page-container">
      

      <Hero
        images={heroImages}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        buttonText={content.heroButtonText}
        buttonLink="/assignments"
        height="100svh"
      />

      <section className="messages scroll-fade">
        {[
          { name: content.principal_name, title: content.principal_title, msg: content.principal_msg, img: content.principal_img },
          { name: content.bom_name,       title: content.bom_title,       msg: content.bom_msg,       img: content.bom_img },
          { name: content.pta_name,       title: content.pta_title,       msg: content.pta_msg,       img: content.pta_img },
        ].map((person, i) => (
          <div className="message-card" key={i}>
            <img src={person.img} alt={person.name} className="message-img" />
            <h2>{person.name} - {person.title}</h2>
            <p>{person.msg}</p>
            <a href="/contact">Contact Us</a>
          </div>

          
        ))}
      </section>

      <section className="offerings scroll-fade">
        <h2>Our Offerings</h2>
        <div className="offering-cards">
          {offerings.map((o, i) => (
            <div className="offering-card" key={i}>
              <img src={o.img} alt={o.title} className="offering-img" />
              <h3>{o.title}</h3>
              <p>{o.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="values scroll-fade">
        <h2>Our Values</h2>
        <div className="value-cards">
          {[
            { img: "/images/motto.png",       title: "Motto",       text: content.motto },
            { img: "/images/vision.png",      title: "Vision",      text: content.vision },
            { img: "/images/mission.png",     title: "Mission",     text: content.mission },
            { img: "/images/core values.png", title: "Core Values", text: content.coreValues },
          ].map((v, i) => (
            <div className="value-card" key={i}>
              <img src={v.img} alt={v.title} />
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="stats scroll-fade">
        {[
          { img: "/images/teachers.png",   target: content.stat_teachers,   label: "Teachers" },
          { img: "/images/population.png", target: content.stat_students,   label: "Current population" },
          { img: "/images/classrooms.png", target: content.stat_classrooms, label: "Classrooms" },
          { img: "/images/years.png",      target: content.stat_years,      label: "Years" },
        ].map((s, i) => (
          <div className="stat" key={i}>
            <img src={s.img} alt={s.label} className="stat-icon" />
            <h3 className="count" data-target={s.target}>0</h3>
            <p>{s.label}</p>
          </div>
        ))}
      </section>

      <section className="join-us scroll-fade">
        <h2>{content.joinTitle}</h2>
        <p>{content.joinText}</p>
        <Link to="/contact">Get in Touch</Link>
      </section>

      <StatsCounter />
    </div>
  );
}

export default Home;
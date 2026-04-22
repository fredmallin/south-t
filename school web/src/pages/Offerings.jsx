import React, { useEffect, useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function Offerings() {
  const [programs, setPrograms] = useState([]);
  const [whyChoose, setWhyChoose] = useState([]);

  useEffect(() => {
    getDocs(collection(db, "offerings")).then(snap => {
      const all = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
      setPrograms(all.filter(o => o.section === "program"));
      setWhyChoose(all.filter(o => o.section === "why"));
    });
  }, []);

  const fallbackPrograms = [
    { id: "01", title: "Academic Excellence",
      description: "Our academic curriculum is designed to challenge and inspire students. With a focus on critical thinking, creativity, and problem-solving, we prepare students for higher education." },
    { id: "02", title: "Character Development",
      description: "We offer a robust extracurricular program that includes sports, arts, and leadership activities, allowing students to develop their talents and teamwork skills." },
    { id: "03", title: "Extra-Curricular Activities",
      description: "We emphasize holistic education, integrating values-based learning into our teaching. This approach nurtures intellectual capabilities, character and social responsibility." },
  ];

  const fallbackWhy = [
    { title: "Holistic Development",
      description: "We prioritize a balanced education that emphasizes academic success along with personal and social development, nurturing well-rounded individuals." },
    { title: "Dedicated Faculty",
      description: "Our experienced teachers are committed to providing personalized attention and support, ensuring that every student reaches their full potential." },
  ];

  const displayPrograms = programs.length > 0 ? programs : fallbackPrograms;
  const displayWhy = whyChoose.length > 0 ? whyChoose : fallbackWhy;

  return (
    <div className="page-container">
      <section className="offerings-section">
        <h1>Our Offerings</h1>
        <p>Explore our diverse range of educational programs that foster academic excellence and leadership.</p>
        <div className="program-cards">
          {displayPrograms.map((program, i) => (
            <div key={program.docId || i} className="program-card">
              <h2>{program.id}</h2>
              <h3>{program.title}</h3>
              <p>{program.description}</p>
              <button>Get Started</button>
            </div>
          ))}
        </div>
      </section>

      <section className="testimonial">
        <p>"South Tetu Girl's has transformed my child's confidence and academic skills, preparing them for a bright future."</p>
        <p>- Mary Johnson</p>
      </section>

      <section className="why-choose">
        <h2>Why Choose South Tetu Girl's?</h2>
        <div className="why-cards">
          {displayWhy.map((item, i) => (
            <div key={item.docId || i} className="why-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="join-us">
        <h2>Get Involved Today</h2>
        <p>Discover how you can support the growth of our students.</p>
        <Link to="/contact">Join Us</Link>
      </section>
    </div>
  );
}

export default Offerings;
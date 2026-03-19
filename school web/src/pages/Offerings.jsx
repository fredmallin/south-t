import React from "react";
import "../App.css"; 
import { Link } from "react-router-dom";

function Offerings() {
  const programs = [
    {
      id: "01",
      title: "Academic Excellence",
      description:
        "Our academic curriculum is designed to challenge and inspire students. With a focus on critical thinking, creativity, and problem-solving, we prepare students for higher education and future careers.",
    },
    {
      id: "02",
      title: "Character Development",
      description:
        "We offer a robust extracurricular program that includes sports, arts, and leadership activities, allowing students to develop their talents, teamwork skills, and personal interests outside the classroom.",
    },
    {
      id: "03",
      title: "Extra-Curricular Activities",
      description:
        "We emphasize holistic education, integrating values-based learning into our teaching. This approach nurtures not only intellectual capabilities but also character and social responsibility.",
    },
  ];

  const whyChoose = [
    {
      title: "Holistic Development",
      description:
        "We prioritize a balanced education that emphasizes academic success along with personal and social development, nurturing well-rounded individuals.",
    },
    {
      title: "Dedicated Faculty",
      description:
        "Our experienced teachers are committed to providing personalized attention and support, ensuring that every student reaches their full potential in a positive learning environment.",
    },
  ];

  return (
    <div className="page-container">
      <section className="offerings-section">
        <h1>Our Offerings</h1>
        <p>Explore our diverse range of educational programs that foster academic excellence and leadership.</p>

        <div className="program-cards">
          {programs.map((program) => (
            <div key={program.id} className="program-card">
              <h2>{program.id}</h2>
              <h3>{program.title}</h3>
              <p>{program.description}</p>
              <button>Get Started</button>
            </div>
          ))}
        </div>
      </section>

      <section className="testimonial">
        <p>
          "Giakanja Boys has transformed my child's confidence and academic skills, preparing them for a bright future. We couldn’t be happier with our choice!"
        </p>
        <p>- Mary Johnson</p>
      </section>

      <section className="why-choose">
        <h2>Why Choose Giakanja Boys?</h2>
        <div className="why-cards">
          {whyChoose.map((item, index) => (
            <div key={index} className="why-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="join-us">
  <h2>Get Involved Today</h2>
  <p>
    Discover how you can support the growth of our students and be part of
    their successful journey in education.
  </p>
  <Link to="/contact">Join Us</Link>
</section>
    </div>
  );
}

export default Offerings;

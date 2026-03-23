import React, { useState } from "react";
import "../App.css";
import useScrollAnimation from "../hooks/useScrollAnimation"; 
import { Link } from "react-router-dom";

function About() {
  useScrollAnimation(); 

  const [activeTab, setActiveTab] = useState("sports");

  return (
    <div className="page-container">
      <section className="hero about-hero scroll-fade">
        <h1>About South Tetu Girl's </h1>
        <p>
          Empowering students to achieve excellence in academics and character.
        </p>
      </section>

      <section className="about-vision scroll-fade">
        <h1>Our Vision</h1>
        <p>
          Giakanja Boys Secondary School is a distinguished educational facility
          situated in Nyeri county, Kenya. Since its inception, the school has
          been committed to delivering exceptional educational experiences that
          foster well-rounded development among students.
        </p>
        <p>
          Founded in 1962, Giakanja Boys started with a mission to provide
          quality education tailored to the needs of young men. Its establishment
          was driven by the desire to empower students through education. Over
          the years, we have proudly served a diverse student body, guiding and
          nurturing the talents of countless boys from different backgrounds in
          our community.
        </p>
      </section>

      <section className="about-tabs scroll-fade">
        <div className="tabs">
          <button
            className={activeTab === "sports" ? "tab active" : "tab"}
            onClick={() => setActiveTab("sports")}
          >
            Sports
          </button>
          <button
            className={activeTab === "clubs" ? "tab active" : "tab"}
            onClick={() => setActiveTab("clubs")}
          >
            Club & Societies
          </button>
         
          <button
            className={activeTab === "dorms" ? "tab active" : "tab"}
            onClick={() => setActiveTab("dorms")}
          >
            Dormitories
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "sports" && (
            <div>

    <div>
      <h2>Sports</h2>
      <p>The school offers Football, Basketball, Rugby, Athletics...</p>
      <img src="/images/sports.jpeg" alt="Sports" className="image" />
    </div>

    <div className="card">
      <img src="/images/st john.jpeg" alt="St John's Ambulance" />
      <p>St John's Ambulance</p>
    </div>

  </div>
            
          )}

          {activeTab === "clubs" && (
            <div>
              <h2>Clubs & Societies</h2>
              <div className="grid">
                <div className="card">
                  <img src="/images/st johnladies.png" alt="St john's Ambulance" />
                  <p>St john's Ambulance</p>
                </div>
                <div className="card">
                  <img src="/images/st johnladies.png" alt="St john's Ambulance" />
                  <p>St john's Ambulance</p>
                </div>
                <div className="card">
                  <img src="/images/st johnladies.png" alt="St john's Ambulance" />
                  <p>St john's Ambulance</p>
                </div>
                <div className="card">
                  <img src="/images/st johnladies.png" alt="St john's Ambulance" />
                  <p>St john's Ambulance</p>
                </div>
                <div className="card">
                  <img src="/images/st johnladies.png" alt="St john's Ambulance" />
                  <p>St john's Ambulance</p>
                </div>
                <div className="card">
                  <img src="/images/st johnladies.png" alt="St john's Ambulance" />
                  <p>St john's Ambulance</p>
                </div>
                <div className="card">
                  <img src="/images/st johnladies.png" alt="St john's Ambulance" />
                  <p>St john's Ambulance</p>
                </div>
                <div className="card">
                  <img src="/images/st johnladies.png" alt="St john's Ambulance" />
                  <p>St john's Ambulance</p>
                </div>
                <div className="card">
                  <img src="/images/debate.jpg" alt="Debate Club" />
                  <p>Debate Club: Sharpening critical thinking & speaking skills.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "dorms" && (
            <div>
              <h2>Dormitories</h2>
              <div className="grid">
                <div className="card">
                  <img src="/images/dorms.png" alt="Livingstone House" />
                  <p>Livingstone House: Named after Dr. David Livingstone</p>
                </div>
                <div className="card">
                  <img src="/images/dorms.png" alt="Aggrey House" />
                  <p>Aggrey House: Named after Dr. Aggrey of Achimota</p>
                </div>
                <div className="card">
                  <img src="/images/dorms.png" alt="Aggrey House" />
                  <p>Aggrey House: Named after Dr. Aggrey of Achimota</p>
                </div>
                <div className="card">
                  <img src="/images/dorms.png" alt="Aggrey House" />
                  <p>Aggrey House: Named after Dr. Aggrey of Achimota</p>
                </div>
                <div className="card">
                  <img src="/images/dorms.png" alt="Aggrey House" />
                  <p>Aggrey House: Named after Dr. Aggrey of Achimota</p>
                </div><div className="card">
                  <img src="/images/dorms.png" alt="Aggrey House" />
                  <p>Aggrey House: Named after Dr. Aggrey of Achimota</p>
                </div>
                <div className="card">
                  <img src="/images/dorms.png" alt="Aggrey House" />
                  <p>Aggrey House: Named after Dr. Aggrey of Achimota</p>
                </div>
                <div className="card">
                  <img src="/images/dorms.png" alt="Aggrey House" />
                  <p>Aggrey House: Named after Dr. Aggrey of Achimota</p>
                </div>
                <div className="card">
                  <img src="/images/dorms.png" alt="Aggrey House" />
                  <p>Aggrey House: Named after Dr. Aggrey of Achimota</p>
                </div>
                <div className="card">
                  <img src="/images/dorms.png" alt="Aggrey House" />
                  <p>Aggrey House: Named after Dr. Aggrey of Achimota</p>
                </div>
                <div className="card">
                  <img src="/images/dorms.png" alt="Wilberforce House" />
                  <p>Wilberforce House: Named after Sir William Wilberforce</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="about-values scroll-fade">
        <h2>Core Values</h2>
        <div className="values-grid">
          <div className="value-card scroll-fade">
            <img
              src="/images/integrity.png"
              alt="Integrity"
              className="value-icon"
            />
            <h3>Integrity</h3>
            <p>
              In Giakanja Boys we instill integrity one child at a time. Every
              student is equipped with values that drive integrity.
            </p>
          </div>

          <div className="value-card scroll-fade">
            <img
              src="/images/Godliness.png"
              alt="Godliness"
              className="value-icon"
            />
            <h3>Godliness</h3>
            <p>
              We ensure that each child is equipped with religious values, making
              them able to fit into any religious society.
            </p>
          </div>

          <div className="value-card scroll-fade">
            <img
              src="/images/teamwork.png"
              alt="Teamwork"
              className="value-icon"
            />
            <h3>Teamwork</h3>
            <p>
              With teamwork, all students are well equipped to work
              collaboratively, producing students who can succeed in
              organizations.
            </p>
          </div>

          <div className="value-card scroll-fade">
            <img
              src="/images/proffesion.png"
              alt="Professionalism"
              className="value-icon"
            />
            <h3>Professionalism</h3>
            <p>
              Professionalism is highly valued. We create responsible citizens
              who can work to improve society.
            </p>
          </div>

          <div className="value-card scroll-fade">
            <img
              src="/images/social responsibilty.png"
              alt="Social Responsibility"
              className="value-icon"
            />
            <h3>Social Responsibility</h3>
            <p>
              Every student is a responsible contributor to society with strong
              social skills.
            </p>
          </div>

          <div className="value-card scroll-fade">
            <img
              src="/images/courtesy.png"
              alt="Courtesy"
              className="value-icon"
            />
            <h3>Courtesy</h3>
            <p>
              Courtesy ensures that students are responsible, polite, and
              conscientious in everything they do.
            </p>
          </div>
        </div>
      </section>

      <section className="join-us scroll-fade">
  <h2>Get Involved</h2>
  <p>
    Discover how you can support the growth of our students and be part of
    their successful journey in education.
  </p>
  <Link to="/contact">Join Us</Link>
</section>

    </div>
  );
}

export default About;

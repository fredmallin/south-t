import React from "react";
import "../App.css";
import StatsCounter from "../StatsCounter";
import useScrollAnimation from "../hooks/useScrollAnimation";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";

function Home() {
  useScrollAnimation();

  return (
  <div className="page-container">
      {/* Hero Section */}
      <Hero
       images={[
  "/images/south%20home.png",
  "/images/st%20johnladies.png",
  "/images/SOUTH%20TEE.png",
]}
        title="South Tetu Girl's High School"
        subtitle="Empowering students to achieve excellence in academics and character."
        buttonText="View Assignments"
        buttonLink="/assignments"
        height="100svh"
      />

      {/* Messages Section */}
      <section className="messages scroll-fade">
        <div className="message-card">
          <img
            src="/images/principal south.png"
            alt="Mr. Onesmas Mwangi"
            className="message-img"
          />
          <h2>Mr. Onesmas Mwangi - Senior Principal</h2>
          <p>
            Welcome to South Tetu Girl's , where we empower young women to reach their
            full potential...
          </p>
          <a href="/contact">Contact Us</a>
        </div>

        <div className="message-card">
          <img
            src="/images/principal south.png"
            alt="Dr. Josephine Kinya"
            className="message-img"
          />
          <h2>Dr. Josephine Kinya - BOM Chairperson</h2>
          <p>
            On behalf of the Board of Management, we are committed to your
            academic and personal growth...
          </p>
          <a href="/contact">Contact Us</a>
        </div>

        <div className="message-card">
          <img
            src="/images/principal south.png"
            alt="Mr. Isaac Nyabicha"
            className="message-img"
          />
          <h2>Mr. Isaac Nyabicha - P.A Chairperson</h2>
          <p>
            As the chairman of the Parent Association, I am proud to address our
            school community...
          </p>
          <a href="/contact">Contact Us</a>
        </div>
      </section>

      {/* Offerings Section */}
      <section className="offerings scroll-fade">
        <h2>Our Offerings</h2>
        <div className="offering-cards">
          <div className="offering-card">
            <img
              src="/images/Academics.jpeg"
              alt="Academics"
              className="offering-img"
            />
            <h3>Academics</h3>
            <p>
              Our rigorous curriculum is designed to challenge and inspire
              students...
            </p>
          </div>
          <div className="offering-card">
            <img src="/images/arts.jpeg" alt="Arts" className="offering-img" />
            <h3>Arts</h3>
            <p>
              Explore creativity through our vibrant arts program that encourages
              self-expression...
            </p>
          </div>
          <div className="offering-card">
            <img
              src="/images/sports.jpeg"
              alt="Extra-Curricular Activities"
              className="offering-img"
            />
            <h3>Extra-Curricular Activities</h3>
            <p>
              Our vibrant extra-curricular programs promote teamwork, sports,
              and clubs...
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values scroll-fade">
        <h2>Our Values</h2>
        <div className="value-cards">
          <div className="value-card">
            <img src="/images/motto.png" alt="Motto" />
            <h3>Motto</h3>
            <p>Discipline and character makes a man.</p>
          </div>
          <div className="value-card">
            <img src="/images/vision.png" alt="Vision" />
            <h3>Vision</h3>
            <p>
              To be a leading institution in producing well-rounded individuals who excel academically, socially, and morally, contributing positively to society and the nation.
            </p>
          </div>
          <div className="value-card">
            <img src="/images/mission.png" alt="Mission" />
            <h3>Mission</h3>
            <p>
              To provide quality education that nurtures academic excellence, discipline, and holistic development in a conducive environment, empowering students to become responsible and innovative leaders.
            </p>
          </div>
          <div className="value-card">
            <img src="/images/core values.png" alt="Core Values" />
            <h3>Core Values</h3>
            <p>
              Integrity, Godliness, Teamwork, Professionalism, Social
              responsibility, Courtesy, Commitment.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats scroll-fade">
        <div className="stat">
          <img src="/images/teachers.png" alt="Teachers" className="stat-icon" />
          <h3 className="count" data-target="50">0</h3>
          <p>Teachers</p>
        </div>
        <div className="stat">
          <img src="/images/population.png" alt="Students" className="stat-icon" />
          <h3 className="count" data-target="1200">0</h3>
          <p>Current population</p>
        </div>
        <div className="stat">
          <img
            src="/images/classrooms.png"
            alt="Classrooms"
            className="stat-icon"
          />
          <h3 className="count" data-target="20">0</h3>
          <p>Classrooms</p>
        </div>
        <div className="stat">
          <img src="/images/years.png" alt="Years" className="stat-icon" />
          <h3 className="count" data-target="60">0</h3>
          <p>Years</p>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="join-us scroll-fade">
        <h2>Join Us</h2>
        <p>
          South Tetu Girl's empowers students with high-quality education, fostering
          academic excellence and confidence.
        </p>
        <Link to="/contact">Get in Touch</Link>
      </section>

      {/* Stats Counter Component */}
      <StatsCounter />
    </div>
  );
}

export default Home;
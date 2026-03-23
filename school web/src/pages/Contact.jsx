import React, { useState } from "react";
import "../App.css"; // Your CSS file

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://formspree.io/f/mzzawbrd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      alert("Error sending message: " + error.message);
    }
  };

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-overlay">
          <h1> South Tetu Girl's High School</h1>
          <p>We’re here to answer your questions and help you get in touch with us</p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="contact-section">
        <div className="contact-info">
          <p>Email: <a href="mailto:admin@southtetugirls.ac.ke">admin@southtetugirls.ac.ke</a></p>
          <p>Phone: <a href="tel:0201234567">020-1234567</a></p>
          <p>Address: Nyeri-Othaya Road, Nyeri County, Kenya</p>
        </div>

        <div className="contact-form">
          {submitted && <p className="success-msg">Message sent successfully!</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"                  
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>

         <div className="map-container" style={{ width: "100%", height: "450px" }}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.6235077071833!2d37.071330073526056!3d-0.5662019994282484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18288f941edcec01%3A0x6c7895a56137087b!2sSouth%20tet%C5%A9%20girls%20high%20school!5e0!3m2!1sen!2ske!4v1773949784877!5m2!1sen!2ske"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
      </section>
    </div>
  );
}

export default Contact;

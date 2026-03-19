import React, { useState } from "react";
import "../App.css";

// Images inside public/images
const galleryImages = [
  "/images/schoolgate3.jpg",
  "/images/join us.jpeg",
  "/images/sports.jpeg",
  "/images/pics.jpeg",
  "/images/pic2.jpeg",
  "/images/pic3.jpeg",
];

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
   <div className="gallery-page">
      {/* Hero Section */}
      <section className="hero gallery-hero">
        <div className="hero-overlay">
          <h1>Our School Gallery</h1>
          <p>Capturing memories of learning, sports, and community at Giakanja Boys.</p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery">
        <h1>School Gallery</h1>
        <p>
          Explore moments from our school life, classrooms, events, and student
          activities.
        </p>

        <div className="gallery-grid">
          {galleryImages.map((img, index) => (
            <div key={index} className="gallery-item">
              <img
                src={img}
                alt={`Gallery ${index + 1}`}
                onClick={() => setSelectedImage(img)}
              />
            </div>
          ))}
        </div>

        {/* Lightbox Overlay */}
        {selectedImage && (
          <div className="lightbox" onClick={() => setSelectedImage(null)}>
            <span className="close">&times;</span>
            <img src={selectedImage} alt="Selected" className="lightbox-img" />
          </div>
        )}
      </section>
    </div>
  );
}

export default Gallery;


import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../App.css";

const DEFAULT_HERO = {
  heroImage:    "/images/south home.png",
  heroTitle:    "Our School Gallery",
  heroSubtitle: "Capturing memories of learning, sports, and community at South Tetu Girl's.",
};

function Gallery() {
  const [images,        setImages]        = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hero,          setHero]          = useState(DEFAULT_HERO);

  useEffect(() => {
    // Load gallery images
    getDocs(collection(db, "gallery"))
      .then(snap => {
        setImages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      })
      .catch(() => {});

    // Load hero settings
    getDoc(doc(db, "pages", "gallery"))
      .then(snap => {
        if (snap.exists()) setHero(prev => ({ ...prev, ...snap.data() }));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="gallery-page">

      {/* Hero — background driven by Firestore */}
      <section
        className="hero gallery-hero"
        style={{
          backgroundImage: `url("${hero.heroImage || DEFAULT_HERO.heroImage}")`,
        }}
      >
        <div className="hero-overlay">
          <h1>{hero.heroTitle    || DEFAULT_HERO.heroTitle}</h1>
          <p> {hero.heroSubtitle || DEFAULT_HERO.heroSubtitle}</p>
        </div>
      </section>

      <section className="gallery">
        <h1>School Gallery</h1>
        <p>Explore moments from our school life, classrooms, events, and student activities.</p>

        <div className="gallery-grid">
          {images.map(img => (
            <div key={img.id} className="gallery-item">
              <img
                src={img.url}
                alt="Gallery"
                onClick={() => setSelectedImage(img.url)}
              />
            </div>
          ))}
        </div>

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
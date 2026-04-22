import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../App.css";

// ✅ No local fallback image — use null so hero is invisible until loaded
const DEFAULT_HERO = {
  heroImage:    null,
  heroTitle:    "Our School Gallery",
  heroSubtitle: "Capturing memories of learning, sports, and community at South Tetu Girl's.",
};

function GalleryItem({ img, onClick }) {
  const [loaded, setLoaded] = useState(false);

  // ✅ Skip items with non-Cloudinary URLs entirely
  if (!img.url?.startsWith("https://res.cloudinary.com")) return null;

  return (
    <div className="gallery-item">
      {!loaded && <div className="gallery-skeleton" />}
      <img
        src={img.url}
        alt="Gallery"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}
        onLoad={() => setLoaded(true)}
        onClick={() => onClick(img.url)}
      />
    </div>
  );
}

function Gallery() {
  const [images,        setImages]        = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hero,          setHero]          = useState(DEFAULT_HERO);
  const [heroReady,     setHeroReady]     = useState(false); // ✅ track hero image load

  useEffect(() => {
    getDocs(collection(db, "gallery"))
      .then(snap => {
        setImages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      })
      .catch(() => {});

    getDoc(doc(db, "pages", "gallery"))
      .then(snap => {
        if (snap.exists()) setHero(prev => ({ ...prev, ...snap.data() }));
      })
      .catch(() => {});
  }, []);

  // ✅ Preload hero image before showing it
  useEffect(() => {
    if (!hero.heroImage) return;
    const img = new Image();
    img.onload = () => setHeroReady(true);
    img.src = hero.heroImage;
  }, [hero.heroImage]);

  return (
    <div className="gallery-page">

      {/* Hero — only shows background once image is preloaded */}
      <section
        className="hero gallery-hero"
        style={{
          backgroundImage: heroReady ? `url("${hero.heroImage}")` : "none",
          transition: "background-image 0.3s ease",
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
            <GalleryItem key={img.id} img={img} onClick={setSelectedImage} />
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
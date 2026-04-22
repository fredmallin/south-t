import React, { useEffect, useState } from "react";
import "../App.css";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const DEFAULT_HERO = {
  heroImage:    "/images/south home.png",
  heroTitle:    "School Events",
  heroSubtitle: "Stay up to date with all our upcoming and past events.",
};

const fallbackUpcoming = [
 
];

const fallbackPast = [
  
];

function Events() {
  const [upcoming, setUpcoming] = useState([]);
  const [past,     setPast]     = useState([]);
  const [hero,     setHero]     = useState(DEFAULT_HERO);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    // Load events
    getDocs(collection(db, "events"))
      .then(snap => {
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setUpcoming(all.filter(e => e.type === "upcoming"));
        setPast(all.filter(e => e.type === "past"));
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Load hero settings
    getDoc(doc(db, "pages", "events"))
      .then(snap => {
        if (snap.exists()) setHero(prev => ({ ...prev, ...snap.data() }));
      })
      .catch(() => {});
  }, []);

  const renderEvents = (events, sectionTitle) => (
    <section className="events-section">
      <h2>{sectionTitle}</h2>
      <div className="events-list">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-image">
              <img src={event.image} alt={event.title} />
            </div>
            <div className="event-date">
              <span className="month">{event.month}</span>
              <span className="day">{event.day}</span>
              <span className="year">{event.year}</span>
            </div>
            <div className="event-content">
              <span className="event-category">{event.category}</span>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p className="event-meta">{event.time}<br />{event.location}</p>
              <div className="event-actions">
                <button className="btn">Learn More</button>
                <button className="btn-outline">Add to Calendar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  // While loading, show hero with default content so there's no blank flash
  if (loading) return (
    <div className="events-page">
      <div
        className="events-hero"
        style={{ backgroundImage: `url("${DEFAULT_HERO.heroImage}")` }}
      >
        <div className="hero-content">
          <h1>{DEFAULT_HERO.heroTitle}</h1>
          <p>{DEFAULT_HERO.heroSubtitle}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="events-page">

      {/* Hero — background image comes from Firestore, falls back to default */}
      <div
        className="events-hero"
        style={{
          backgroundImage: `url("${hero.heroImage || DEFAULT_HERO.heroImage}")`,
        }}
      >
        <div className="hero-content">
          <h1>{hero.heroTitle    || DEFAULT_HERO.heroTitle}</h1>
          <p> {hero.heroSubtitle || DEFAULT_HERO.heroSubtitle}</p>
        </div>
      </div>

      {renderEvents(upcoming.length > 0 ? upcoming : fallbackUpcoming, "Upcoming Events")}
      {renderEvents(past.length     > 0 ? past     : fallbackPast,     "Past Events")}

    </div>
  );
}

export default Events;
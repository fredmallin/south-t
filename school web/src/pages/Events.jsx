import React, { useEffect, useState } from "react";
import "../App.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function Events() {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "events")).then(snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setUpcoming(all.filter(e => e.type === "upcoming"));
      setPast(all.filter(e => e.type === "past"));
      setLoading(false);
    });
  }, []);

  // Fallback original data if Firestore is empty
  const fallbackUpcoming = [
    { id: 1, month: "FEB", day: "15", year: "2025", title: "Science Fair Exhibition", category: "ACADEMIC",
      description: "South Tetu Girl's is an institution that has stood as a beacon of hope...",
      time: "09:00 AM – 03:00 PM", location: "Main Auditorium", image: "/images/SOUTH BUS.jpeg" },
    { id: 2, month: "MAR", day: "10", year: "2025", title: "Annual Sports Day", category: "SPORTS",
      description: "South Tetu Girl's is an institution that has stood as a beacon of hope...",
      time: "08:30 AM – 05:00 PM", location: "School Playground", image: "/images/SOUTH BUS.jpeg" },
  ];
  const fallbackPast = [
    { id: 1, month: "DEC", day: "05", year: "2024", title: "Art Exhibition", category: "ARTS",
      description: "Students displayed their artwork and creative projects.",
      time: "10:00 AM – 04:00 PM", location: "Art Gallery", image: "/images/SOUTH BUS.jpeg" },
    { id: 2, month: "NOV", day: "20", year: "2024", title: "Music Concert", category: "COMMUNITY",
      description: "A lively performance showcasing the school choir and band.",
      time: "02:00 PM – 06:00 PM", location: "Auditorium", image: "/images/SOUTH BUS.jpeg" },
  ];

  const renderEvents = (events, sectionTitle) => (
    <section className="events-section">
      <h2>{sectionTitle}</h2>
      <div className="events-list">
        {events.map((event) => (
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

  if (loading) return (
    <div className="events-page">
      <div className="events-hero"><div className="hero-content"><h1>School Events</h1></div></div>
    </div>
  );

  return (
    <div className="events-page">
      <div className="events-hero">
        <div className="hero-content">
          <h1>School Events</h1>
          <p>Stay up to date with all our upcoming and past events.</p>
        </div>
      </div>
      {renderEvents(upcoming.length > 0 ? upcoming : fallbackUpcoming, "Upcoming Events")}
      {renderEvents(past.length > 0 ? past : fallbackPast, "Past Events")}
    </div>
  );
}

export default Events;
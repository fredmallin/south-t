import React from "react";
import "../App.css";

function Events() {
  const upcomingEvents = [
    {
      id: 1,
      month: "FEB",
      day: "15",
      year: "2025",
      title: "Science Fair Exhibition",
      category: "ACADEMIC",
      description:
        "Giakanja boys' is an institution that has stood as a beacon of hope, discipline, and academic excellence for generations.",
      time: "09:00 AM – 03:00 PM",
      location: "Main Auditorium",
      image: "/images/sciencefair.jpeg",
    },
    {
      id: 2,
      month: "MAR",
      day: "10",
      year: "2025",
      title: "Annual Sports Day",
      category: "SPORTS",
      description:
        "Giakanja boys' is an institution that has stood as a beacon of hope, discipline, and academic excellence for generations.",
      time: "08:30 AM – 05:00 PM",
      location: "School Playground",
      image: "/images/sports runners.jpeg",
    },
  ];

  const pastEvents = [
    {
      id: 1,
      month: "DEC",
      day: "05",
      year: "2024",
      title: "Art Exhibition",
      category: "ARTS",
      description:
        "Students displayed their artwork and creative projects.",
      time: "10:00 AM – 04:00 PM",
      location: "Art Gallery",
      image: "/images/ATRS.jpeg",
    },
    {
      id: 2,
      month: "NOV",
      day: "20",
      year: "2024",
      title: "Music Concert",
      category: "COMMUNITY",
      description:
        "A lively performance showcasing the school choir and band.",
      time: "02:00 PM – 06:00 PM",
      location: "Auditorium",
      image: "/images/Music.jpeg",
    },
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
              <p className="event-meta">
                 {event.time} <br />
                 {event.location}
              </p>
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

  return (
    <div className="events-page">
      <div className="events-hero">
  <div className="hero-content">
    <h1>School Events</h1>
    <p>
      Stay up to date with all our upcoming and past events.
      Join us as we celebrate, compete, and showcase our talents!
    </p>
  </div>
</div>

      {/* Upcoming and Past Events */}
      {renderEvents(upcomingEvents, "Upcoming Events")}
      {renderEvents(pastEvents, "Past Events")}
    </div>
  );
}

export default Events;

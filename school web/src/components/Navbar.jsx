import { Link } from "react-router-dom";
import { useState } from "react";
import "../App.css"; 

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Left: Logo + School Name */}
      <div className="navbar-brand">
        <img
          src="/images/schoollogo.jpeg"
          alt="School Logo"
          className="school-logo"
        />
        <span className="school-name">South Tetu Girl's High School</span>
      </div>

      {/* Hamburger menu button (mobile only) */}
      <button
  className="menu-btn"
  onClick={() => setIsOpen(!isOpen)}
  aria-label="Toggle menu"
>
  {isOpen ? "✖" : "☰"}
</button>

      {/* Right: Links */}
      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
        <li><Link to="/about" onClick={() => setIsOpen(false)}>About</Link></li> 
        <li><Link to="/assignments" onClick={() => setIsOpen(false)}>Assignments</Link></li>
<li><Link to="/management" onClick={() => setIsOpen(false)}>Management</Link></li>
<li><Link to="/gallery" onClick={() => setIsOpen(false)}>Gallery</Link></li>
        <li><Link to="/events" onClick={() => setIsOpen(false)}>Events</Link></li>
        <li><Link to="/offerings" onClick={() => setIsOpen(false)}>Offerings</Link></li>
        <li><Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;

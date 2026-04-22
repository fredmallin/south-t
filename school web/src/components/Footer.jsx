import { Link } from "react-router-dom";
import { 
  FaPhoneAlt, 
  FaWhatsapp, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram 
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        {/* Contact Section */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p><FaPhoneAlt /> <a href="tel:+254791775974">+254 791 775 974</a></p>
          <p>
            <a href="https://wa.me/254748257989" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp style={{color: "#25D366"}} /> WhatsApp
            </a>
          </p>
          <p><FaEnvelope /> South Tetu Girls High School</p>
          <p><FaMapMarkerAlt /> Mukurwe-ini Murang'a road, Nyeri County</p>
          <p><FaClock /> Mon - Fri | 8:00 AM - 6:00 PM</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/assignments">Assignments</Link></li>
            <li><Link to="/management">Management</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/offerings">Offerings</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar — © is the hidden admin link */}
      <div className="footer-bottom">
        <p>
          <Link
            to="/admin/login"
            style={{ color: "inherit", textDecoration: "none", cursor: "default" }}
          >
            ©
          </Link>
          {" "}2026 South Tetu Girls High School. All rights reserved.
        </p>
        <p>
          Developed by{" "}
          <a
            href="https://wa.me/254748257989"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>Fredrick Mwangi</strong>
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import {
  Home, BarChart2, Calendar, Edit2, Image, BookOpen, Users,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Track window resi
  useState(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const links = [
    { to: "/admin/dashboard",   label: "Dashboard",   icon: BarChart2 },
    { to: "/admin/home",        label: "Home Page",   icon: Home },
    { to: "/admin/events",      label: "Events",      icon: Calendar },
    { to: "/admin/assignments", label: "Assignments", icon: Edit2 },
    { to: "/admin/gallery",     label: "Gallery",     icon: Image },
    { to: "/admin/offerings",   label: "Offerings",   icon: BookOpen },
    { to: "/admin/management",  label: "Management",  icon: Users },
    { to: "/admin/about",       label: "About Page",  icon: Home },
    { to: "/admin/change-password", label: "Change Password", icon: Edit2 },
  ];

  const navStyle = {
    background: "#793f12",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  };

  const linkStyle = ({ isActive }) => ({
    color: isActive ? "#fff" : "rgba(255,255,255,0.75)",
    fontWeight: isActive ? 700 : 400,
    textDecoration: "none",
    fontSize: 14,
    padding: "18px 12px",
    display: "flex",
    alignItems: "center",
    gap: 6,
    borderBottom: isActive ? "3px solid #fff" : "3px solid transparent",
  });

  return (
    <div>
      <nav style={navStyle}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}>
          <img
            src="/images/south logo.jpeg"
            alt="Logo"
            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
          />
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Admin Panel</span>
        </div>

        {/* Mobile toggle — only visible on small screens */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none", border: "none", color: "#fff",
              fontSize: 22, cursor: "pointer", padding: "10px 0",
            }}
          >
            {menuOpen ? "✖" : "☰"}
          </button>
        )}

        {/* Nav links — always visible on desktop, toggled on mobile */}
        {(!isMobile || menuOpen) && (
          <div
            style={{
              display: "flex",
              alignItems: isMobile ? "flex-start" : "center",
              flexDirection: isMobile ? "column" : "row",
              flexWrap: "wrap",
              gap: 4,
              width: isMobile ? "100%" : "auto",
              paddingBottom: isMobile ? 12 : 0,
            }}
          >
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                style={linkStyle}
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}

            <button
              onClick={handleLogout}
              style={{
                marginLeft: isMobile ? 0 : 12,
                marginTop: isMobile ? 8 : 0,
                padding: "7px 18px",
                background: "#f71c04",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      <div style={{ padding: "32px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <Outlet />
      </div>
    </div>
  );
}
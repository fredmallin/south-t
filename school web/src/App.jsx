import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

// Public pages 
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Assignments from "./pages/Assignments";
import Events from "./pages/Events";
import Offerings from "./pages/Offerings";
import Management from "./pages/Management";
import Contact from "./pages/Contact";

// Admin 
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import ProtectedRoute from "./admin/ProtectedRoute";
import Dashboard from "./admin/Dashboard";
import AdminEvents from "./admin/AdminEvents";
import AdminAssignments from "./admin/AdminAssignments";
import AdminGallery from "./admin/AdminGallery";
import AdminOfferings from "./admin/AdminOfferings";
import AdminManagement from "./admin/AdminManagement";
import AdminHome from "./admin/AdminHome";
import AdminAbout from "./admin/AdminAbout";
import AdminChangePassword from "./admin/AdminChangePassword";

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const hasHero = ["/", "/gallery", "/management", "/events", "/about"].includes(location.pathname);

  return (
    <div className="app-container">
      {!isAdmin && <Navbar />}
      <main className={`main-content ${hasHero && !isAdmin ? "home" : ""}`}>
        <Routes>
          {/* Your existing public pages — nothing changes here */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/events" element={<Events />} />
          <Route path="/offerings" element={<Offerings />} />
          <Route path="/management" element={<Management />} />
          <Route path="/contact" element={<Contact />} />
          

          {/* Admin login — hidden, no navbar/footer */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin panel — protected */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route path="dashboard"   element={<Dashboard />} />
            <Route path="home"        element={<AdminHome />} />
            <Route path="events"      element={<AdminEvents />} />
            <Route path="assignments" element={<AdminAssignments />} />
            <Route path="gallery"     element={<AdminGallery />} />
            <Route path="offerings"   element={<AdminOfferings />} />
            <Route path="management"  element={<AdminManagement />} />
            <Route path="about"       element={<AdminAbout />} />
            <Route path="change-password" element={<AdminChangePassword />} />

          </Route>
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

export default App;
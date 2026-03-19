import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Assignments from "./pages/Assignments";
import Events from "./pages/Events";
import Offerings from "./pages/Offerings";
import Management from "./pages/Management";
import Contact from "./pages/Contact";

function App() {
  const location = useLocation();
  const hasHero = ["/", "/gallery", "/management", "/events", "/about"].includes(location.pathname);

  return (
    <div className="app-container">
      <Navbar />
    <main className={`main-content ${hasHero ? "home" : ""}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/events" element={<Events />} />
          <Route path="/offerings" element={<Offerings />} />
          <Route path="/management" element={<Management />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

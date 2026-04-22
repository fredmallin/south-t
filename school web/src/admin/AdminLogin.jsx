import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "#f4f6f8"
    }}>
      <div style={{
        background: "#fff", padding: "40px 36px",
        borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        width: "100%", maxWidth: 400
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img src="/images/south logo.jpeg" alt="Logo"
            style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", marginBottom: 12 }} />
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Admin Login</h2>
          <p style={{ margin: "6px 0 0", color: "#666", fontSize: 14 }}>
            South Tetu Girl's High School
          </p>
        </div>

        {error && (
          <p style={{ color: "#c0392b", background: "#fdecea",
            padding: "10px 14px", borderRadius: 8, fontSize: 14, marginBottom: 16 }}>
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Email</label>
          <input
            type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@southtetugirls.ac.ke"
            required
            style={{ display: "block", width: "100%", padding: "10px 12px",
              margin: "6px 0 16px", borderRadius: 8,
              border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box" }}
          />
          <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Password</label>
          <input
            type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{ display: "block", width: "100%", padding: "10px 12px",
              margin: "6px 0 24px", borderRadius: 8,
              border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box" }}
          />
          <button
            type="submit" disabled={loading}
            style={{ width: "100%", padding: "12px", background: "#af8417",
              color: "#fdfdfd", border: "none", borderRadius: 8,
              fontSize: 15, fontWeight: 700, cursor: "pointer" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
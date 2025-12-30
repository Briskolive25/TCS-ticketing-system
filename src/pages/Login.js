import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  "https://script.google.com/macros/s/AKfycbwRsnyvSnbmwB6MdHqjmQsKpFtoFPZ5nqtDAkrKkmmRWZ07gSWkgy4Jj85grIeMnRwz/exec";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const url = `${API_URL}?action=login&email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`;

      const res = await fetch(url);
      const result = await res.json();

      if (result.status === "success") {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("userRole", result.user.role);
        localStorage.setItem("Name", result.user.name);

        navigate("/admin-dashboard");
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={brand}>TCS Ticketing</h1>
        <p style={subtitle}>Support & Issue Management Portal</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button style={loginBtn} onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const page = {
  height: "100vh",
  background: "linear-gradient(135deg, #1a5cff, #243447)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const card = {
  width: 380,
  background: "#fff",
  padding: "35px 30px",
  borderRadius: 14,
  textAlign: "center",
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
};

const brand = {
  marginBottom: 5,
  color: "#1a5cff",
  fontWeight: 700,
};

const subtitle = {
  marginBottom: 25,
  fontSize: 14,
  color: "#666",
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 15,
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 14,
};

const loginBtn = {
  width: "100%",
  padding: 13,
  borderRadius: 8,
  border: "none",
  background: "#1a5cff",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

export default Login;

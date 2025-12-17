import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div style={page}>
      <div style={card}>
        {/* BRAND */}
        <h1 style={brand}>TCS Ticketing</h1>
        <p style={subtitle}>Support & Issue Management Portal</p>

        {!role ? (
          <>
            <h3 style={sectionTitle}>Select Login Type</h3>

            <button style={roleBtn} onClick={() => setRole("TCS")}>
              TCS User
            </button>

            <button style={roleBtn} onClick={() => setRole("Brisk Olive")}>
              Brisk Olive User
            </button>

            <button style={roleBtn} onClick={() => setRole("Admin")}>
              Admin (Brisk Olive)
            </button>
          </>
        ) : (
          <>
            <h3 style={sectionTitle}>{role} Login</h3>

            <input
              type="email"
              placeholder="Official Email"
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

            <button style={loginBtn} onClick={handleLogin}>
              Login
            </button>

            <button style={backBtn} onClick={() => setRole("")}>
              ← Change Login Type
            </button>
          </>
        )}
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

const sectionTitle = {
  marginBottom: 20,
  color: "#333",
};

const roleBtn = {
  width: "100%",
  padding: 14,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  background: "#f9fafb",
  fontWeight: 600,
  cursor: "pointer",
  transition: "0.2s",
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
  marginBottom: 12,
};

const backBtn = {
  border: "none",
  background: "transparent",
  color: "#1a5cff",
  cursor: "pointer",
  fontSize: 13,
};

export default Login; 

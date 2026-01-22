import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import LoginPage from "./pages/Login";
import ManpowerLogin from "./pages/ManpowerLogin"; // ✅ ADD
import Operations from "./pages/Operations";
import AdminDashboard from "./pages/AdminDashboard";
import Support from "./pages/Support";
import Landing from "./pages/Landing";

import TopNavbar from "./components/TopNavbar";
import Sidebar from "./components/Sidebar";

function App() {
  const role = localStorage.getItem("userRole");
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const isManpowerLogin = location.pathname === "/manpower-login"; // ✅ ADD
  const isSupportPage = location.pathname === "/support";
  const isLanding = location.pathname === "/landing";

  const navbarHeight = 64;

  return (
    <div className="flex">
      {/* SIDEBAR */}
      {!isLoginPage &&
        !isManpowerLogin &&
        !isSupportPage &&
        !isLanding && <Sidebar />}

      <div className="flex-1">
        {/* TOP NAVBAR */}
        {!isLoginPage && !isManpowerLogin && !isLanding && (
          <TopNavbar />
        )}

        {/* MAIN CONTENT */}
        <div
          className="bg-gray-50 min-h-screen"
          style={{
            paddingTop:
              isLoginPage || isManpowerLogin || isLanding
                ? 0
                : navbarHeight,
          }}
        >
          <Routes>
            {/* ================= PUBLIC PAGES ================= */}
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/manpower-login"
              element={<ManpowerLogin />}
            />
            <Route path="/support" element={<Support />} />
            <Route path="/landing" element={<Landing />} />

            {/* ================= OPERATIONS ================= */}
            <Route
              path="/operations"
              element={
                role ? <Operations /> : <Navigate to="/login" />
              }
            />

            {/* ================= ADMIN ================= */}
            <Route
              path="/admin-dashboard"
              element={
                role === "Admin" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/operations" />
                )
              }
            />

            {/* ================= DEFAULT ================= */}
            <Route
              path="*"
              element={
                role ? (
                  <Navigate
                    to={
                      role === "Admin"
                        ? "/admin-dashboard"
                        : "/operations"
                    }
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;

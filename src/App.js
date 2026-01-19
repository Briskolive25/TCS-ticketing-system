import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import LoginPage from "./pages/Login";
import Operations from "./pages/Operations";
import AdminDashboard from "./pages/AdminDashboard";
import Support from "./pages/Support";

import TopNavbar from "./components/TopNavbar";
import Sidebar from "./components/Sidebar";

function App() {
  const role = localStorage.getItem("userRole");
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const navbarHeight = 64;

  return (
    <div className="flex">
      {/* SIDEBAR */}
      {!isLoginPage && location.pathname !== "/support" && <Sidebar />}

      <div className="flex-1">
        {/* TOP NAVBAR */}
        {!isLoginPage && <TopNavbar />}

        {/* MAIN CONTENT */}
        <div
          className="bg-gray-50 min-h-screen p-6"
          style={{ paddingTop: isLoginPage ? 0 : navbarHeight }}
        >
          <Routes>
            {/* LOGIN */}
            <Route path="/login" element={<LoginPage />} />

            {/* OPERATIONS (Executive + TCS view-only) */}
            <Route
              path="/operations"
              element={
                role ? <Operations /> : <Navigate to="/login" />
              }
            />

            {/* SUPPORT (ONLY TCS via button) */}
            <Route
              path="/support"
              element={
                role === "TCS" ? <Support /> : <Navigate to="/operations" />
              }
            />

            {/* ADMIN */}
            <Route
              path="/admin-dashboard"
              element={
                role === "Admin"
                  ? <AdminDashboard />
                  : <Navigate to="/operations" />
              }
            />

            {/* DEFAULT REDIRECT */}
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

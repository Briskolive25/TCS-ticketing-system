import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import LoginPage from "./pages/Login";
import ManpowerLogin from "./pages/ManpowerLogin";
import Operations from "./pages/Operations";
import AdminDashboard from "./pages/AdminDashboard";
import Support from "./pages/Support";
import Landing from "./pages/Landing";
import ProcessDashboard from "./pages/ProcessDashboard";
import Scoring from "./pages/Scoring";
import AddKPI from "./pages/AddKPI";
import AddTargets from "./pages/AddTargets";

import TopNavbar from "./components/TopNavbar";
import Sidebar from "./components/Sidebar";

function App() {
  const role = localStorage.getItem("userRole");
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const isManpowerLogin = location.pathname === "/manpower-login";
  const isSupportPage = location.pathname === "/support";
  const isLanding = location.pathname === "/landing";

  const navbarHeight = 64;

  return (
    <div className="flex">
      {/* GLOBAL SIDEBAR (NOT FOR LANDING) */}
      {!isLoginPage &&
        !isManpowerLogin &&
        !isSupportPage &&
        !isLanding && <Sidebar />}
          <div
            className="flex-1"
            style={{
              marginLeft:
                !isLoginPage &&
                !isManpowerLogin &&
                !isSupportPage &&
                !isLanding
                  ? 240
                  : 0,
            }}
          >

        {/* GLOBAL TOP NAVBAR */}
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
            {/* PUBLIC */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/manpower-login" element={<ManpowerLogin />} />
            <Route path="/support" element={<Support />} />

            {/* LANDING */}
            <Route path="/landing" element={<Landing />} />

            {/* OPERATIONS */}
            <Route
              path="/operations"
              element={
                role ? <Operations /> : <Navigate to="/login" />
              }
            />

            {/* ADMIN */}
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
            <Route path="/process" element={<ProcessDashboard />} />
            <Route path="/scoring" element={<Scoring />} />
            <Route path="/scoring/kpi" element={<AddKPI />} />
            <Route path="/scoring/targets" element={<AddTargets />} />

            {/* DEFAULT */}
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

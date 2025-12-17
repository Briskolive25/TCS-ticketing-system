import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import Operations from './pages/Operations';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className="flex">
      {/* LEFT SIDEBAR */}
      <div className="w-[260px] fixed h-full bg-[#1f2d3d] text-white">
        <div className="p-6 text-xl font-semibold">
          TCS Ticketing System
        </div>

        <nav className="mt-4 space-y-3 px-4">
          <a href="/dashboard" className="block bg-blue-600 px-4 py-2 rounded text-white">
            Dashboard
          </a>

          <a href="/operations" className="block bg-blue-600 px-4 py-2 rounded text-white">
            Brisk Olive Operations Team
          </a>

          <a href="/admin-dashboard" className="block bg-blue-600 px-4 py-2 rounded text-white">
            Admin Dashboard
          </a>
        </nav>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="ml-[260px] w-full min-h-screen bg-gray-50 p-6">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/operations" element={<Operations />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

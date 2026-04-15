import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Career from "./pages/Career";
import ROI from "./pages/ROI";
import Loan from "./pages/Loan";
import Chatbot from "./pages/Chatbot";
import Timeline from "./pages/Timeline";

function App() {
  return (
    <Router>
      <div className="noise-bg flex min-h-screen bg-void">
        {/* Sidebar navigation */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 ml-64 min-h-screen relative z-10">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/career" element={<Career />} />
            <Route path="/roi" element={<ROI />} />
            <Route path="/loan" element={<Loan />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/timeline" element={<Timeline />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

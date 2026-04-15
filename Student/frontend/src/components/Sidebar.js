import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  TrendingUp,
  CreditCard,
  MessageSquare,
  CalendarDays,
  Zap,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { path: "/career",    label: "Career AI",  icon: Compass },
  { path: "/roi",       label: "ROI Calc",   icon: TrendingUp },
  { path: "/loan",      label: "Loan Check", icon: CreditCard },
  { path: "/chatbot",   label: "Chatbot",    icon: MessageSquare },
  { path: "/timeline",  label: "Timeline",   icon: CalendarDays },
];

export default function Sidebar() {
  const location = useLocation();
  const [hovered, setHovered] = useState(null);

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-64 flex flex-col z-50"
      style={{
        background: "linear-gradient(180deg, #0d1117 0%, #0a0f14 100%)",
        borderRight: "1px solid #21262d",
      }}
    >
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #00d4aa, #00a882)" }}
          >
            <Zap size={18} className="text-void" fill="currentColor" />
          </div>
          <div>
            <h1
              className="text-white leading-none"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.05rem" }}
            >
              EduVerse
            </h1>
            <span
              className="text-xs font-mono"
              style={{ color: "#00d4aa", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem" }}
            >
              AI ECOSYSTEM
            </span>
          </div>
        </div>

        {/* Status pill */}
        <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "#00d4aa0d", border: "1px solid #00d4aa22" }}>
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse2" />
          <span className="text-xs text-accent" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            AI Systems Online
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="text-xs uppercase tracking-widest text-muted px-2 mb-4" style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.6rem" }}>
          Navigation
        </p>

        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              onMouseEnter={() => setHovered(path)}
              onMouseLeave={() => setHovered(null)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                isActive ? "text-void" : "text-muted hover:text-white"
              }`}
              style={
                isActive
                  ? { background: "linear-gradient(135deg, #00d4aa, #00a882)" }
                  : hovered === path
                  ? { background: "#161b22", color: "#e6edf3" }
                  : {}
              }
            >
              <Icon
                size={17}
                className={`transition-transform duration-200 ${hovered === path && !isActive ? "scale-110" : ""}`}
              />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: isActive ? 600 : 400, fontSize: "0.875rem" }}>
                {label}
              </span>
              {isActive && (
                <ChevronRight size={14} className="ml-auto opacity-70" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-border">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-void"
            style={{ background: "linear-gradient(135deg, #f0c060, #d4a830)", fontFamily: "'Syne', sans-serif" }}
          >
            S
          </div>
          <div>
            <p className="text-xs text-white font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>Student</p>
            <p className="text-xs text-muted" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}>v2.0 Hackathon</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

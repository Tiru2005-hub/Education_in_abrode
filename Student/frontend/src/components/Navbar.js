import React from "react";
import { Bell, Search } from "lucide-react";

/**
 * Navbar - top bar showing page title + actions
 * Props: title, subtitle
 */
export default function Navbar({ title, subtitle }) {
  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-8 py-4"
      style={{
        background: "rgba(3,7,18,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid #21262d",
      }}
    >
      {/* Page info */}
      <div>
        <h2
          className="text-white leading-tight"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.25rem" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-muted mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: "#161b22", border: "1px solid #21262d" }}
        >
          <Search size={14} className="text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-xs text-white placeholder-muted outline-none w-32"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />
        </div>

        {/* Notification bell */}
        <button
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: "#161b22", border: "1px solid #21262d" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "#00d4aa55")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#21262d")}
        >
          <Bell size={16} className="text-muted" />
        </button>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-void"
          style={{ background: "linear-gradient(135deg, #00d4aa, #00a882)", fontFamily: "'Syne', sans-serif" }}
        >
          AI
        </div>
      </div>
    </header>
  );
}

import React from "react";

/**
 * Card - reusable surface component with optional glow variants
 * Props: title, icon, children, variant ("default"|"accent"|"gold"), className, onClick
 */
export default function Card({ title, icon: Icon, children, variant = "default", className = "", onClick }) {
  const variantStyles = {
    default: { border: "1px solid #21262d", background: "#0d1117" },
    accent:  { border: "1px solid #00d4aa33", background: "#0d1117", boxShadow: "0 0 24px #00d4aa08" },
    gold:    { border: "1px solid #f0c06033", background: "#0d1117", boxShadow: "0 0 24px #f0c06008" },
  };

  return (
    <div
      className={`rounded-xl p-5 card-hover ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={variantStyles[variant]}
      onClick={onClick}
    >
      {/* Card header */}
      {(title || Icon) && (
        <div className="flex items-center gap-2.5 mb-4">
          {Icon && (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: variant === "gold" ? "#f0c06015" : "#00d4aa15",
                border: variant === "gold" ? "1px solid #f0c06033" : "1px solid #00d4aa33",
              }}
            >
              <Icon
                size={15}
                style={{ color: variant === "gold" ? "#f0c060" : "#00d4aa" }}
              />
            </div>
          )}
          {title && (
            <h3
              className="text-white text-sm"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "0.01em" }}
            >
              {title}
            </h3>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

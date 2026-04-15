import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { Compass, TrendingUp, CreditCard, CalendarDays, ArrowRight, Sparkles, Users, Globe } from "lucide-react";

// Quick-access cards linking to each feature
const featureCards = [
  {
    path: "/career",
    icon: Compass,
    title: "Career AI",
    desc: "Get personalized university and course recommendations based on your CGPA, skills, and budget.",
    tag: "AI Powered",
    variant: "accent",
    color: "#00d4aa",
  },
  {
    path: "/roi",
    icon: TrendingUp,
    title: "ROI Insights",
    desc: "Calculate expected salary returns and payback period for any course-country combination.",
    tag: "Analytics",
    variant: "gold",
    color: "#f0c060",
  },
  {
    path: "/loan",
    icon: CreditCard,
    title: "Loan Eligibility",
    desc: "Check your loan eligibility and compute EMI breakdown based on family income and course cost.",
    tag: "Finance",
    variant: "accent",
    color: "#00d4aa",
  },
  {
    path: "/timeline",
    icon: CalendarDays,
    title: "Study Timeline",
    desc: "Structured step-by-step roadmap covering exams, applications, visa, and enrollment.",
    tag: "Planner",
    variant: "gold",
    color: "#f0c060",
  },
];

// Stats strip
const stats = [
  { label: "Universities Indexed", value: "2,400+", icon: Globe },
  { label: "Students Helped",      value: "18,000+", icon: Users },
  { label: "Countries Covered",    value: "32",      icon: Sparkles },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="page-enter min-h-screen">
      <Navbar title="Dashboard" subtitle="Welcome back — your AI study abroad command center" />

      <div className="px-8 py-8 space-y-8">
        {/* Hero banner */}
        <div
          className="rounded-2xl p-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0d1117 0%, #0a1a16 100%)",
            border: "1px solid #00d4aa22",
          }}
        >
          {/* Decorative blob */}
          <div
            className="absolute -right-20 -top-20 w-72 h-72 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #00d4aa 0%, transparent 70%)" }}
          />
          <div
            className="absolute right-32 bottom-0 w-48 h-48 rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, #f0c060 0%, transparent 70%)" }}
          />

          <div className="relative z-10 max-w-xl">
            <div className="stat-badge inline-flex items-center gap-1.5 mb-4">
              <Sparkles size={10} />
              AI-Powered Education Platform
            </div>
            <h1
              className="text-white mb-3 leading-tight"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2rem" }}
            >
              Plan Your Dream
              <span style={{ color: "#00d4aa" }}> Education</span> Abroad
            </h1>
            <p className="text-muted text-sm leading-relaxed mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              From career guidance to loan eligibility — EduVerse AI handles every dimension
              of your study-abroad journey with intelligent recommendations.
            </p>
            <button
              className="btn-accent px-6 py-2.5 rounded-lg text-sm flex items-center gap-2"
              onClick={() => navigate("/career")}
            >
              Start Career Analysis <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl px-5 py-4 flex items-center gap-4"
              style={{ background: "#0d1117", border: "1px solid #21262d" }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: "#00d4aa12", border: "1px solid #00d4aa25" }}
              >
                <Icon size={17} style={{ color: "#00d4aa" }} />
              </div>
              <div>
                <p
                  className="text-white font-bold text-lg leading-none"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {value}
                </p>
                <p className="text-xs text-muted mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Feature cards grid */}
        <div>
          <h3
            className="text-white mb-4 text-sm uppercase tracking-widest"
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.7rem", color: "#8b949e" }}
          >
            Explore Features
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {featureCards.map(({ path, icon: Icon, title, desc, tag, variant, color }) => (
              <Card
                key={path}
                variant={variant}
                className="group cursor-pointer"
                onClick={() => navigate(path)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}15`, border: `1px solid ${color}33` }}
                  >
                    <Icon size={18} style={{ color }} />
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-md"
                    style={{ background: `${color}12`, color, border: `1px solid ${color}25`, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
                  >
                    {tag}
                  </span>
                </div>
                <h4
                  className="text-white mb-2"
                  style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem" }}
                >
                  {title}
                </h4>
                <p className="text-muted text-xs leading-relaxed mb-4">{desc}</p>
                <div
                  className="flex items-center gap-1.5 text-xs font-medium transition-all duration-200 group-hover:gap-2.5"
                  style={{ color, fontFamily: "'DM Sans', sans-serif" }}
                >
                  Explore <ArrowRight size={13} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getTimeline } from "../services/api";
import { CalendarDays, CheckCircle2, Circle, Clock, ChevronDown, ChevronUp } from "lucide-react";

// Fallback static timeline if backend is unavailable
const FALLBACK_TIMELINE = [
  {
    phase: "Preparation",
    color: "#00d4aa",
    steps: [
      { title: "Standardized Exams", month: "Month 1–3", desc: "Prepare for GRE/GMAT, TOEFL/IELTS. Target scores: GRE 320+, TOEFL 100+.", status: "done" },
      { title: "Research Universities", month: "Month 2–4", desc: "Shortlist 8–12 universities based on ranking, program fit, cost, and scholarships.", status: "done" },
      { title: "Build Profile", month: "Month 1–6", desc: "Strengthen resume with internships, projects, publications, and volunteer work.", status: "done" },
    ],
  },
  {
    phase: "Applications",
    color: "#f0c060",
    steps: [
      { title: "SOP & LOR Preparation", month: "Month 5–7", desc: "Draft Statement of Purpose for each university. Request 3 strong Letters of Recommendation.", status: "active" },
      { title: "Submit Applications", month: "Month 7–9", desc: "Apply through university portals. Pay application fees. Track deadlines carefully.", status: "active" },
      { title: "Financial Aid & Scholarships", month: "Month 6–9", desc: "Apply for university scholarships, government grants (Fulbright, Chevening, DAAD).", status: "pending" },
    ],
  },
  {
    phase: "Admission & Finance",
    color: "#00d4aa",
    steps: [
      { title: "Receive Admits & Negotiate", month: "Month 9–11", desc: "Evaluate offer letters. Negotiate funding. Compare financial packages across universities.", status: "pending" },
      { title: "Secure Education Loan", month: "Month 10–12", desc: "Approach banks for education loans. Compare interest rates. Arrange collateral if needed.", status: "pending" },
      { title: "Accept Offer & Pay Deposit", month: "Month 11–12", desc: "Confirm acceptance, pay enrollment deposit, and secure housing.", status: "pending" },
    ],
  },
  {
    phase: "Visa & Pre-Departure",
    color: "#f0c060",
    steps: [
      { title: "Apply for Student Visa", month: "Month 12–14", desc: "Submit DS-160 (USA), Tier 4 (UK), or equivalent. Attend visa interview with all documents.", status: "pending" },
      { title: "Pre-Departure Prep", month: "Month 13–15", desc: "Book flights, arrange accommodation, get health insurance, set up bank account.", status: "pending" },
      { title: "Arrival & Enrollment", month: "Month 15", desc: "Arrive early, attend orientation, complete university check-in and course registration.", status: "pending" },
    ],
  },
];

const statusConfig = {
  done:    { icon: CheckCircle2, color: "#00d4aa", label: "Completed",  bg: "#00d4aa15" },
  active:  { icon: Clock,        color: "#f0c060", label: "In Progress", bg: "#f0c06015" },
  pending: { icon: Circle,       color: "#8b949e", label: "Upcoming",   bg: "#8b949e10" },
};

export default function Timeline() {
  const [timeline, setTimeline] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getTimeline()
      .then((data) => setTimeline(data.timeline || FALLBACK_TIMELINE))
      .catch(() => setTimeline(FALLBACK_TIMELINE))
      .finally(() => setLoading(false));
  }, []);

  const togglePhase = (i) => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  // Count stats
  const allSteps   = (timeline || []).flatMap((p) => p.steps);
  const doneCount  = allSteps.filter((s) => s.status === "done").length;
  const totalCount = allSteps.length;
  const pct        = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="page-enter min-h-screen">
      <Navbar title="Study Timeline" subtitle="Your step-by-step study abroad roadmap" />

      <div className="px-8 py-8">
        {/* Progress header */}
        <div
          className="rounded-xl p-6 mb-8 flex items-center gap-6"
          style={{ background: "#0d1117", border: "1px solid #00d4aa22" }}
        >
          {/* Circular progress */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
              <circle cx="40" cy="40" r="32" fill="none" stroke="#21262d" strokeWidth="6" />
              <circle
                cx="40" cy="40" r="32"
                fill="none"
                stroke="#00d4aa"
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - pct / 100)}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{pct}%</span>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>Overall Progress</h3>
            <p className="text-muted text-sm mt-0.5">
              {doneCount} of {totalCount} milestones completed
            </p>
            <div className="flex items-center gap-4 mt-3">
              {Object.entries(statusConfig).map(([key, { color, label }]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-xs text-muted">{label}: {allSteps.filter(s => s.status === key).length}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loading shimmer */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-20 rounded-xl shimmer-bg" />)}
          </div>
        )}

        {/* Phase accordion */}
        {!loading && timeline && (
          <div className="space-y-4">
            {timeline.map((phase, pi) => {
              const isOpen = expanded[pi] !== false; // default open
              return (
                <div
                  key={pi}
                  className="rounded-xl overflow-hidden"
                  style={{ border: `1px solid ${phase.color}22`, background: "#0d1117" }}
                >
                  {/* Phase header */}
                  <button
                    className="w-full flex items-center justify-between px-5 py-4 transition-all"
                    style={{ background: isOpen ? `${phase.color}08` : "transparent" }}
                    onClick={() => togglePhase(pi)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ background: `${phase.color}20`, color: phase.color, fontFamily: "'Syne', sans-serif" }}
                      >
                        {pi + 1}
                      </div>
                      <span className="text-white font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {phase.phase}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ background: `${phase.color}15`, color: phase.color, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
                      >
                        {phase.steps.length} steps
                      </span>
                    </div>
                    {isOpen
                      ? <ChevronUp  size={16} className="text-muted" />
                      : <ChevronDown size={16} className="text-muted" />
                    }
                  </button>

                  {/* Steps */}
                  {isOpen && (
                    <div className="px-5 pb-4 space-y-3 relative">
                      {/* Vertical connector line */}
                      <div className="timeline-line" style={{ background: `linear-gradient(180deg, ${phase.color}, ${phase.color}22)` }} />

                      {phase.steps.map((step, si) => {
                        const { icon: StatusIcon, color: sc, bg } = statusConfig[step.status] || statusConfig.pending;
                        return (
                          <div key={si} className="flex gap-4 pl-1">
                            {/* Status dot */}
                            <div className="flex-shrink-0 w-10 flex justify-center pt-1">
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center"
                                style={{ background: bg, border: `1px solid ${sc}33` }}
                              >
                                <StatusIcon size={13} style={{ color: sc }} />
                              </div>
                            </div>

                            {/* Step content */}
                            <div
                              className="flex-1 p-4 rounded-xl mb-1"
                              style={{ background: "#161b22", border: "1px solid #21262d" }}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-white text-sm font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>
                                  {step.title}
                                </p>
                                <span
                                  className="text-xs px-2 py-0.5 rounded"
                                  style={{ background: "#161b22", color: "#8b949e", border: "1px solid #21262d", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
                                >
                                  <CalendarDays size={9} className="inline mr-1" />
                                  {step.month}
                                </span>
                              </div>
                              <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

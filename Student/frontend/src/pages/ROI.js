import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { calculateROI } from "../services/api";
import { TrendingUp, Send, Loader, DollarSign, Clock, Percent, BarChart3 } from "lucide-react";

const inputClass = "w-full px-3 py-2.5 rounded-lg text-sm text-white input-glow transition-all duration-200";
const inputStyle = { background: "#161b22", border: "1px solid #21262d", fontFamily: "'DM Sans', sans-serif" };

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, color: "#8b949e", fontSize: "0.62rem" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// Animated stat card
function StatCard({ icon: Icon, label, value, sub, color = "#00d4aa" }) {
  return (
    <div className="p-5 rounded-xl" style={{ background: "#0d1117", border: `1px solid ${color}22` }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}33` }}>
          <Icon size={15} style={{ color }} />
        </div>
        <span className="text-xs text-muted">{label}</span>
      </div>
      <p className="text-2xl font-bold leading-none" style={{ color, fontFamily: "'Syne', sans-serif" }}>{value}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </div>
  );
}

const courses = ["Computer Science", "Data Science", "MBA", "Medicine", "Engineering", "Law", "Design"];
const countries = ["USA", "UK", "Canada", "Germany", "Australia", "Singapore"];

export default function ROI() {
  const [form, setForm]     = useState({ course: "Computer Science", country: "USA", fees: "" });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.fees) { setError("Please enter the course fees."); return; }
    setError("");
    setLoading(true);
    try {
      const data = await calculateROI(form);
      setResults(data);
    } catch {
      // Fallback calculation
      const salaryMap = { USA: 95000, UK: 70000, Canada: 75000, Germany: 65000, Australia: 72000, Singapore: 80000 };
      const salary = salaryMap[form.country] || 70000;
      const fees = parseFloat(form.fees);
      const payback = (fees / salary).toFixed(1);
      setResults({
        expected_salary: salary,
        payback_years: payback,
        roi_percent: Math.round(((salary * 10 - fees) / fees) * 100),
        salary_range: { min: Math.round(salary * 0.8), max: Math.round(salary * 1.4) },
        message: `For ${form.course} in ${form.country}, estimated annual salary is $${salary.toLocaleString()}.`,
      });
      setError("Backend unavailable. Showing estimated results.");
    } finally {
      setLoading(false);
    }
  };

  // Simple bar chart for salary range
  const BarViz = ({ min, max, mid }) => {
    const total = max * 1.1;
    return (
      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted mb-1">
          <span>${(min / 1000).toFixed(0)}k</span>
          <span style={{ color: "#00d4aa" }}>${(mid / 1000).toFixed(0)}k avg</span>
          <span>${(max / 1000).toFixed(0)}k</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: "#161b22" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${(mid / total) * 100}%`,
              background: "linear-gradient(90deg, #00d4aa, #00a882)",
            }}
          />
        </div>
        <div className="relative" style={{ height: "20px" }}>
          <div
            className="absolute top-1 w-0.5 h-3 rounded"
            style={{ left: `${(min / total) * 100}%`, background: "#00d4aa44" }}
          />
          <div
            className="absolute top-1 w-0.5 h-3 rounded"
            style={{ left: `${(max / total) * 100}%`, background: "#00d4aa44" }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="page-enter min-h-screen">
      <Navbar title="ROI Calculator" subtitle="Expected salary & payback period analysis" />

      <div className="px-8 py-8 grid grid-cols-5 gap-6">
        {/* Left: form */}
        <div className="col-span-2">
          <Card title="Course Details" icon={TrendingUp} variant="gold">
            <div className="space-y-4">
              <Field label="Course / Program">
                <select name="course" value={form.course} onChange={handleChange} className={inputClass} style={{ ...inputStyle, cursor: "pointer" }}>
                  {courses.map(c => <option key={c} value={c} style={{ background: "#161b22" }}>{c}</option>)}
                </select>
              </Field>

              <Field label="Country">
                <select name="country" value={form.country} onChange={handleChange} className={inputClass} style={{ ...inputStyle, cursor: "pointer" }}>
                  {countries.map(c => <option key={c} value={c} style={{ background: "#161b22" }}>{c}</option>)}
                </select>
              </Field>

              <Field label="Total Course Fees (USD)">
                <input
                  name="fees"
                  type="number"
                  placeholder="e.g. 60000"
                  value={form.fees}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </Field>

              {error && (
                <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "#f0c06015", color: "#f0c060", border: "1px solid #f0c06033" }}>
                  {error}
                </p>
              )}

              <button className="btn-accent w-full py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 mt-2" onClick={handleSubmit} disabled={loading}>
                {loading ? <Loader size={15} className="animate-spin" /> : <Send size={15} />}
                {loading ? "Calculating..." : "Calculate ROI"}
              </button>
            </div>
          </Card>
        </div>

        {/* Right: results */}
        <div className="col-span-3 space-y-4">
          {!results && !loading && (
            <div className="rounded-xl p-10 flex flex-col items-center justify-center text-center" style={{ background: "#0d1117", border: "1px dashed #21262d", minHeight: "300px" }}>
              <BarChart3 size={40} className="text-muted mb-4" />
              <p className="text-muted text-sm">Enter course details to calculate your education ROI</p>
            </div>
          )}

          {loading && <div className="h-64 rounded-xl shimmer-bg" />}

          {results && !loading && (
            <>
              <p className="text-sm text-muted">{results.message}</p>

              <div className="grid grid-cols-3 gap-4">
                <StatCard icon={DollarSign} label="Expected Salary" value={`$${(results.expected_salary / 1000).toFixed(0)}k`} sub="Per year (USD)" color="#00d4aa" />
                <StatCard icon={Clock}      label="Payback Period" value={`${results.payback_years} yrs`} sub="To break even" color="#f0c060" />
                <StatCard icon={Percent}    label="10-Year ROI" value={`${results.roi_percent}%`} sub="Return on investment" color="#00d4aa" />
              </div>

              {/* Salary range viz */}
              <Card title="Salary Range Distribution" icon={BarChart3} variant="accent">
                <BarViz min={results.salary_range.min} max={results.salary_range.max} mid={results.expected_salary} />
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { l: "Entry Level", v: results.salary_range.min },
                    { l: "Mid Level",   v: results.expected_salary },
                    { l: "Senior",      v: results.salary_range.max },
                  ].map(({ l, v }) => (
                    <div key={l} className="text-center p-3 rounded-lg" style={{ background: "#161b22" }}>
                      <p className="text-xs text-muted">{l}</p>
                      <p className="text-sm font-bold mt-1" style={{ color: "#00d4aa", fontFamily: "'Syne', sans-serif" }}>
                        ${(v / 1000).toFixed(0)}k
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

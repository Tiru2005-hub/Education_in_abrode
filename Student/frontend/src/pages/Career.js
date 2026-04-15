import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { getCareerRecommendations } from "../services/api";
import { Compass, Send, Loader, GraduationCap, MapPin, Star, BookOpen } from "lucide-react";

// Input field helper component
function Field({ label, children }) {
  return (
    <div>
      <label
        className="block text-xs mb-1.5 uppercase tracking-wider"
        style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, color: "#8b949e", fontSize: "0.62rem" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2.5 rounded-lg text-sm text-white input-glow transition-all duration-200";
const inputStyle = { background: "#161b22", border: "1px solid #21262d", fontFamily: "'DM Sans', sans-serif" };

const countries = ["USA", "UK", "Canada", "Germany", "Australia", "Singapore", "Netherlands"];

export default function Career() {
  const [form, setForm] = useState({ cgpa: "", skills: "", budget: "", country: "USA" });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.cgpa || !form.skills || !form.budget) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await getCareerRecommendations(form);
      setResults(data);
    } catch {
      setError("Backend unavailable. Showing demo results.");
      // Fallback demo data
      setResults({
        universities: [
          { name: "University of Toronto", country: form.country, rank: 18, program: "Computer Science MS", fit: 92 },
          { name: "Georgia Tech",           country: form.country, rank: 33, program: "Data Science MS",    fit: 87 },
          { name: "TU Munich",              country: form.country, rank: 50, program: "AI & Robotics",      fit: 81 },
        ],
        courses: ["Machine Learning", "Data Engineering", "Cloud Architecture", "AI Research"],
        message: `Based on CGPA ${form.cgpa} and skills in ${form.skills}, here are top recommendations.`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter min-h-screen">
      <Navbar title="Career AI" subtitle="Personalized university & course recommendations" />

      <div className="px-8 py-8 grid grid-cols-5 gap-6">
        {/* Left: Input form */}
        <div className="col-span-2 space-y-4">
          <Card title="Your Profile" icon={Compass} variant="accent">
            <div className="space-y-4">
              <Field label="CGPA / GPA">
                <input
                  name="cgpa"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="e.g. 8.2"
                  value={form.cgpa}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </Field>

              <Field label="Key Skills (comma-separated)">
                <input
                  name="skills"
                  type="text"
                  placeholder="Python, ML, Data Analysis"
                  value={form.skills}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </Field>

              <Field label="Total Budget (USD)">
                <input
                  name="budget"
                  type="number"
                  placeholder="e.g. 50000"
                  value={form.budget}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </Field>

              <Field label="Preferred Country">
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className={inputClass}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  {countries.map((c) => (
                    <option key={c} value={c} style={{ background: "#161b22" }}>{c}</option>
                  ))}
                </select>
              </Field>

              {error && (
                <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "#ff4d6d15", color: "#ff4d6d", border: "1px solid #ff4d6d33" }}>
                  {error}
                </p>
              )}

              <button
                className="btn-accent w-full py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 mt-2"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <Loader size={15} className="animate-spin" /> : <Send size={15} />}
                {loading ? "Analyzing..." : "Get Recommendations"}
              </button>
            </div>
          </Card>
        </div>

        {/* Right: Results */}
        <div className="col-span-3 space-y-4">
          {!results && !loading && (
            <div
              className="rounded-xl p-10 flex flex-col items-center justify-center text-center"
              style={{ background: "#0d1117", border: "1px dashed #21262d", minHeight: "300px" }}
            >
              <GraduationCap size={40} className="text-muted mb-4" />
              <p className="text-muted text-sm">Fill in your profile to get AI-powered university recommendations</p>
            </div>
          )}

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-xl shimmer-bg" />
              ))}
            </div>
          )}

          {results && !loading && (
            <>
              {/* Message */}
              <Card variant="accent">
                <p className="text-sm text-white leading-relaxed">{results.message}</p>
              </Card>

              {/* University cards */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-muted mb-3" style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.6rem" }}>
                  Recommended Universities
                </h4>
                <div className="space-y-3">
                  {results.universities?.map((uni, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl flex items-center justify-between card-hover"
                      style={{ background: "#0d1117", border: "1px solid #21262d" }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
                          style={{ background: "#00d4aa15", color: "#00d4aa", fontFamily: "'Syne', sans-serif" }}
                        >
                          #{i + 1}
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>{uni.name}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="flex items-center gap-1 text-xs text-muted">
                              <MapPin size={10} /> {uni.country}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted">
                              <BookOpen size={10} /> {uni.program}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star size={12} style={{ color: "#f0c060" }} fill="#f0c060" />
                          <span className="text-sm font-bold" style={{ color: "#f0c060", fontFamily: "'Syne', sans-serif" }}>
                            {uni.fit}%
                          </span>
                        </div>
                        <p className="text-xs text-muted">Fit Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested courses */}
              <Card title="Suggested Courses" icon={BookOpen} variant="gold">
                <div className="flex flex-wrap gap-2">
                  {results.courses?.map((course, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg text-xs"
                      style={{ background: "#f0c06012", color: "#f0c060", border: "1px solid #f0c06033", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {course}
                    </span>
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

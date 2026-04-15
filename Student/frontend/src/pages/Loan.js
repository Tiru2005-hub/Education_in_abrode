import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { checkLoanEligibility } from "../services/api";
import { CreditCard, Send, Loader, CheckCircle, XCircle, Calculator, Banknote } from "lucide-react";

const inputClass = "w-full px-3 py-2.5 rounded-lg text-sm text-white input-glow transition-all duration-200";
const inputStyle = { background: "#161b22", border: "1px solid #21262d", fontFamily: "'DM Sans', sans-serif" };

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, color: "#8b949e", fontSize: "0.62rem" }}>
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted mt-1">{hint}</p>}
    </div>
  );
}

export default function Loan() {
  const [form, setForm]     = useState({ family_income: "", course_cost: "", loan_term: "5" });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.family_income || !form.course_cost) { setError("Please fill all required fields."); return; }
    setError("");
    setLoading(true);
    try {
      const data = await checkLoanEligibility(form);
      setResults(data);
    } catch {
      // Fallback calculation
      const income = parseFloat(form.family_income);
      const cost   = parseFloat(form.course_cost);
      const maxLoan = income * 10;
      const eligible = cost <= maxLoan;
      const loanAmount = Math.min(cost, maxLoan);
      const r = 0.085 / 12; // 8.5% annual interest
      const n = parseInt(form.loan_term) * 12;
      const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setResults({
        eligible,
        max_loan: maxLoan,
        loan_amount: loanAmount,
        emi_monthly: Math.round(emi),
        total_payment: Math.round(emi * n),
        total_interest: Math.round(emi * n - loanAmount),
        interest_rate: 8.5,
        message: eligible
          ? `You are eligible for a loan up to $${maxLoan.toLocaleString()}.`
          : `Course cost exceeds maximum loan eligibility of $${maxLoan.toLocaleString()}.`,
      });
      setError("Backend unavailable. Showing calculated results.");
    } finally {
      setLoading(false);
    }
  };

  // Progress bar for eligibility coverage
  const EligibilityMeter = ({ cost, max }) => {
    const pct = Math.min((cost / max) * 100, 100);
    const over = cost > max;
    return (
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted">Course Cost vs Max Eligible</span>
          <span style={{ color: over ? "#ff4d6d" : "#00d4aa" }}>{pct.toFixed(1)}%</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#161b22" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: over ? "linear-gradient(90deg, #ff4d6d, #cc1a38)" : "linear-gradient(90deg, #00d4aa, #00a882)" }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="page-enter min-h-screen">
      <Navbar title="Loan Check" subtitle="Eligibility verification & EMI calculation" />

      <div className="px-8 py-8 grid grid-cols-5 gap-6">
        {/* Left: form */}
        <div className="col-span-2">
          <Card title="Loan Details" icon={CreditCard} variant="accent">
            <div className="space-y-4">
              <Field label="Annual Family Income (USD)" hint="Combined family yearly income">
                <input name="family_income" type="number" placeholder="e.g. 80000" value={form.family_income} onChange={handleChange} className={inputClass} style={inputStyle} />
              </Field>

              <Field label="Total Course Cost (USD)" hint="Tuition + living expenses">
                <input name="course_cost" type="number" placeholder="e.g. 60000" value={form.course_cost} onChange={handleChange} className={inputClass} style={inputStyle} />
              </Field>

              <Field label="Loan Repayment Term (Years)">
                <select name="loan_term" value={form.loan_term} onChange={handleChange} className={inputClass} style={{ ...inputStyle, cursor: "pointer" }}>
                  {[3, 5, 7, 10, 15].map(y => <option key={y} value={y} style={{ background: "#161b22" }}>{y} Years</option>)}
                </select>
              </Field>

              {error && (
                <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "#ff4d6d15", color: "#ff4d6d", border: "1px solid #ff4d6d33" }}>
                  {error}
                </p>
              )}

              <button className="btn-accent w-full py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 mt-2" onClick={handleSubmit} disabled={loading}>
                {loading ? <Loader size={15} className="animate-spin" /> : <Send size={15} />}
                {loading ? "Checking..." : "Check Eligibility"}
              </button>
            </div>
          </Card>
        </div>

        {/* Right: results */}
        <div className="col-span-3 space-y-4">
          {!results && !loading && (
            <div className="rounded-xl p-10 flex flex-col items-center justify-center text-center" style={{ background: "#0d1117", border: "1px dashed #21262d", minHeight: "300px" }}>
              <Calculator size={40} className="text-muted mb-4" />
              <p className="text-muted text-sm">Enter your financial details to check loan eligibility</p>
            </div>
          )}

          {loading && <div className="h-64 rounded-xl shimmer-bg" />}

          {results && !loading && (
            <>
              {/* Eligibility verdict */}
              <div
                className="p-5 rounded-xl flex items-center gap-4"
                style={{
                  background: results.eligible ? "#00d4aa0d" : "#ff4d6d0d",
                  border: `1px solid ${results.eligible ? "#00d4aa33" : "#ff4d6d33"}`,
                }}
              >
                {results.eligible
                  ? <CheckCircle size={28} style={{ color: "#00d4aa" }} />
                  : <XCircle    size={28} style={{ color: "#ff4d6d" }} />
                }
                <div>
                  <p className="font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {results.eligible ? "Eligible for Education Loan" : "Exceeds Loan Eligibility"}
                  </p>
                  <p className="text-sm text-muted mt-0.5">{results.message}</p>
                </div>
              </div>

              {/* Eligibility meter */}
              <Card variant="accent">
                <EligibilityMeter cost={parseFloat(form.course_cost)} max={results.max_loan} />
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3 rounded-lg" style={{ background: "#161b22" }}>
                    <p className="text-xs text-muted">Max Eligible Loan</p>
                    <p className="text-lg font-bold mt-1" style={{ color: "#00d4aa", fontFamily: "'Syne', sans-serif" }}>
                      ${results.max_loan.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: "#161b22" }}>
                    <p className="text-xs text-muted">Loan Amount</p>
                    <p className="text-lg font-bold mt-1" style={{ color: "#f0c060", fontFamily: "'Syne', sans-serif" }}>
                      ${results.loan_amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>

              {/* EMI breakdown */}
              <Card title="EMI Breakdown" icon={Banknote} variant="gold">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Monthly EMI",    value: `$${results.emi_monthly.toLocaleString()}`,   color: "#00d4aa" },
                    { label: "Total Payment",  value: `$${results.total_payment.toLocaleString()}`, color: "#f0c060" },
                    { label: "Total Interest", value: `$${results.total_interest.toLocaleString()}`, color: "#ff4d6d" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="p-3 rounded-lg text-center" style={{ background: "#161b22" }}>
                      <p className="text-xs text-muted">{label}</p>
                      <p className="text-base font-bold mt-1" style={{ color, fontFamily: "'Syne', sans-serif" }}>{value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted mt-3 text-center">
                  Based on {results.interest_rate}% annual interest over {form.loan_term} years
                </p>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

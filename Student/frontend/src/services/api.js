import axios from "axios";

// Base URL for Flask backend
const BASE_URL = "http://127.0.0.1:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ─── Career recommendations ─────────────────────────────────────────────────
export const getCareerRecommendations = (data) =>
  api.post("/career", data).then((r) => r.data);

// ─── ROI calculator ──────────────────────────────────────────────────────────
export const calculateROI = (data) =>
  api.post("/roi", data).then((r) => r.data);

// ─── Loan eligibility ────────────────────────────────────────────────────────
export const checkLoanEligibility = (data) =>
  api.post("/loan", data).then((r) => r.data);

// ─── Chatbot ─────────────────────────────────────────────────────────────────
export const sendChatMessage = (data) =>
  api.post("/chatbot", data).then((r) => r.data);

// ─── Timeline ────────────────────────────────────────────────────────────────
export const getTimeline = () =>
  api.get("/timeline").then((r) => r.data);

export default api;

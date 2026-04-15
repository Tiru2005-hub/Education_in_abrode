import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import { sendChatMessage } from "../services/api";
import { Send, Loader, Bot, User, Sparkles, RotateCcw } from "lucide-react";

// Suggested starter questions
const STARTERS = [
  "What CGPA do I need for a US university?",
  "Which country has the best CS programs?",
  "How do I apply for a student visa?",
  "What is the average education loan interest rate?",
];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello! I'm **EduVerse AI**, your study abroad assistant. Ask me anything about universities, courses, loans, visas, or career paths.",
      ts: new Date(),
    },
  ]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: msg, ts: new Date() }]);
    setLoading(true);

    try {
      const data = await sendChatMessage({ message: msg });
      setMessages((prev) => [...prev, { role: "bot", text: data.response, ts: new Date() }]);
    } catch {
      // Fallback responses
      const fallbacks = [
        `Great question about "${msg}"! For study abroad, I recommend exploring universities based on your CGPA and budget. Would you like me to use the Career AI tool for personalised suggestions?`,
        "To study in the USA, you typically need a CGPA of 3.0+ (7.5+/10), GRE/GMAT scores, and proof of English proficiency (TOEFL/IELTS).",
        "The average education loan interest rate ranges from 7–12% depending on the lender. Always compare banks and government schemes.",
        "For a student visa, you'll need I-20 (USA), CAS (UK), or equivalent, plus financial proof, health insurance, and a valid passport.",
      ];
      const response = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      setMessages((prev) => [...prev, { role: "bot", text: response, ts: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () =>
    setMessages([{ role: "bot", text: "Chat cleared. How can I help you today?", ts: new Date() }]);

  // Render bold text (simple markdown **bold**)
  const renderText = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((p, i) =>
      i % 2 === 1 ? <strong key={i} style={{ color: "#00d4aa" }}>{p}</strong> : p
    );
  };

  return (
    <div className="page-enter flex flex-col" style={{ height: "100vh" }}>
      <Navbar title="AI Chatbot" subtitle="Ask anything about study abroad, loans & careers" />

      <div className="flex-1 flex flex-col px-8 py-6 overflow-hidden">
        <div
          className="flex-1 flex flex-col rounded-2xl overflow-hidden"
          style={{ background: "#0d1117", border: "1px solid #21262d" }}
        >
          {/* Chat header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid #21262d" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #00d4aa, #00a882)" }}
              >
                <Bot size={17} className="text-void" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>EduVerse AI</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse2" />
                  <span className="text-xs text-accent" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}>Online</span>
                </div>
              </div>
            </div>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted transition-all"
              style={{ background: "#161b22", border: "1px solid #21262d" }}
              onClick={clearChat}
              onMouseEnter={e => e.currentTarget.style.color = "#e6edf3"}
              onMouseLeave={e => e.currentTarget.style.color = "#8b949e"}
            >
              <RotateCcw size={12} /> Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={
                    msg.role === "bot"
                      ? { background: "linear-gradient(135deg, #00d4aa, #00a882)" }
                      : { background: "linear-gradient(135deg, #f0c060, #d4a830)" }
                  }
                >
                  {msg.role === "bot"
                    ? <Bot  size={14} className="text-void" />
                    : <User size={14} className="text-void" />
                  }
                </div>

                {/* Bubble */}
                <div className={`max-w-lg ${msg.role === "user" ? "msg-user" : "msg-bot"} px-4 py-3`}>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: "#e6edf3" }}>
                    {renderText(msg.text)}
                  </p>
                  <p className="text-xs mt-1.5" style={{ color: "#8b949e55", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem" }}>
                    {msg.ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00d4aa, #00a882)" }}>
                  <Bot size={14} className="text-void" />
                </div>
                <div className="msg-bot px-4 py-3 flex items-center gap-1.5">
                  {[0, 0.2, 0.4].map((d, i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse2"
                      style={{ animationDelay: `${d}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Starter suggestions */}
          {messages.length <= 1 && !loading && (
            <div className="px-5 pb-3">
              <p className="text-xs text-muted mb-2 flex items-center gap-1">
                <Sparkles size={10} /> Suggested questions
              </p>
              <div className="flex flex-wrap gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    className="px-3 py-1.5 rounded-lg text-xs transition-all"
                    style={{ background: "#161b22", border: "1px solid #21262d", color: "#8b949e", fontFamily: "'DM Sans', sans-serif" }}
                    onClick={() => sendMessage(s)}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#00d4aa55"; e.currentTarget.style.color = "#e6edf3"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#21262d"; e.currentTarget.style.color = "#8b949e"; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="px-5 py-4" style={{ borderTop: "1px solid #21262d" }}>
            <div className="flex gap-3">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about universities, loans, visas, careers..."
                className="flex-1 px-4 py-3 rounded-xl text-sm text-white resize-none input-glow transition-all"
                style={{
                  background: "#161b22",
                  border: "1px solid #21262d",
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.5,
                  maxHeight: "120px",
                  overflowY: "auto",
                }}
              />
              <button
                className="btn-accent px-4 rounded-xl flex items-center justify-center"
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                style={{ opacity: (!input.trim() || loading) ? 0.5 : 1 }}
              >
                {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
            <p className="text-xs text-muted mt-2 text-center" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}>
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

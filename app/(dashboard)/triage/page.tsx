"use client";

import { useState } from "react";

type Severity = "critical" | "moderate" | "mild";

interface ChatMessage {
  role: "ai" | "patient";
  text: string;
  time: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  ticketId: string;
  arrivalTime: string;
  severity: Severity;
  aiDiagnosis: string;
  aiConfidence: number;
  aiRecommendation: string;
  symptoms: string[];
  vitals: { label: string; value: string; normal: boolean }[];
  chat: ChatMessage[];
  status: "waiting" | "in-review" | "approved" | "referred";
}

const MOCK_PATIENTS: Patient[] = [
  {
    id: "p1",
    name: "Fatou Jallow",
    age: 34,
    gender: "Female",
    ticketId: "TKT-2041",
    arrivalTime: "08:14 AM",
    severity: "critical",
    aiDiagnosis: "Possible Acute Appendicitis",
    aiConfidence: 87,
    aiRecommendation:
      "Urgent surgical consultation recommended. Patient reports severe right lower quadrant pain with rebound tenderness. CBC and abdominal ultrasound required immediately.",
    symptoms: ["Severe RLQ pain", "Nausea", "Low-grade fever", "Rebound tenderness"],
    vitals: [
      { label: "Temp", value: "38.4 °C", normal: false },
      { label: "BP", value: "118/76 mmHg", normal: true },
      { label: "Pulse", value: "104 bpm", normal: false },
      { label: "SpO₂", value: "98%", normal: true },
    ],
    chat: [
      { role: "ai", text: "Hello! I'm here to help. Can you describe what you're feeling today?", time: "08:01 AM" },
      { role: "patient", text: "I have a very sharp pain on my right side, near my stomach. It started last night and is getting worse.", time: "08:02 AM" },
      { role: "ai", text: "On a scale of 1–10 how severe is the pain, and does it get worse when you move or press the area?", time: "08:02 AM" },
      { role: "patient", text: "It's like an 8. Yes, when I press it, the pain actually feels worse when I let go.", time: "08:03 AM" },
      { role: "ai", text: "Have you had any fever, vomiting, or nausea?", time: "08:04 AM" },
      { role: "patient", text: "Yes, I felt sick and threw up once. I also feel a little warm.", time: "08:04 AM" },
      { role: "ai", text: "Thank you. Based on your symptoms, I'm flagging this for urgent doctor review. Please stay in the waiting area.", time: "08:05 AM" },
    ],
    status: "waiting",
  },
  {
    id: "p2",
    name: "Lamin Ceesay",
    age: 52,
    gender: "Male",
    ticketId: "TKT-2042",
    arrivalTime: "08:31 AM",
    severity: "moderate",
    aiDiagnosis: "Hypertensive Episode",
    aiConfidence: 79,
    aiRecommendation:
      "Blood pressure is elevated. Recommend monitoring and oral antihypertensive. Review current medication compliance. ECG advised.",
    symptoms: ["Headache", "Blurred vision", "Dizziness", "Chest tightness"],
    vitals: [
      { label: "Temp", value: "36.9 °C", normal: true },
      { label: "BP", value: "168/102 mmHg", normal: false },
      { label: "Pulse", value: "88 bpm", normal: true },
      { label: "SpO₂", value: "97%", normal: true },
    ],
    chat: [
      { role: "ai", text: "Good morning! What brings you in today?", time: "08:20 AM" },
      { role: "patient", text: "I've had a bad headache since this morning and my vision is a bit blurry.", time: "08:21 AM" },
      { role: "ai", text: "Do you have a history of high blood pressure or are you currently on any medications?", time: "08:21 AM" },
      { role: "patient", text: "Yes, I take amlodipine but I ran out two days ago.", time: "08:22 AM" },
      { role: "ai", text: "I see. Any chest pain or shortness of breath?", time: "08:22 AM" },
      { role: "patient", text: "A little tightness in my chest, yes.", time: "08:23 AM" },
      { role: "ai", text: "Noted. I'm marking this as moderate priority. A doctor will assess you shortly.", time: "08:23 AM" },
    ],
    status: "in-review",
  },
  {
    id: "p3",
    name: "Aminata Touray",
    age: 28,
    gender: "Female",
    ticketId: "TKT-2043",
    arrivalTime: "08:55 AM",
    severity: "mild",
    aiDiagnosis: "Acute Pharyngitis",
    aiConfidence: 92,
    aiRecommendation:
      "Likely bacterial throat infection. Consider throat swab. Symptomatic treatment with analgesics and antibiotic if strep confirmed.",
    symptoms: ["Sore throat", "Difficulty swallowing", "Mild fever", "Swollen glands"],
    vitals: [
      { label: "Temp", value: "37.8 °C", normal: false },
      { label: "BP", value: "112/72 mmHg", normal: true },
      { label: "Pulse", value: "78 bpm", normal: true },
      { label: "SpO₂", value: "99%", normal: true },
    ],
    chat: [
      { role: "ai", text: "Hi there! What seems to be the issue today?", time: "08:45 AM" },
      { role: "patient", text: "My throat has been really sore for 3 days and it hurts to swallow.", time: "08:46 AM" },
      { role: "ai", text: "Any fever or swollen neck glands?", time: "08:46 AM" },
      { role: "patient", text: "A little fever yesterday and my neck feels swollen near the jaw.", time: "08:47 AM" },
      { role: "ai", text: "Any cough, runny nose, or voice changes?", time: "08:47 AM" },
      { role: "patient", text: "No cough, but my voice sounds different.", time: "08:48 AM" },
      { role: "ai", text: "Got it. This looks like a throat infection. Flagging for a routine consult with the doctor.", time: "08:48 AM" },
    ],
    status: "waiting",
  },
  {
    id: "p4",
    name: "Ousman Bah",
    age: 67,
    gender: "Male",
    ticketId: "TKT-2044",
    arrivalTime: "09:10 AM",
    severity: "moderate",
    aiDiagnosis: "Type 2 Diabetes — Uncontrolled",
    aiConfidence: 83,
    aiRecommendation:
      "Fasting glucose is very high. Review insulin regimen and diet. HbA1c and renal function panel advised. Check for ketones.",
    symptoms: ["Excessive thirst", "Frequent urination", "Fatigue", "Blurred vision"],
    vitals: [
      { label: "Temp", value: "36.7 °C", normal: true },
      { label: "BP", value: "140/90 mmHg", normal: false },
      { label: "Pulse", value: "82 bpm", normal: true },
      { label: "SpO₂", value: "98%", normal: true },
    ],
    chat: [
      { role: "ai", text: "Good morning! How can I assist you today?", time: "09:00 AM" },
      { role: "patient", text: "I've been drinking a lot of water and going to the toilet many times. I'm very tired.", time: "09:01 AM" },
      { role: "ai", text: "Do you have diabetes, and are you on any medication for it?", time: "09:01 AM" },
      { role: "patient", text: "Yes, I have diabetes and I take metformin.", time: "09:02 AM" },
      { role: "ai", text: "When did you last check your blood sugar, and have you been eating regularly?", time: "09:02 AM" },
      { role: "patient", text: "I checked yesterday and it was 18. I ate more rice than usual at a wedding.", time: "09:03 AM" },
      { role: "ai", text: "Understood. Flagging as moderate priority. A doctor will review your case soon.", time: "09:03 AM" },
    ],
    status: "approved",
  },
];

const SEVERITY_CONFIG: Record<Severity, { label: string; dot: string; badge: string; ring: string }> = {
  critical: {
    label: "Critical",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-600 border border-red-100",
    ring: "border-l-4 border-red-400",
  },
  moderate: {
    label: "Moderate",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border border-amber-100",
    ring: "border-l-4 border-amber-400",
  },
  mild: {
    label: "Mild",
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    ring: "border-l-4 border-emerald-400",
  },
};

const STATUS_BADGE: Record<Patient["status"], string> = {
  waiting: "bg-gray-100 text-gray-500",
  "in-review": "bg-blue-50 text-blue-600",
  approved: "bg-emerald-50 text-emerald-700",
  referred: "bg-purple-50 text-purple-600",
};

const STATUS_LABEL: Record<Patient["status"], string> = {
  waiting: "Waiting",
  "in-review": "In Review",
  approved: "Approved",
  referred: "Referred",
};

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 85 ? "bg-emerald-500" : value >= 65 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-600">{value}%</span>
    </div>
  );
}

export default function TriagePage() {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [selected, setSelected] = useState<Patient>(MOCK_PATIENTS[0]);
  const [filter, setFilter] = useState<"all" | Severity>("all");
  const [activeTab, setActiveTab] = useState<"chat" | "vitals">("chat");

  const filtered = filter === "all" ? patients : patients.filter((p) => p.severity === filter);

  function approveRecommendation(id: string) {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p))
    );
    setSelected((prev) => (prev.id === id ? { ...prev, status: "approved" } : prev));
  }

  function referPatient(id: string) {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "referred" } : p))
    );
    setSelected((prev) => (prev.id === id ? { ...prev, status: "referred" } : prev));
  }

  function markInReview(id: string) {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "in-review" } : p))
    );
    setSelected((prev) => (prev.id === id ? { ...prev, status: "in-review" } : prev));
  }

  const sev = SEVERITY_CONFIG[selected.severity];

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col gap-6">
      {/* Page heading */}
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-[#1a7f8a] uppercase mb-1">
          Clinical · AI-Assisted
        </p>
        <h1 className="text-4xl font-extrabold text-gray-900">Patient Triage</h1>
      </div>

      <div className="flex gap-5 min-h-0" style={{ height: "calc(100vh - 220px)" }}>
        {/* ── LEFT: patient queue ─────────────────────────── */}
        <div className="w-80 flex-shrink-0 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden">
          {/* Queue header */}
          <div className="px-4 pt-5 pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-900">Queue Today</h2>
              <span className="text-xs font-semibold bg-[#1a7f8a]/10 text-[#1a7f8a] rounded-full px-2 py-0.5">
                {patients.length} patients
              </span>
            </div>
            {/* Severity filter */}
            <div className="flex gap-1">
              {(["all", "critical", "moderate", "mild"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 text-[10px] font-bold py-1 rounded-lg capitalize transition-colors ${
                    filter === f
                      ? "bg-[#1a7f8a] text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Patient list */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filtered.map((p) => {
              const s = SEVERITY_CONFIG[p.severity];
              const isActive = selected.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`w-full text-left px-4 py-3.5 ${s.ring} transition-colors ${
                    isActive ? "bg-[#1a7f8a]/5" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {p.age}y · {p.gender} · {p.ticketId}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.badge}`}>
                        {s.label}
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${STATUS_BADGE[p.status]}`}>
                        {STATUS_LABEL[p.status]}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <p className="text-[11px] text-gray-400">Arrived {p.arrivalTime}</p>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium mt-1.5 truncate">{p.aiDiagnosis}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: patient detail ───────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4 overflow-y-auto">
          {/* Patient header card */}
          <div className="bg-white rounded-2xl shadow-sm px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-2xl bg-[#1a7f8a]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-[#1a7f8a]">
                    {selected.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-extrabold text-gray-900">{selected.name}</h2>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sev.badge}`}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${sev.dot} mr-1.5`} />
                      {sev.label} Priority
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${STATUS_BADGE[selected.status]}`}>
                      {STATUS_LABEL[selected.status]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {selected.age} years old · {selected.gender} · Ticket {selected.ticketId} · Arrived {selected.arrivalTime}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {selected.status === "waiting" && (
                  <button
                    onClick={() => markInReview(selected.id)}
                    className="flex items-center gap-1.5 px-4 h-9 rounded-xl text-sm font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Start Review
                  </button>
                )}
                {selected.status !== "approved" && selected.status !== "referred" && (
                  <>
                    <button
                      onClick={() => approveRecommendation(selected.id)}
                      className="flex items-center gap-1.5 px-4 h-9 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Approve AI Rec.
                    </button>
                    <button
                      onClick={() => referPatient(selected.id)}
                      className="flex items-center gap-1.5 px-4 h-9 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Refer
                    </button>
                  </>
                )}
                {(selected.status === "approved" || selected.status === "referred") && (
                  <div className="flex items-center gap-1.5 px-4 h-9 rounded-xl text-sm font-semibold bg-gray-50 text-gray-400 border border-gray-100">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Case {STATUS_LABEL[selected.status]}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_300px] gap-4 flex-1 min-h-0">
            {/* ── Center: AI summary + chat/vitals ── */}
            <div className="flex flex-col gap-4 min-h-0">
              {/* AI Diagnosis card */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-[#1a7f8a]/10 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#1a7f8a]">
                      <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#1a7f8a] uppercase tracking-wider">AI Assessment</p>
                    <h3 className="text-base font-extrabold text-gray-900">{selected.aiDiagnosis}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 mb-1">AI Confidence</p>
                    <div className="w-32">
                      <ConfidenceBar value={selected.aiConfidence} />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-4 py-3">
                  {selected.aiRecommendation}
                </p>
                {/* Symptoms */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {selected.symptoms.map((s) => (
                    <span key={s} className="text-xs font-medium bg-[#1a7f8a]/8 text-[#1a7f8a] px-2.5 py-1 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chat / Vitals tabs */}
              <div className="bg-white rounded-2xl shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="flex border-b border-gray-100 px-5 pt-4">
                  {(["chat", "vitals"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`capitalize text-sm font-semibold pb-3 mr-6 border-b-2 transition-colors ${
                        activeTab === tab
                          ? "border-[#1a7f8a] text-[#1a7f8a]"
                          : "border-transparent text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {tab === "chat" ? "AI Chat Transcript" : "Vitals"}
                    </button>
                  ))}
                </div>

                {activeTab === "chat" ? (
                  <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                    {selected.chat.map((msg, i) => (
                      <div key={i} className={`flex gap-2.5 ${msg.role === "patient" ? "flex-row-reverse" : ""}`}>
                        {/* Avatar */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                          msg.role === "ai" ? "bg-[#1a7f8a]/10 text-[#1a7f8a]" : "bg-gray-200 text-gray-600"
                        }`}>
                          {msg.role === "ai" ? "AI" : selected.name.split(" ")[0][0]}
                        </div>
                        <div className={`max-w-[75%] ${msg.role === "patient" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                          <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            msg.role === "ai"
                              ? "bg-[#1a7f8a]/8 text-gray-700 rounded-tl-sm"
                              : "bg-gray-100 text-gray-700 rounded-tr-sm"
                          }`}>
                            {msg.text}
                          </div>
                          <p className="text-[10px] text-gray-400 px-1">{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto px-5 py-4">
                    <div className="grid grid-cols-2 gap-3">
                      {selected.vitals.map((v) => (
                        <div key={v.label} className={`rounded-xl p-4 ${v.normal ? "bg-gray-50" : "bg-red-50 border border-red-100"}`}>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{v.label}</p>
                          <p className={`text-xl font-extrabold ${v.normal ? "text-gray-800" : "text-red-600"}`}>{v.value}</p>
                          <p className={`text-[11px] font-semibold mt-1 ${v.normal ? "text-emerald-600" : "text-red-500"}`}>
                            {v.normal ? "Normal" : "Abnormal"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Far right: quick info ── */}
            <div className="flex flex-col gap-4">
              {/* In-person check card */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-gray-900">In-Person Check</p>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  Call the patient in for a physical examination before finalizing the AI recommendation.
                </p>
                <button className="w-full h-10 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.08-.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Call Patient In
                </button>
              </div>

              {/* Patient info */}
              <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Patient Info</p>
                {[
                  { label: "Full Name", value: selected.name },
                  { label: "Age", value: `${selected.age} years` },
                  { label: "Gender", value: selected.gender },
                  { label: "Ticket ID", value: selected.ticketId },
                  { label: "Arrival", value: selected.arrivalTime },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{row.label}</span>
                    <span className="font-semibold text-gray-800">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Queue stats */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Queue Summary</p>
                {(["critical", "moderate", "mild"] as Severity[]).map((s) => {
                  const count = patients.filter((p) => p.severity === s).length;
                  const cfg = SEVERITY_CONFIG[s];
                  return (
                    <div key={s} className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      <span className="text-sm text-gray-500 capitalize flex-1">{s}</span>
                      <span className="text-sm font-bold text-gray-800">{count}</span>
                    </div>
                  );
                })}
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-sm">
                  <span className="text-gray-400">Approved today</span>
                  <span className="font-bold text-emerald-600">
                    {patients.filter((p) => p.status === "approved").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

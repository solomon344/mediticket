"use client";

import { useState, useEffect, useCallback } from "react";

interface QueueEntry {
  id: string;
  buyerName: string;
  buyerPhone: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  notes: string | null;
  ticketType: string;
  purchasedAt: string;
}

interface Stats {
  totalRevenue: number;
  issuedToday: number;
  cancelledToday: number;
  pendingCount: number;
}

interface TicketType {
  id: string;
  name: string;
  price: string | number;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-red-100 text-red-600",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Queued",
  COMPLETED: "Completed",
  FAILED: "Cancelled",
};

function PatientAvatar({ name }: { name: string }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-teal-100 text-teal-700",
    "bg-purple-100 text-purple-700",
    "bg-indigo-100 text-indigo-700",
    "bg-orange-100 text-orange-700",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${color}`}>
      {initials}
    </div>
  );
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function OfflineQueuePage() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [stats, setStats] = useState<Stats>({ totalRevenue: 0, issuedToday: 0, cancelledToday: 0, pendingCount: 0 });
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // form fields
  const [fName, setFName] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fTicketType, setFTicketType] = useState("");
  const [fNotes, setFNotes] = useState("");

  const fetchQueue = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const url = `/api/offline-queue${q ? `?search=${encodeURIComponent(q)}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setQueue(data.queue);
      setStats(data.stats);
    } catch {
      // silently keep previous data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  useEffect(() => {
    fetch("/api/ticket-types")
      .then((r) => r.json())
      .then((d) => setTicketTypes(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  function resetForm() {
    setFName("");
    setFPhone("");
    setFTicketType("");
    setFNotes("");
    setFormError(null);
    setFormSuccess(null);
  }

  function openForm() {
    resetForm();
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    if (!fName.trim()) { setFormError("Patient name is required."); return; }
    if (!fPhone.trim()) { setFormError("Phone number is required."); return; }
    if (!fTicketType) { setFormError("Please select a ticket type."); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/offline-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerName: fName, buyerPhone: fPhone, ticketTypeId: fTicketType, notes: fNotes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to add patient");
      setQueue((prev) => [data, ...prev]);
      setStats((prev) => ({ ...prev, issuedToday: prev.issuedToday + 1, pendingCount: prev.pendingCount + 1 }));
      setFormSuccess("Patient added to offline queue.");
      resetForm();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function updateStatus(id: string, status: "COMPLETED" | "FAILED") {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/offline-queue", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error();
      setQueue((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
      setStats((prev) => ({
        ...prev,
        pendingCount: Math.max(0, prev.pendingCount - 1),
        ...(status === "COMPLETED"
          ? { totalRevenue: prev.totalRevenue + (queue.find((e) => e.id === id)?.amount ?? 0) }
          : { cancelledToday: prev.cancelledToday + 1 }),
      }));
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  }

  const selectedTicketPrice = ticketTypes.find((t) => t.id === fTicketType);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[#1a7f8a] uppercase mb-1">
            Registration Hub
          </p>
          <h1 className="text-4xl font-extrabold text-gray-900">Walk-in Sales</h1>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 h-10 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M6 9V2h12v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="6" y="14" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="2" />
            </svg>
            Daily Report
          </button>
          <button
            type="button"
            onClick={openForm}
            className="flex items-center gap-2 px-4 h-10 rounded-xl bg-[#1a7f8a] text-white text-sm font-semibold hover:bg-[#156870] transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Issue Walk-in Ticket
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* ── Left: main content ─────────────────────────── */}
        <div className="flex flex-col gap-5">
          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cash Summary card */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-600">Today's Cash Summary</p>
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-1">Total revenue collected from offline walk-ins</p>
              <p className="text-3xl font-extrabold text-gray-900 tabular-nums mb-4">
                D {stats.totalRevenue.toLocaleString("en-GM", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-base font-semibold text-gray-400 ml-1">GMD</span>
              </p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Tickets Issued</p>
                  <p className="text-xl font-extrabold text-gray-900 tabular-nums">{String(stats.issuedToday).padStart(3, "0")}</p>
                </div>
                <div className="w-px h-8 bg-gray-100" />
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Cancelled</p>
                  <p className="text-xl font-extrabold text-red-500 tabular-nums">{String(stats.cancelledToday).padStart(2, "0")}</p>
                </div>
              </div>
            </div>

            {/* Queue metrics card */}
            <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-[#1a7f8a]/10 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8v4l3 3" stroke="#1a7f8a" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="12" cy="12" r="9" stroke="#1a7f8a" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Avg. Wait Time</p>
                    <p className="text-xl font-extrabold text-gray-900">~12 Mins</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="9" cy="7" r="4" stroke="#d97706" strokeWidth="2" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Currently Queued</p>
                  <p className="text-xl font-extrabold text-gray-900 tabular-nums">{String(stats.pendingCount).padStart(2, "0")} Patients</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search by patient name or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                fetchQueue(e.target.value);
              }}
              className="w-full bg-white rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm border border-gray-100 outline-none focus:ring-2 focus:ring-[#1a7f8a]/20 transition-all"
            />
          </div>

          {/* Queue table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">Walk-in Patient Queue</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Showing {queue.length} record{queue.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[2fr_1.4fr_1.4fr_1fr_1fr_88px] gap-3 px-6 py-3 bg-gray-50/70">
              {["Patient Name", "Phone Number", "Ticket Type", "Amount", "Status", "Actions"].map((h) => (
                <p key={h} className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">{h}</p>
              ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
                  <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#1a7f8a" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <p className="text-sm">Loading queue…</p>
                </div>
              ) : queue.length === 0 ? (
                <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.89 5.89l.95-.95a2 2 0 0 1 2.11-.45c.9.361 1.85.593 2.81.7A2 2 0 0 1 22 16.92z" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-sm font-medium">No walk-in patients yet</p>
                  <p className="text-xs text-center max-w-[240px]">
                    Patients who call, SMS, or walk in will appear here once issued a ticket.
                  </p>
                  <button
                    type="button"
                    onClick={openForm}
                    className="mt-1 px-4 py-2 bg-[#1a7f8a] text-white text-xs font-bold rounded-xl hover:bg-[#156870] transition-colors"
                  >
                    Issue First Ticket
                  </button>
                </div>
              ) : (
                queue.map((entry) => (
                  <div
                    key={entry.id}
                    className="grid grid-cols-[2fr_1.4fr_1.4fr_1fr_1fr_88px] gap-3 items-center px-6 py-4 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Patient */}
                    <div className="flex items-center gap-3 min-w-0">
                      <PatientAvatar name={entry.buyerName} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{entry.buyerName}</p>
                        <p className="text-[11px] text-gray-400">{formatDate(entry.purchasedAt)} · {formatTime(entry.purchasedAt)}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <p className="text-sm text-gray-600 font-medium">{entry.buyerPhone}</p>

                    {/* Ticket type */}
                    <p className="text-sm text-gray-700 font-medium truncate">{entry.ticketType}</p>

                    {/* Amount */}
                    <p className="text-sm font-bold text-[#1a7f8a] tabular-nums">
                      D {entry.amount.toFixed(2)}
                    </p>

                    {/* Status */}
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${STATUS_STYLES[entry.status]}`}>
                        {entry.status === "PENDING" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        )}
                        {STATUS_LABELS[entry.status]}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {entry.status === "PENDING" && (
                        <>
                          <button
                            type="button"
                            title="Mark Completed"
                            disabled={updatingId === entry.id}
                            onClick={() => updateStatus(entry.id, "COMPLETED")}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-40"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            title="Cancel"
                            disabled={updatingId === entry.id}
                            onClick={() => updateStatus(entry.id, "FAILED")}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </button>
                        </>
                      )}
                      {entry.status !== "PENDING" && (
                        <span className="text-[11px] text-gray-300 font-medium pl-1">—</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom status strip */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Pharmacy Queue", value: stats.pendingCount, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Triage Station", value: Math.max(0, stats.issuedToday - stats.cancelledToday), color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Cash Point", value: "Active", color: "text-[#1a7f8a]", bg: "bg-[#1a7f8a]/10" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl shadow-sm px-4 py-3 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-xs font-extrabold ${item.color}`}>{item.value}</span>
                </div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Issue ticket form ────────────────────── */}
        {showForm && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1a7f8a]/10 flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.89 5.89l.95-.95a2 2 0 0 1 2.11-.45c.9.361 1.85.593 2.81.7A2 2 0 0 1 22 16.92z" stroke="#1a7f8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Issue Walk-in Ticket</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Register patient for offline queue</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {formError && (
                  <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 font-medium">
                    {formError}
                  </div>
                )}
                {formSuccess && (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-700 font-medium">
                    {formSuccess}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Patient Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Modou Aliou Jallow"
                    value={fName}
                    onChange={(e) => setFName(e.target.value)}
                    className="w-full bg-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#1a7f8a]/30 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +220 000 0000"
                    value={fPhone}
                    onChange={(e) => setFPhone(e.target.value)}
                    className="w-full bg-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#1a7f8a]/30 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Ticket Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={fTicketType}
                    onChange={(e) => setFTicketType(e.target.value)}
                    className="w-full bg-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#1a7f8a]/30 transition-all appearance-none"
                  >
                    <option value="">Select a service…</option>
                    {ticketTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} — D {Number(t.price).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedTicketPrice && (
                  <div className="flex items-center justify-between bg-[#1a7f8a]/5 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-500 font-medium">Amount to collect at entrance</p>
                    <p className="text-base font-extrabold text-[#1a7f8a]">
                      D {Number(selectedTicketPrice.price).toFixed(2)}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Notes <span className="text-gray-300">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Patient called via SMS, requested morning slot..."
                    value={fNotes}
                    onChange={(e) => setFNotes(e.target.value)}
                    className="w-full rounded-xl bg-gray-100 px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 resize-none outline-none focus:ring-2 focus:ring-[#1a7f8a]/30 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-[#1a7f8a] text-white font-bold rounded-xl h-12 text-sm hover:bg-[#156870] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    ) : null}
                    Add to Queue
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="w-full h-10 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            {/* Info box */}
            <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#1a7f8a]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p className="text-sm font-bold">Offline Booking Flow</p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Patients without smartphones can call or send SMS to the hospital number. Staff registers them here and they pay at the entrance cash point.
              </p>
              <div className="flex flex-col gap-2 mt-1">
                {["Patient calls or sends SMS", "Staff issues ticket here", "Patient pays at entrance", "Status marked Completed"].map((step, i) => (
                  <div key={step} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#1a7f8a]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-[#1a7f8a]">{i + 1}</span>
                    </div>
                    <p className="text-xs text-gray-600">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

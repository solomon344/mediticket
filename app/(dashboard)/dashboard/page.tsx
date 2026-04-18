import Link from "next/link";

const recentActivity = [
  {
    initials: "EM",
    color: "bg-blue-100 text-blue-700",
    name: "Emergency Dept Admission",
    id: "#88219",
    time: "12:45 PM, Today",
    status: "PROCESSED",
    amount: "D 450.00",
  },
  {
    initials: "RT",
    color: "bg-purple-100 text-purple-700",
    name: "Routine Consultation",
    id: "#88218",
    time: "11:30 AM, Today",
    status: "PENDING",
    amount: "D 85.00",
  },
  {
    initials: "LB",
    color: "bg-green-100 text-green-700",
    name: "Lab Work: Panel B",
    id: "#88217",
    time: "10:15 AM, Today",
    status: "PROCESSED",
    amount: "D 210.00",
  },
  {
    initials: "SP",
    color: "bg-orange-100 text-orange-700",
    name: "Specialized Surgery",
    id: "#88216",
    time: "09:00 AM, Today",
    status: "DECLINED",
    amount: "D 2,400.00",
  },
];

const statusStyles: Record<string, string> = {
  PROCESSED: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-gray-100 text-gray-600",
  DECLINED: "text-red-600 font-semibold",
};

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Page heading */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-[#1a7f8a] uppercase mb-1">
          Clinical Oversight
        </p>
        <h1 className="text-4xl font-extrabold text-gray-900">Administrative Dashboard</h1>
      </div>

      {/* ── Stats row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total Tickets Sold */}
        <div className="col-span-1 md:col-span-1 bg-white rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Tickets Sold</p>
              <p className="text-4xl font-extrabold text-gray-900 tracking-tight">12,482</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 9a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9z" stroke="#9ca3af" strokeWidth="2" />
                <circle cx="7" cy="12" r="1.5" fill="#9ca3af" />
                <circle cx="17" cy="12" r="1.5" fill="#9ca3af" />
                <path d="M10 12h4" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-[#1a7f8a] font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            12% Increase from last month
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
          <p className="text-sm text-gray-500">Monthly Revenue</p>
          <p className="text-3xl font-extrabold text-gray-900 tracking-tight">D 42,910.00</p>
          <div className="space-y-1.5">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#1a7f8a] rounded-full w-[78%]" />
            </div>
            <p className="text-xs text-gray-400">78% of Monthly Goal reached</p>
          </div>
        </div>

        {/* Active Admissions */}
        <div className="bg-white rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
          <div className="flex items-start justify-between">
            <p className="text-sm text-gray-500">Active Admissions</p>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                <circle cx="9" cy="7" r="4" stroke="#3b82f6" strokeWidth="2" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-extrabold text-gray-900 tracking-tight">1,102</p>
          <p className="text-sm text-[#1a7f8a] font-medium cursor-pointer hover:underline">Real-time status</p>
        </div>
      </div>

      {/* ── Bottom row ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Operations */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 className="text-base font-bold text-gray-900">Quick Operations</h2>
          </div>

          <div className="flex flex-col gap-3">
            {/* Add Ticket Type */}
            <Link
              href="/ticket-types/new"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#1a7f8a]/30 hover:bg-[#1a7f8a]/5 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-[#1a7f8a] flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-[#1a7f8a] transition-colors">
                Add Ticket Type
              </span>
            </Link>

            {/* Manage Payment Options */}
            <Link
              href="/payment-methods"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#1a7f8a]/30 hover:bg-[#1a7f8a]/5 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-[#1a7f8a]/10 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="3" stroke="#1a7f8a" strokeWidth="2" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="#1a7f8a" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-[#1a7f8a] transition-colors">
                Manage Payment Options
              </span>
            </Link>

            {/* View Purchases */}
            <Link
              href="/purchase-history"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#1a7f8a]/30 hover:bg-[#1a7f8a]/5 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-[#1a7f8a]/10 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#1a7f8a" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" stroke="#1a7f8a" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-[#1a7f8a] transition-colors">
                View Purchases
              </span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8v4l3 3" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="9" stroke="#6b7280" strokeWidth="2" />
              </svg>
              <h2 className="text-base font-bold text-gray-900">Recent Activity</h2>
            </div>
            <button type="button" className="text-sm text-[#1a7f8a] font-medium hover:underline">
              Download Log
            </button>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-2 pb-2 border-b border-gray-100">
            {["Activity", "Timestamp", "Status", "Amount"].map((col) => (
              <p key={col} className="text-xs font-semibold text-gray-400 uppercase tracking-wider last:text-right">
                {col}
              </p>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-50">
            {recentActivity.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center py-3 px-2"
              >
                {/* Activity */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${row.color}`}>
                    {row.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{row.name}</p>
                    <p className="text-xs text-gray-400">{row.id}</p>
                  </div>
                </div>

                {/* Timestamp */}
                <p className="text-xs text-gray-500 whitespace-nowrap">{row.time}</p>

                {/* Status */}
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md whitespace-nowrap ${
                    row.status === "DECLINED"
                      ? "text-red-600"
                      : statusStyles[row.status] ?? ""
                  }`}
                >
                  {row.status}
                </span>

                {/* Amount */}
                <p className="text-sm font-semibold text-gray-800 text-right whitespace-nowrap">{row.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

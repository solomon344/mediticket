export default function PurchaseHistoryPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-[#1a7f8a] uppercase mb-1">
          Records
        </p>
        <h1 className="text-4xl font-extrabold text-gray-900">Purchase History</h1>
      </div>
      <div className="bg-white rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#1a7f8a]/10 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8v4l3 3" stroke="#1a7f8a" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="9" stroke="#1a7f8a" strokeWidth="2" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-gray-700">Purchase History — coming soon</p>
        <p className="text-sm text-gray-400 max-w-sm">
          View all ticket purchases across your hospital with filters and export.
        </p>
      </div>
    </div>
  );
}

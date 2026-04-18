export default function SettingsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-[#1a7f8a] uppercase mb-1">
          Account
        </p>
        <h1 className="text-4xl font-extrabold text-gray-900">Settings</h1>
      </div>
      <div className="bg-white rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#1a7f8a]/10 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3" stroke="#1a7f8a" strokeWidth="2" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="#1a7f8a" strokeWidth="2" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-gray-700">Settings — coming soon</p>
        <p className="text-sm text-gray-400 max-w-sm">
          Manage your hospital profile, account preferences, and security settings.
        </p>
      </div>
    </div>
  );
}

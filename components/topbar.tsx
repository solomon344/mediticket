"use client";

import { Input } from "@heroui/react";

export function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 gap-4 flex-shrink-0">
      {/* Logo */}
      <span className="text-[#1a7f8a] font-bold text-xl mr-2 w-44 flex-shrink-0">Medic Ticket</span>

      {/* Search */}
      <div className="flex-1 max-w-xl">
        <Input
          placeholder="Search medical records, tickets..."
          startContent={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          }
          classNames={{
            inputWrapper: "bg-gray-100 border-0 shadow-none data-[hover=true]:bg-gray-100 group-data-[focus=true]:bg-gray-100 h-9",
            input: "text-sm text-gray-700 placeholder:text-gray-400",
          }}
        />
      </div>

      {/* Icons */}
      <div className="flex items-center gap-3 ml-auto">
        <button className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors relative">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* User profile */}
      <div className="flex items-center gap-3 pl-3 border-l border-gray-100">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-900 leading-tight">Dr. Aris Thorne</p>
          <p className="text-xs text-gray-400">Chief Administrator</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#1a7f8a]/20 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#1a7f8a" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="7" r="4" stroke="#1a7f8a" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </header>
  );
}

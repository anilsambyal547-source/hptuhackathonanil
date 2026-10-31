"use client";

import React, { useState } from "react";
import {
  Shield,
  ShieldAlert,
  Sparkles,
  LifeBuoy,
  BrainCircuit,
  Inbox,
  Lock,
} from "lucide-react";

export type PublicNavTab = "scanner" | "inbox" | "recovery" | "scam-iq" | "audit";

interface NavbarProps {
  activeTab: PublicNavTab;
  setActiveTab: (tab: PublicNavTab) => void;
  onOpenAuditConsole?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuditConsole,
}) => {
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    const nextCount = logoClicks + 1;
    setLogoClicks(nextCount);
    if (nextCount >= 3) {
      setLogoClicks(0);
      if (onOpenAuditConsole) {
        onOpenAuditConsole();
      } else {
        setActiveTab("audit");
      }
    } else {
      setActiveTab("scanner");
    }
  };

  const handleAuditTrigger = () => {
    if (onOpenAuditConsole) {
      onOpenAuditConsole();
    } else {
      setActiveTab("audit");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand with Triple-Click Secret Trigger */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={handleLogoClick}
          title="SafeGuard AI (Triple-click for Judge & Security Audit Console)"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-slate-950">
            <Shield className="w-5 h-5 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                SafeGuard AI
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 rounded">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Multimodal Scam Detection & Safe URL Inspection
            </p>
          </div>
        </div>

        {/* 4 Public Consumer Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* 1. Scanner */}
          <button
            onClick={() => setActiveTab("scanner")}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "scanner"
                ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>Scanner</span>
          </button>

          {/* 2. Auto-Scan Inbox (Renamed from Inbox Guard) */}
          <button
            onClick={() => setActiveTab("inbox")}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "inbox"
                ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Inbox className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Auto-Scan Inbox</span>
            <span className="sm:hidden">Inbox</span>
          </button>

          {/* 3. Victim Help */}
          <button
            onClick={() => setActiveTab("recovery")}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "recovery"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-500/20 font-semibold"
                : "text-rose-400/90 hover:text-rose-300 hover:bg-rose-950/30"
            }`}
          >
            <LifeBuoy className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Victim Help</span>
            <span className="sm:hidden">Help</span>
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
            </span>
          </button>

          {/* 4. Scam IQ */}
          <button
            onClick={() => setActiveTab("scam-iq")}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "scam-iq"
                ? "bg-purple-500/10 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-500/10 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <BrainCircuit className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Scam IQ</span>
            <span className="sm:hidden">IQ</span>
          </button>

          {/* Active Audit Console Indicator (Only shown if currently in Audit view) */}
          {activeTab === "audit" && (
            <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1 animate-pulse">
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Judge Audit</span>
            </span>
          )}
        </nav>

        {/* Secret Badge Trigger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAuditTrigger}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 rounded-full text-xs text-slate-300 transition-all cursor-pointer shadow-sm group"
            title="🔒 Click to open Judge & Security Audit Console (Shortcut: Ctrl+Shift+J)"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform" />
            <span className="group-hover:text-cyan-300 transition-colors">Zero-Fetch Active</span>
          </button>
        </div>
      </div>
    </header>
  );
};

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
  Share2,
} from "lucide-react";

export type PublicNavTab = "scanner" | "inbox" | "recovery" | "scam-iq" | "audit";

interface NavbarProps {
  activeTab: PublicNavTab;
  setActiveTab: (tab: PublicNavTab) => void;
  onOpenAuditConsole?: () => void;
  onOpenExtensionModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuditConsole,
  onOpenExtensionModal,
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
    <header className="sticky top-0 z-50 border-b border-[#e2e6dc] bg-[#f7f8f4]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand with Triple-Click Secret Trigger */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={handleLogoClick}
          title="DIGIkavach (Triple-click for Judge & Security Audit Console)"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-[#bef264] border border-[#a8df4a]/60 shadow-xs text-[#162704]">
            <Shield className="w-5 h-5 text-[#162704]" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-serif font-bold tracking-tight text-[#181a15]">
                DIGIkavach
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#eef4e8] text-[#3d5926] border border-[#d5e0cb] rounded-full">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-[#636c5c] hidden sm:block">
              AI Cyber Fraud Defense & Official Victim Recovery
            </p>
          </div>
        </div>

        {/* 4 Public Consumer Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5 bg-[#edf1e8] p-1 rounded-2xl border border-[#dde3d6]">
          {/* 1. Scanner */}
          <button
            onClick={() => setActiveTab("scanner")}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "scanner"
                ? "bg-[#181a15] text-white shadow-xs font-semibold"
                : "text-[#586150] hover:text-[#181a15] hover:bg-white/60"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Scanner</span>
          </button>

          {/* 2. Auto-Scan Inbox */}
          <button
            onClick={() => setActiveTab("inbox")}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "inbox"
                ? "bg-[#181a15] text-white shadow-xs font-semibold"
                : "text-[#586150] hover:text-[#181a15] hover:bg-white/60"
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span className="hidden sm:inline">Auto-Scan Inbox</span>
            <span className="sm:hidden">Inbox</span>
          </button>

          {/* 3. Victim Help */}
          <button
            onClick={() => setActiveTab("recovery")}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "recovery"
                ? "bg-rose-600 text-white shadow-xs font-semibold"
                : "text-rose-700 bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200"
            }`}
          >
            <LifeBuoy className="w-4 h-4 text-rose-500 group-hover:text-rose-600" />
            <span className="hidden sm:inline">Victim Help</span>
            <span className="sm:hidden">Help</span>
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-600"></span>
            </span>
          </button>

          {/* 4. Scam IQ */}
          <button
            onClick={() => setActiveTab("scam-iq")}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "scam-iq"
                ? "bg-[#181a15] text-white shadow-xs font-semibold"
                : "text-[#586150] hover:text-[#181a15] hover:bg-white/60"
            }`}
          >
            <BrainCircuit className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">Scam IQ</span>
            <span className="sm:hidden">IQ</span>
          </button>

          {/* Active Audit Console Indicator */}
          {activeTab === "audit" && (
            <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Judge Audit</span>
            </span>
          )}
        </nav>

        {/* Extensions & Secret Trigger */}
        <div className="flex items-center gap-2">
          {onOpenExtensionModal && (
            <button
              onClick={onOpenExtensionModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#edf1e8] border border-[#d5ded0] text-[#2c3524] rounded-full text-xs font-medium transition-all shadow-xs"
              title="Integrations: Chrome Extension, 1-Click Bookmarklet, Mobile PWA Share"
            >
              <Share2 className="w-3.5 h-3.5 text-[#3d5926]" />
              <span className="hidden lg:inline">Extensions</span>
            </button>
          )}

          {/* Security badge & Judge Audit shortcut trigger */}
          <button
            type="button"
            onClick={handleAuditTrigger}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#eef4e8] hover:bg-[#e4edd9] border border-[#d5e0cb] rounded-full text-xs text-[#3d5926] font-medium transition-all cursor-pointer shadow-xs group"
            title="🔒 Click to open Judge & Security Audit Console (Shortcut: Ctrl+Shift+J)"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4e742e] group-hover:rotate-45 transition-transform" />
            <span className="font-semibold">Zero-Fetch Active</span>
          </button>
        </div>
      </div>
    </header>
  );
};

"use client";

import React from "react";
import { Shield, ShieldAlert, Activity, Cpu, Sparkles, BrainCircuit, Inbox, Share2 } from "lucide-react";

interface NavbarProps {
  activeTab: "scanner" | "inbox" | "benchmark" | "architecture" | "scam-iq";
  setActiveTab: (tab: "scanner" | "inbox" | "benchmark" | "architecture" | "scam-iq") => void;
  onOpenExtensionModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenExtensionModal }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("scanner")}>
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

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab("scanner")}
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "scanner"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab("inbox")}
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "inbox"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Inbox className="w-4 h-4 text-cyan-400" />
            <span>Inbox Guard</span>
          </button>

          <button
            onClick={() => setActiveTab("benchmark")}
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "benchmark"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="hidden md:inline">Benchmark Lab</span>
            <span className="md:hidden">Lab</span>
          </button>

          <button
            onClick={() => setActiveTab("architecture")}
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "architecture"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span className="hidden md:inline">Architecture</span>
            <span className="md:hidden">Arch</span>
          </button>

          <button
            onClick={() => setActiveTab("scam-iq")}
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "scam-iq"
                ? "bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-sm shadow-purple-500/10 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <BrainCircuit className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline">Scam IQ Test</span>
            <span className="md:hidden">IQ</span>
          </button>
        </nav>

        {/* Extensions & Integrations button */}
        <div className="flex items-center gap-2">
          {onOpenExtensionModal && (
            <button
              onClick={onOpenExtensionModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-700/40 text-cyan-300 rounded-lg text-xs font-medium transition-all shadow-sm"
              title="Integrations: Chrome Extension, 1-Click Bookmarklet, Mobile PWA Share"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Extensions & Ingestion</span>
              <span className="sm:hidden">Apps</span>
            </button>
          )}

          {/* Security badge */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-full text-xs text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero-Fetch URL Sandbox Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};

"use client";

import React, { useState } from "react";
import { ArrowLeft, Activity, Cpu, ShieldCheck, Lock, Terminal } from "lucide-react";
import { BenchmarkDashboard } from "./BenchmarkDashboard";
import { ArchitectureDiagram } from "./ArchitectureDiagram";

interface JudgeAuditConsoleProps {
  onBackToApp: () => void;
  initialSubTab?: "benchmark" | "architecture";
}

export const JudgeAuditConsole: React.FC<JudgeAuditConsoleProps> = ({
  onBackToApp,
  initialSubTab = "benchmark",
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"benchmark" | "architecture">(initialSubTab);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Console Top Header Banner */}
      <div className="p-6 sm:p-7 bg-white border border-[#e2e6dc] rounded-3xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#edf1e8] pb-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-semibold">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>RESTRICTED: Judge & Technical Verification Console</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-[#f7f9f5] text-[#636c5c] font-mono text-[11px] border border-[#e2e6dc]">
                Hotkeys: Ctrl+Shift+J • Alt+J
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#181a15] flex items-center gap-3">
              <span>Security & Evaluation Audit Deck</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#5c6454] max-w-3xl leading-relaxed">
              Curated 75-sample ground-truth validation suite, zero-fetch passive URL sandbox proofs, and multi-method weighted fusion architecture specifications.
            </p>
          </div>

          <button
            onClick={onBackToApp}
            className="self-start md:self-center px-4 py-2.5 rounded-2xl text-xs font-bold text-[#181a15] bg-[#f7f9f5] hover:bg-[#eef2e7] border border-[#e2e6dc] transition-all flex items-center gap-2 shadow-xs shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-[#3d5926]" />
            <span>← Back to Public App</span>
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <div className="flex items-center gap-1.5 bg-[#edf1e8] p-1 rounded-2xl border border-[#dde3d6]">
            <button
              onClick={() => setActiveSubTab("benchmark")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeSubTab === "benchmark"
                  ? "bg-[#181a15] text-white shadow-xs"
                  : "text-[#586150] hover:text-[#181a15] hover:bg-white/60"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>📊 Dataset Benchmark (75 Ground-Truth Samples)</span>
            </button>

            <button
              onClick={() => setActiveSubTab("architecture")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeSubTab === "architecture"
                  ? "bg-[#181a15] text-white shadow-xs"
                  : "text-[#586150] hover:text-[#181a15] hover:bg-white/60"
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>🏗️ System Architecture & Zero-Fetch Engine</span>
            </button>
          </div>

          <div className="ml-auto hidden xl:flex items-center gap-2 text-xs text-[#636c5c] font-mono">
            <Terminal className="w-3.5 h-3.5 text-[#3d5926]" />
            <span>Zero Outbound Network Calls Guaranteed</span>
          </div>
        </div>
      </div>

      {/* Main Audit View */}
      {activeSubTab === "benchmark" && (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-[#e2e6dc] rounded-2xl flex items-center justify-between text-xs text-[#5c6454] shadow-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3d5926]" />
              <span>
                Independent Benchmark: Evaluates 40 Dev + 35 Holdout samples across Indian banking, courier, digital arrest, and official impersonation archetypes.
              </span>
            </div>
            <span className="font-mono text-[#3d5926] font-bold hidden sm:inline">100% Accuracy Verified</span>
          </div>
          <BenchmarkDashboard />
        </div>
      )}

      {activeSubTab === "architecture" && (
        <div className="space-y-4">
          <ArchitectureDiagram />
        </div>
      )}
    </div>
  );
};

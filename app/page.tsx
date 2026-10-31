"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ScannerInput } from "@/components/ScannerInput";
import { PaginatedResultDeck } from "@/components/PaginatedResultDeck";
import { JudgeAuditConsole } from "@/components/JudgeAuditConsole";
import { VictimRecoveryDashboard } from "@/components/VictimAssistance/VictimRecoveryDashboard";
import { ScamIqSuite } from "@/components/scam-iq/ScamIqSuite";
import { LiveInboxSimulator } from "@/components/LiveInboxSimulator";
import { mapAnalysisResultToCategory } from "@/lib/data/scam-routing";
import { ScamCategoryType } from "@/lib/types/recovery";
import { ScamAnalysisResult, OcrQualityReport } from "@/lib/types";
import { Shield, Lock, PhoneCall, Sparkles } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "scanner" | "inbox" | "recovery" | "scam-iq" | "audit"
  >("scanner");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ScamAnalysisResult | null>(null);

  // Keyboard shortcut listener: Ctrl+Shift+J or Alt+J toggles the Judge Audit Console
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j")) ||
        (e.altKey && (e.key === "J" || e.key === "j"))
      ) {
        e.preventDefault();
        setActiveTab((prev) => (prev === "audit" ? "scanner" : "audit"));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Victim assistance prefilled context
  const [importedCategory, setImportedCategory] = useState<ScamCategoryType>("banking_upi");
  const [prefilledUrl, setPrefilledUrl] = useState<string>("");
  const [prefilledText, setPrefilledText] = useState<string>("");
  const [isAiImported, setIsAiImported] = useState<boolean>(false);

  const handleOpenRecoveryAssistant = () => {
    if (analysisResult) {
      const detectedCat = mapAnalysisResultToCategory(analysisResult);
      setImportedCategory(detectedCat);
      setPrefilledUrl(analysisResult.urlReports[0]?.originalUrl || "");
      setPrefilledText(analysisResult.inputText);
      setIsAiImported(true);
    }
    setActiveTab("recovery");
  };

  const handleAnalyze = async (
    text: string,
    inputType: "text" | "ocr_screenshot" | "email_eml" = "text",
    ocrQuality?: OcrQualityReport
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          inputType,
          ocrQuality,
        }),
      });

      if (!res.ok) {
        throw new Error(`Analysis failed with status ${res.status}`);
      }

      const data: ScamAnalysisResult = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error("Analysis invocation failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for query params from PWA Web Share Target, Chrome Extension, or 1-Click Bookmarklet (?text=... or ?url=...)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const incomingText = params.get("text") || params.get("url") || params.get("title");
      if (incomingText) {
        handleAnalyze(incomingText);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-[#181a15] bg-[#f7f8f4]">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuditConsole={() => setActiveTab("audit")}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeTab === "scanner" && (
          <div className="space-y-8">
            {/* DIGIkavach Hero Header & Centralized macOS Dock */}
            <div className="text-center max-w-3xl mx-auto space-y-4 pt-2 pb-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eef4e8] border border-[#d5e0cb] text-[#3d5926] text-xs font-medium shadow-xs">
                <Shield className="w-3.5 h-3.5 text-[#4e742e]" />
                <span>Next-Gen Scam Defence & Forensics System</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[#161a12]">
                DIGIkavach
              </h1>
              <p className="text-sm sm:text-base text-[#5c6454] max-w-xl mx-auto leading-relaxed">
                Zero-trust evidentiary threat analysis for SMS, WhatsApp alerts, deceptive links, and spoofed emails.
              </p>

              {/* Primary macOS Segmented Navigation Dock directly under DIGIkavach */}
              <div className="flex items-center justify-center pt-2">
                <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                  {[
                    { id: "scanner" as const, label: "Scanner", icon: Shield },
                    { id: "inbox" as const, label: "Auto-Scan Inbox", icon: Sparkles },
                    { id: "recovery" as const, label: "Victim Help", icon: PhoneCall },
                    { id: "scam-iq" as const, label: "Scam IQ", icon: Lock },
                  ].map((btn) => {
                    const Icon = btn.icon;
                    const isSelected = (activeTab as string) === btn.id;
                    return (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => setActiveTab(btn.id)}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                          isSelected
                            ? "bg-[#181a15] text-white shadow-xs"
                            : "text-[#586150] hover:text-[#181a15] hover:bg-[#f4f7f1]"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected && btn.id === "scanner" ? "text-[#bef264]" : ""}`} />
                        <span>{btn.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Input Component */}
            <ScannerInput onAnalyze={handleAnalyze} isLoading={isLoading} />

            {/* Paginated 1-at-a-Time macOS Result Deck (Eliminating Long Vertical Scroll) */}
            {analysisResult && (
              <div className="pt-2 animate-in fade-in duration-300">
                <PaginatedResultDeck
                  analysisResult={analysisResult}
                  onOpenRecoveryAssistant={handleOpenRecoveryAssistant}
                  onReset={() => setAnalysisResult(null)}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "inbox" && <LiveInboxSimulator />}

        {activeTab === "recovery" && (
          <VictimRecoveryDashboard
            initialCategory={importedCategory}
            prefilledUrl={prefilledUrl}
            prefilledText={prefilledText}
            isAiImported={isAiImported}
            onBackToScanner={() => setActiveTab("scanner")}
          />
        )}

        {activeTab === "scam-iq" && <ScamIqSuite />}

        {activeTab === "audit" && (
          <JudgeAuditConsole onBackToApp={() => setActiveTab("scanner")} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e2e6dc] bg-white/70 py-8 text-xs text-[#636c5c] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#3d5926]" />
              <span className="font-medium text-[#181a15]">SafeGuard AI</span>
              <span>• Built for Cybersecurity Scam Detection & Recovery</span>
            </div>
            <span className="hidden sm:inline text-[#ccd4c4]">•</span>
            <button
              type="button"
              onClick={() => setActiveTab("audit")}
              className="text-[11px] text-[#636c5c] hover:text-[#181a15] font-mono transition-colors flex items-center gap-1.5"
              title="Open Judge & Benchmark Audit Console (Ctrl+Shift+J)"
            >
              <span>🔒 Judge / Benchmark Audit Console (Ctrl+Shift+J)</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-mono text-xs font-semibold">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Helpline: 1930</span>
            </span>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3d5926] font-medium hover:underline hover:text-[#253915]"
            >
              cybercrime.gov.in
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

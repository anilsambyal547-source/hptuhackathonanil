"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ScannerInput } from "@/components/ScannerInput";
import { RiskMeter } from "@/components/RiskMeter";
import { MultiEngineBreakdown } from "@/components/MultiEngineBreakdown";
import { UncertaintyBanner } from "@/components/UncertaintyBanner";
import { EvidenceHighlighter } from "@/components/EvidenceHighlighter";
import { SafeUrlInspectorCard } from "@/components/SafeUrlInspectorCard";
import { ActionStepsCard } from "@/components/ActionStepsCard";
import { JudgeAuditConsole } from "@/components/JudgeAuditConsole";
import { VictimRecoveryDashboard } from "@/components/VictimAssistance/VictimRecoveryDashboard";
import { ScamIqSuite } from "@/components/scam-iq/ScamIqSuite";
import { LiveInboxSimulator } from "@/components/LiveInboxSimulator";
import { EmailForensicsCard } from "@/components/EmailForensicsCard";
import { TacticsRadarCard } from "@/components/TacticsRadarCard";
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
            {/* Hero Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eef4e8] border border-[#d5e0cb] text-[#3d5926] text-xs font-medium shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#4e742e]" />
                <span>Multimodal OCR + Safe Passive URL Sandbox + Transparent AI</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-[#161a12]">
                Scan Suspicious Messages with Evidentiary Proof
              </h1>
              <p className="text-sm sm:text-base text-[#5c6454] leading-relaxed">
                Analyze SMS, WhatsApp alerts, screenshot captures, and deceptive links without visiting them. Get an explainable, plain-language breakdown of psychological pressure and credential theft vectors.
              </p>
            </div>

            {/* Input Component */}
            <ScannerInput onAnalyze={handleAnalyze} isLoading={isLoading} />

            {/* Analysis Results View */}
            {analysisResult && (
              <div className="space-y-6 pt-4 animate-in fade-in duration-500">
                {/* Visual Risk Gauge & Attribution */}
                <RiskMeter
                  overallRisk={analysisResult.overallRisk}
                  riskScore={analysisResult.riskScore}
                  breakdown={analysisResult.metricsBreakdown}
                />

                {/* 4-Engine Multi-Method Detection Breakdown */}
                <MultiEngineBreakdown
                  metricsBreakdown={analysisResult.metricsBreakdown}
                  heuristicsHits={analysisResult.heuristicsHits}
                  urlReports={analysisResult.urlReports}
                  impersonationMatch={analysisResult.impersonationMatch}
                  aiAnalysis={analysisResult.aiAnalysis}
                  confidencePercent={analysisResult.uncertainty.confidencePercent}
                />

                {/* Calibrated Uncertainty Banner */}
                <UncertaintyBanner uncertainty={analysisResult.uncertainty} />

                {/* Email Header & Authentication Forensics (when applicable) */}
                {analysisResult.emailForensics && (
                  <EmailForensicsCard emailForensics={analysisResult.emailForensics} />
                )}

                {/* 5-Axis Psychological Manipulation Radar */}
                {analysisResult.tacticsBreakdown && (
                  <TacticsRadarCard tactics={analysisResult.tacticsBreakdown} />
                )}

                {/* Evidentiary Highlighting Spans */}
                <EvidenceHighlighter
                  text={analysisResult.inputText}
                  spans={analysisResult.evidenceSpans}
                />

                {/* Safe Passive URL Sandbox Findings */}
                <SafeUrlInspectorCard urlReports={analysisResult.urlReports} />

                {/* Plain-Language Assessment & Action Steps + Forensic Export + Victim Help */}
                <ActionStepsCard
                  actionSteps={analysisResult.actionSteps}
                  plainLanguageSummary={analysisResult.plainLanguageSummary}
                  fullResult={analysisResult}
                  onOpenAssistance={handleOpenRecoveryAssistant}
                />

                {/* Safety & Compliance Disclaimer */}
                <div className="p-4 bg-white border border-[#e2e6dc] rounded-2xl text-xs text-[#5c6454] leading-relaxed flex items-start gap-2.5 shadow-xs">
                  <Shield className="w-4 h-4 text-[#3d5926] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#181a15]">Security & Privacy Guarantee: </span>
                    {analysisResult.disclaimer}
                  </div>
                </div>
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

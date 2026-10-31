"use client";

import React, { useMemo } from "react";
import { X, ShieldAlert, ShieldCheck, AlertTriangle, Activity, Sparkles, PhoneCall } from "lucide-react";
import { runHeuristics } from "@/lib/engine/heuristics";
import { inspectUrlsPassively } from "@/lib/engine/passive-url";
import { detectImpersonation } from "@/lib/engine/impersonation";
import { fuseAnalysisResults } from "@/lib/engine/fusion";
import { HeuristicHit, UrlInspectionReport } from "@/lib/types";

interface EngineInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageText: string;
  sourceTitle: string;
}

export const EngineInspectionModal: React.FC<EngineInspectionModalProps> = ({
  isOpen,
  onClose,
  messageText,
  sourceTitle,
}) => {
  const analysis = useMemo(() => {
    if (!messageText) return null;
    const sanitizedText = messageText.trim();
    const heuristics = runHeuristics(sanitizedText);
    const urlReports = inspectUrlsPassively(sanitizedText);
    const detectedDomains = urlReports.reports
      .map((r) => r.domain || r.normalizedDomain)
      .filter((d): d is string => Boolean(d));
    const impersonation = detectImpersonation(sanitizedText, detectedDomains);
    const fused = fuseAnalysisResults({
      heuristics,
      urlReports,
      impersonation,
      aiAnalysis: null,
      inputText: sanitizedText,
    });

    return {
      heuristics,
      urlReports,
      impersonation,
      fused,
    };
  }, [messageText]);

  if (!isOpen || !analysis) return null;

  const { heuristics, urlReports, impersonation, fused } = analysis;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "high":
        return {
          bg: "bg-rose-50",
          border: "border-rose-200",
          text: "text-rose-800",
          badge: "bg-rose-600 text-white",
          icon: <ShieldAlert className="w-6 h-6 text-rose-600" />,
        };
      case "suspicious":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-800",
          badge: "bg-amber-600 text-white",
          icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
        };
      default:
        return {
          bg: "bg-[#eef5e6]",
          border: "border-[#d5e0cb]",
          text: "text-[#3d5926]",
          badge: "bg-[#bef264] text-[#162704]",
          icon: <ShieldCheck className="w-6 h-6 text-[#5c8a27]" />,
        };
    }
  };

  const style = getTierColor(fused.overallRisk);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181a15]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white border border-[#e2e6dc] rounded-3xl shadow-2xl overflow-hidden text-[#181a15]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e2e6dc] bg-[#f7f9f5]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#eef5e6] border border-[#d5e0cb] text-[#3d5926]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#3d5926] font-semibold">
                  SafeGuard AI Engine Diagnostic
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#eef5e6] border border-[#d5e0cb] text-[#3d5926]">
                  Deterministic Core
                </span>
              </div>
              <h3 className="font-serif text-sm font-bold text-[#181a15] truncate max-w-sm">{sourceTitle}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#717a69] hover:text-[#181a15] hover:bg-[#eef2e7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 text-xs text-[#383d33]">
          {/* Target Message Preview */}
          <div className="p-3.5 bg-[#f7f9f5] rounded-2xl border border-[#e2e6dc] font-mono text-xs text-[#181a15] whitespace-pre-wrap leading-relaxed">
            <div className="text-[10px] text-[#717a69] uppercase font-sans tracking-wider pb-1 mb-1 border-b border-[#e2e6dc]">
              Evaluated Input Payload
            </div>
            {messageText}
          </div>

          {/* Core Score Banner */}
          <div className={`p-4 rounded-2xl border ${style.bg} ${style.border} flex items-center justify-between gap-4 shadow-xs`}>
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-white border border-[#e2e6dc]">
                {style.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${style.badge}`}>
                    {fused.overallRisk.toUpperCase()} RISK
                  </span>
                  <span className="font-mono text-xs text-[#636c5c]">
                    Confidence: {fused.uncertainty.confidencePercent}%
                  </span>
                </div>
                <p className="text-xs text-[#383d33] pt-1 leading-snug">
                  {fused.plainLanguageSummary}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-serif font-bold text-[#181a15]">
                {fused.riskScore}
                <span className="text-xs text-[#717a69] font-light">/100</span>
              </div>
              <span className="text-[10px] text-[#717a69] font-mono uppercase">Risk Score</span>
            </div>
          </div>

          {/* Signal Breakdown Cards */}
          <div className="space-y-3">
            {/* Heuristics Analyzer */}
            <div className="p-3.5 bg-[#f7f9f5] border border-[#e2e6dc] rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#181a15]">
                <span>Psychological & Social Engineering Heuristics</span>
                <span className="font-mono text-[#717a69]">{heuristics.hits.length} triggered</span>
              </div>
              {heuristics.hits.length > 0 ? (
                <div className="space-y-1.5 pt-1">
                  {heuristics.hits.map((h: HeuristicHit) => (
                    <div
                      key={h.id}
                      className="p-2.5 bg-white border border-[#e2e6dc] rounded-xl flex items-start justify-between gap-2 text-[11px]"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-rose-800">{h.title}</span>
                        <p className="text-[10px] text-[#636c5c] leading-relaxed">{h.explanation}</p>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 font-mono text-[9px] shrink-0 border border-rose-200">
                        wt: {h.weight}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-[#3d5926] italic">
                  ✓ No coercive or deceptive manipulation heuristics fired.
                </p>
              )}
            </div>

            {/* Passive URL Analyzer */}
            {urlReports.reports.length > 0 && (
              <div className="p-3.5 bg-[#f7f9f5] border border-[#e2e6dc] rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#181a15]">
                  <span>Passive URL Sandbox Findings (Zero Fetching)</span>
                  <span className="font-mono text-[#717a69]">{urlReports.reports.length} link(s)</span>
                </div>
                {urlReports.reports.map((u: UrlInspectionReport, i: number) => (
                  <div
                    key={i}
                    className="p-2.5 bg-white border border-[#e2e6dc] rounded-xl space-y-1.5 text-[11px]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[#181a15] truncate max-w-[340px]">{u.originalUrl}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase font-mono ${
                          u.isSafe
                            ? "bg-[#eef5e6] text-[#3d5926] border border-[#d5e0cb]"
                            : "bg-rose-50 text-rose-800 border border-rose-200"
                        }`}
                      >
                        {u.isSafe ? "Verified Safe" : "Suspicious"}
                      </span>
                    </div>
                    {(u.riskReasons || u.reasons || []).length > 0 && (
                      <ul className="list-disc list-inside text-[10px] text-rose-700 space-y-0.5 pt-1 border-t border-[#e2e6dc]">
                        {(u.riskReasons || u.reasons || []).map((rf: string, idx: number) => (
                          <li key={idx}>{rf}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Impersonation Matching */}
            {impersonation.match && (
              <div className="p-3.5 bg-[#f7f9f5] border border-[#e2e6dc] rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#181a15]">
                  <span>Brand & Organization Impersonation Check</span>
                  <span
                    className={`font-mono text-[10px] font-bold uppercase ${
                      impersonation.match.isImpersonated ? "text-rose-700" : "text-[#3d5926]"
                    }`}
                  >
                    {impersonation.match.isImpersonated ? "Impersonation Confirmed" : "Legitimate Entity"}
                  </span>
                </div>
                <div className="text-[11px] text-[#383d33] space-y-1">
                  <div>
                    Claimed Entity:{" "}
                    <span className="font-semibold text-[#181a15]">{impersonation.match.claimedEntity}</span>
                  </div>
                  {impersonation.match.mismatchReason && (
                    <p className="text-[10px] text-rose-700 leading-relaxed">
                      ⚠️ {impersonation.match.mismatchReason}
                    </p>
                  )}
                  {impersonation.match.officialHelpline && (
                    <div className="text-[10px] text-[#636c5c] flex items-center gap-1.5 pt-1">
                      <PhoneCall className="w-3 h-3 text-[#3d5926]" />
                      <span>Official Helpline: {impersonation.match.officialHelpline}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e2e6dc] bg-[#f7f9f5] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#717a69]">
            <Sparkles className="w-3.5 h-3.5 text-[#5c8a27]" />
            <span>Integrated with SafeGuard AI 4-Layer Detection Pipeline</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#181a15] hover:bg-[#2b2d26] text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

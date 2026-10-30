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
          bg: "bg-rose-500/10",
          border: "border-rose-500/40",
          text: "text-rose-400",
          badge: "bg-rose-500 text-slate-950",
          icon: <ShieldAlert className="w-6 h-6 text-rose-400" />,
        };
      case "suspicious":
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/40",
          text: "text-amber-400",
          badge: "bg-amber-500 text-slate-950",
          icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
        };
      default:
        return {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/40",
          text: "text-emerald-400",
          badge: "bg-emerald-500 text-slate-950",
          icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
        };
    }
  };

  const style = getTierColor(fused.overallRisk);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  SafeGuard AI Engine Diagnostic
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 border border-cyan-800/40 text-cyan-300">
                  Deterministic Core
                </span>
              </div>
              <h3 className="text-sm font-bold text-white truncate max-w-sm">{sourceTitle}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 text-xs text-slate-300">
          {/* Target Message Preview */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
            <div className="text-[10px] text-slate-500 uppercase font-sans tracking-wider pb-1 mb-1 border-b border-slate-800">
              Evaluated Input Payload
            </div>
            {messageText}
          </div>

          {/* Core Score Banner */}
          <div className={`p-4 rounded-2xl border ${style.bg} ${style.border} flex items-center justify-between gap-4`}>
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                {style.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider ${style.badge}`}>
                    {fused.overallRisk.toUpperCase()} RISK
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    Confidence: {fused.uncertainty.confidencePercent}%
                  </span>
                </div>
                <p className="text-xs text-slate-300 pt-1 leading-snug">
                  {fused.plainLanguageSummary}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-black font-mono text-white">
                {fused.riskScore}
                <span className="text-xs text-slate-500 font-light">/100</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono uppercase">Risk Score</span>
            </div>
          </div>

          {/* Signal Breakdown Cards */}
          <div className="space-y-3">
            {/* Heuristics Analyzer */}
            <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200">
                <span>Psychological & Social Engineering Heuristics</span>
                <span className="font-mono text-slate-400">{heuristics.hits.length} triggered</span>
              </div>
              {heuristics.hits.length > 0 ? (
                <div className="space-y-1.5 pt-1">
                  {heuristics.hits.map((h: HeuristicHit) => (
                    <div
                      key={h.id}
                      className="p-2 bg-slate-900/80 border border-slate-800 rounded-lg flex items-start justify-between gap-2 text-[11px]"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-rose-300">{h.title}</span>
                        <p className="text-[10px] text-slate-400 leading-relaxed">{h.explanation}</p>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 font-mono text-[9px] shrink-0 border border-rose-800/40">
                        wt: {h.weight}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-emerald-400/90 italic">
                  ✓ No coercive or deceptive manipulation heuristics fired.
                </p>
              )}
            </div>

            {/* Passive URL Analyzer */}
            {urlReports.reports.length > 0 && (
              <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200">
                  <span>Passive URL Sandbox Findings (Zero Fetching)</span>
                  <span className="font-mono text-slate-400">{urlReports.reports.length} link(s)</span>
                </div>
                {urlReports.reports.map((u: UrlInspectionReport, i: number) => (
                  <div
                    key={i}
                    className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1.5 text-[11px]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-cyan-300 truncate max-w-[340px]">{u.originalUrl}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase font-mono ${
                          u.isSafe
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800/40"
                            : "bg-rose-950 text-rose-300 border border-rose-800/40"
                        }`}
                      >
                        {u.isSafe ? "Verified Safe" : "Suspicious"}
                      </span>
                    </div>
                    {(u.riskReasons || u.reasons || []).length > 0 && (
                      <ul className="list-disc list-inside text-[10px] text-rose-400/90 space-y-0.5 pt-1 border-t border-slate-800">
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
              <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200">
                  <span>Brand & Organization Impersonation Check</span>
                  <span
                    className={`font-mono text-[10px] font-bold uppercase ${
                      impersonation.match.isImpersonated ? "text-rose-400" : "text-emerald-400"
                    }`}
                  >
                    {impersonation.match.isImpersonated ? "Impersonation Confirmed" : "Legitimate Entity"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div>
                    Claimed Entity:{" "}
                    <span className="font-semibold text-white">{impersonation.match.claimedEntity}</span>
                  </div>
                  {impersonation.match.mismatchReason && (
                    <p className="text-[10px] text-rose-400 leading-relaxed">
                      ⚠️ {impersonation.match.mismatchReason}
                    </p>
                  )}
                  {impersonation.match.officialHelpline && (
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-1">
                      <PhoneCall className="w-3 h-3 text-cyan-400" />
                      <span>Official Helpline: {impersonation.match.officialHelpline}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Integrated with SafeGuard AI 4-Layer Detection Pipeline</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

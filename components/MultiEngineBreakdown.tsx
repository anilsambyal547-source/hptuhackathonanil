"use client";

import React from "react";
import { Zap, Globe, Landmark, Brain, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { HeuristicHit, UrlInspectionReport, ImpersonationMatch, AiAnalysisResult } from "@/lib/types";

interface MultiEngineBreakdownProps {
  metricsBreakdown: {
    heuristicScore: number;
    urlScore: number;
    impersonationScore: number;
    aiScore: number | null;
    aiAvailable: boolean;
  };
  heuristicsHits: HeuristicHit[];
  urlReports: UrlInspectionReport[];
  impersonationMatch: ImpersonationMatch | null;
  aiAnalysis: AiAnalysisResult | null;
  confidencePercent: number;
}

export const MultiEngineBreakdown: React.FC<MultiEngineBreakdownProps> = ({
  metricsBreakdown,
  heuristicsHits,
  urlReports,
  impersonationMatch,
  aiAnalysis,
  confidencePercent,
}) => {
  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-[#636c5c] bg-[#edf2e7] border-[#dce3d5]";
    if (score >= 65) return "text-rose-700 bg-rose-50 border-rose-200";
    if (score >= 35) return "text-amber-800 bg-amber-50 border-amber-200";
    return "text-[#2b4416] bg-[#eef5e6] border-[#cbe0b8]";
  };

  const getScoreBadgeText = (score: number | null) => {
    if (score === null) return "OFFLINE";
    return `${Math.round(score)} / 100`;
  };

  // 1. Heuristics Summary
  const heuristicCount = heuristicsHits.length;
  const criticalHits = heuristicsHits.filter((h) => h.severity === "critical" || h.severity === "high").length;

  // 2. URL Sandbox Summary
  const urlCount = urlReports.length;
  const riskyUrls = urlReports.filter((u) => u.riskScore >= 50).length;
  const hasHomoglyph = urlReports.some((u) => u.hasHomoglyphs || u.homoglyphDetected);
  const hasTyposquat = urlReports.some((u) => u.typosquattingDetected);

  // 3. Impersonation Summary
  const isImpersonated = impersonationMatch?.isImpersonated;
  const claimedBrand = impersonationMatch?.claimedEntity;

  // 4. AI Engine Status
  const isAiOnline = metricsBreakdown.aiAvailable && aiAnalysis !== null;

  return (
    <div className="bg-white border border-[#e2e6dc] rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#edf1e8] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#eef4e8] text-[#3d5926] border border-[#d5e0cb]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-serif font-bold text-[#181a15]">
              4-Engine Multi-Method Detection Breakdown
            </h3>
            <p className="text-[11px] text-[#636c5c]">
              Combines independent deterministic, lexical, entity, and semantic analyzers (No single-verdict reliance)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-[#eef4e8] text-[#3d5926] border border-[#d5e0cb] font-semibold">
            {confidencePercent}% Consensus Confidence
          </span>
          <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-[#f4f7f1] text-[#556149] border border-[#dde4d4]">
            Weighted Fusion v2.5
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Method 1: Heuristic Rules Engine */}
        <div className="bg-[#f8faf6] border border-[#e2e7dc] rounded-2xl p-4 flex flex-col justify-between hover:border-[#b0c897] transition-all shadow-2xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#181a15] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Rule Heuristics</span>
              </span>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border ${getScoreColor(
                  metricsBreakdown.heuristicScore
                )}`}
              >
                {getScoreBadgeText(metricsBreakdown.heuristicScore)}
              </span>
            </div>
            <p className="text-[11px] text-[#556149] leading-snug">
              Psychological coercion, artificial urgency, DLT headers & OTP solicitation rules.
            </p>
          </div>

          <div className="pt-3 border-t border-[#e8eee1] mt-3 flex items-center justify-between text-[11px]">
            <span className="text-[#717a69]">Signal:</span>
            <span className="font-medium text-[#181a15]">
              {heuristicCount === 0
                ? "0 triggers (Clean)"
                : `${heuristicCount} rule${heuristicCount > 1 ? "s" : ""} (${criticalHits} critical)`}
            </span>
          </div>
        </div>

        {/* Method 2: Safe Passive URL Sandbox */}
        <div className="bg-[#f8faf6] border border-[#e2e7dc] rounded-2xl p-4 flex flex-col justify-between hover:border-[#b0c897] transition-all shadow-2xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#181a15] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-teal-600" />
                <span>Safe URL Sandbox</span>
              </span>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border ${getScoreColor(
                  metricsBreakdown.urlScore
                )}`}
              >
                {getScoreBadgeText(metricsBreakdown.urlScore)}
              </span>
            </div>
            <p className="text-[11px] text-[#556149] leading-snug">
              Zero-fetch lexical entropy, Cyrillic homoglyph, and dnstwist fuzzer analysis.
            </p>
          </div>

          <div className="pt-3 border-t border-[#e8eee1] mt-3 flex items-center justify-between text-[11px]">
            <span className="text-[#717a69]">Domain Check:</span>
            <span className="font-medium text-[#181a15] truncate max-w-[130px]">
              {urlCount === 0
                ? "No URLs found"
                : hasHomoglyph
                ? "Homoglyph spoof"
                : hasTyposquat
                ? "Typosquat match"
                : riskyUrls > 0
                ? `${riskyUrls} anomalous`
                : "Legitimate domains"}
            </span>
          </div>
        </div>

        {/* Method 3: Entity Impersonation Matcher */}
        <div className="bg-[#f8faf6] border border-[#e2e7dc] rounded-2xl p-4 flex flex-col justify-between hover:border-[#b0c897] transition-all shadow-2xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#181a15] flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-purple-600" />
                <span>Brand Verifier</span>
              </span>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border ${getScoreColor(
                  metricsBreakdown.impersonationScore
                )}`}
              >
                {getScoreBadgeText(metricsBreakdown.impersonationScore)}
              </span>
            </div>
            <p className="text-[11px] text-[#556149] leading-snug">
              Cross-checks sender claims against 28 verified Indian banks, couriers & agencies.
            </p>
          </div>

          <div className="pt-3 border-t border-[#e8eee1] mt-3 flex items-center justify-between text-[11px]">
            <span className="text-[#717a69]">Claim:</span>
            <span className="font-medium text-[#181a15] truncate max-w-[130px]">
              {claimedBrand
                ? isImpersonated
                ? `Spoofing ${claimedBrand}`
                : `Verified ${claimedBrand}`
                : "No brand claimed"}
            </span>
          </div>
        </div>

        {/* Method 4: Contextual AI & OCR Engine */}
        <div className="bg-[#f8faf6] border border-[#e2e7dc] rounded-2xl p-4 flex flex-col justify-between hover:border-[#b0c897] transition-all shadow-2xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#181a15] flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-blue-600" />
                <span>Semantic AI & OCR</span>
              </span>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border ${getScoreColor(
                  metricsBreakdown.aiScore
                )}`}
              >
                {isAiOnline
                  ? `${Math.round(metricsBreakdown.aiScore || 0)} / 100`
                  : "≤78% CAP"}
              </span>
            </div>
            <p className="text-[11px] text-[#556149] leading-snug">
              {isAiOnline
                ? `Gemini 2.5 active (${Math.round((aiAnalysis?.confidenceScore || 0.8) * 100)}% model confidence).`
                : "Offline Deterministic Mode — Confidence capped at ≤78% for uncertainty transparency."}
            </p>
          </div>

          <div className="pt-3 border-t border-[#e8eee1] mt-3 flex items-center justify-between text-[11px]">
            <span className="text-[#717a69]">Engine State:</span>
            <span
              className={`font-medium flex items-center gap-1 ${
                isAiOnline ? "text-[#3d5926]" : "text-amber-700"
              }`}
            >
              {isAiOnline ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-[#3d5926]" />
                  <span>Cloud Active</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>Offline Guard</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

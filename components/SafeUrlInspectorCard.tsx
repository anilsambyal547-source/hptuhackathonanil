"use client";

import React from "react";
import { UrlInspectionReport } from "@/lib/types";
import { Globe, Link2, EyeOff } from "lucide-react";

interface SafeUrlInspectorCardProps {
  urlReports: UrlInspectionReport[];
}

export const SafeUrlInspectorCard: React.FC<SafeUrlInspectorCardProps> = ({ urlReports }) => {
  if (urlReports.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Safe Passive URL Analysis
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          No embedded URLs or links were identified in the analyzed message.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Safe Passive URL Inspection
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50">
            {urlReports.length} Link{urlReports.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Zero-fetch safety notice */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800">
          <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
          <span>Zero-Fetch: Inspected strictly without network requests</span>
        </div>
      </div>

      <div className="space-y-4">
        {urlReports.map((report, idx) => {
          const isHighRisk = report.riskScore >= 70;
          const isSuspicious = report.riskScore >= 30 && report.riskScore < 70;

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                isHighRisk
                  ? "bg-rose-950/20 border-rose-800/40"
                  : isSuspicious
                  ? "bg-amber-950/20 border-amber-800/40"
                  : "bg-slate-950 border-slate-800/80"
              }`}
            >
              {/* URL String header (Inert code block - NEVER clickable!) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Link2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <code
                    className="text-xs sm:text-sm font-mono text-slate-200 bg-slate-900 px-2 py-1 rounded border border-slate-800 truncate select-all"
                    title={report.originalUrl}
                  >
                    {report.originalUrl}
                  </code>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      isHighRisk
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        : isSuspicious
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    Threat Score: {report.riskScore}%
                  </span>
                </div>
              </div>

              {/* Structural Analysis Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono">
                  Domain: {report.normalizedDomain}
                </span>

                <span
                  className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                    report.protocol === "https"
                      ? "bg-slate-900 text-emerald-400 border border-slate-800"
                      : "bg-rose-950/40 text-rose-400 border border-rose-800/40"
                  }`}
                >
                  Protocol: {report.protocol.toUpperCase()}
                </span>

                {report.isIpAddress && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-700/50 font-semibold">
                    Bare IP Address Host
                  </span>
                )}

                {report.hasHomoglyphs && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-700/50 font-semibold">
                    Deceptive Homoglyphs Detected
                  </span>
                )}

                {report.typosquattingTarget && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-700/50 font-semibold">
                    Typosquats: {report.typosquattingTarget}
                  </span>
                )}

                {report.isShortener && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-700/50">
                    URL Shortener ({report.shortenerProvider})
                  </span>
                )}

                {report.suspiciousTld && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-700/50 font-mono">
                    High-Risk TLD: .{report.tld}
                  </span>
                )}

                {(report.subdomainCount ?? 0) >= 3 && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-700/50">
                    {report.subdomainCount} Subdomain Levels
                  </span>
                )}

                {/* SIH_URL_Phishing & dnstwist Lexical Matrix */}
                {report.lexicalMetrics && (
                  <>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                        report.lexicalMetrics.shannonEntropy > 3.8
                          ? "bg-rose-950/60 text-rose-300 border border-rose-700/50 font-bold"
                          : "bg-slate-900 text-slate-300 border border-slate-800"
                      }`}
                    >
                      Entropy: {report.lexicalMetrics.shannonEntropy} bits/char
                    </span>

                    {report.lexicalMetrics.urlLength > 75 && (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-700/50 font-mono">
                        Length: {report.lexicalMetrics.urlLength} chars (Excessive)
                      </span>
                    )}

                    {report.lexicalMetrics.hasHttpsInDomain && (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-700/50 font-semibold font-mono">
                        Deceptive &apos;https&apos; in Domain
                      </span>
                    )}

                    {report.lexicalMetrics.fuzzerTechnique !== "none" && (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-700/50 font-semibold">
                        dnstwist: {report.lexicalMetrics.fuzzerTechniqueLabel}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Passive Inspection Evidentiary Findings */}
              {report.reasons && report.reasons.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Inspection Evidence:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {report.reasons.map((reason, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

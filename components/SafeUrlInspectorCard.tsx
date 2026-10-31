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
      <div className="bg-white border border-[#e2e6dc] rounded-3xl p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-[#3d5926]" />
          <h3 className="text-base font-serif font-bold text-[#181a15]">
            Safe Passive URL Analysis
          </h3>
        </div>
        <p className="text-xs text-[#636c5c]">
          No embedded URLs or links were identified in the analyzed message.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e2e6dc] rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#edf1e8] pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#3d5926]" />
          <h3 className="text-base font-serif font-bold text-[#181a15] tracking-tight">
            Safe Passive URL Inspection
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#eef4e8] text-[#3d5926] border border-[#d5e0cb] font-semibold">
            {urlReports.length} Link{urlReports.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Zero-fetch safety notice */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#556149] bg-[#f4f7f1] px-3 py-1 rounded-full border border-[#dde4d4]">
          <EyeOff className="w-3.5 h-3.5 text-[#3d5926]" />
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
              className={`p-4 rounded-2xl border transition-all ${
                isHighRisk
                  ? "bg-rose-50/70 border-rose-200"
                  : isSuspicious
                  ? "bg-amber-50/70 border-amber-200"
                  : "bg-[#f8faf6] border-[#e2e7dc]"
              }`}
            >
              {/* URL String header (Inert code block - NEVER clickable!) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Link2 className="w-4 h-4 text-[#636c5c] shrink-0" />
                  <code
                    className="text-xs sm:text-sm font-mono text-[#181a15] bg-white px-2.5 py-1 rounded-lg border border-[#dce3d5] truncate select-all shadow-2xs"
                    title={report.originalUrl}
                  >
                    {report.originalUrl}
                  </code>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                      isHighRisk
                        ? "bg-rose-100 text-rose-800 border border-rose-300"
                        : isSuspicious
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-[#eef4e8] text-[#3d5926] border border-[#d5e0cb]"
                    }`}
                  >
                    Threat Score: {report.riskScore}%
                  </span>
                </div>
              </div>

              {/* Structural Analysis Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-white text-[#424b3a] border border-[#dce3d5] font-mono">
                  Domain: {report.normalizedDomain}
                </span>

                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-md font-mono ${
                    report.protocol === "https"
                      ? "bg-[#eef4e8] text-[#3d5926] border border-[#d5e0cb]"
                      : "bg-rose-100 text-rose-800 border border-rose-200"
                  }`}
                >
                  Protocol: {report.protocol.toUpperCase()}
                </span>

                {report.isIpAddress && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300 font-semibold">
                    Bare IP Address Host
                  </span>
                )}

                {report.hasHomoglyphs && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300 font-semibold">
                    Deceptive Homoglyphs Detected
                  </span>
                )}

                {report.typosquattingTarget && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300 font-semibold">
                    Typosquats: {report.typosquattingTarget}
                  </span>
                )}

                {report.isShortener && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 font-medium">
                    URL Shortener ({report.shortenerProvider})
                  </span>
                )}

                {report.suspiciousTld && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                    High-Risk TLD: .{report.tld}
                  </span>
                )}

                {(report.subdomainCount ?? 0) >= 3 && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                    {report.subdomainCount} Subdomain Levels
                  </span>
                )}

                {/* SIH_URL_Phishing & dnstwist Lexical Matrix */}
                {report.lexicalMetrics && (
                  <>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-md font-mono ${
                        report.lexicalMetrics.shannonEntropy > 3.8
                          ? "bg-rose-100 text-rose-800 border border-rose-300 font-bold"
                          : "bg-white text-[#424b3a] border border-[#dce3d5]"
                      }`}
                    >
                      Entropy: {report.lexicalMetrics.shannonEntropy} bits/char
                    </span>

                    {report.lexicalMetrics.urlLength > 75 && (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                        Length: {report.lexicalMetrics.urlLength} chars (Excessive)
                      </span>
                    )}

                    {report.lexicalMetrics.hasHttpsInDomain && (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300 font-semibold font-mono">
                        Deceptive &apos;https&apos; in Domain
                      </span>
                    )}

                    {report.lexicalMetrics.fuzzerTechnique !== "none" && (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-300 font-semibold">
                        dnstwist: {report.lexicalMetrics.fuzzerTechniqueLabel}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Passive Inspection Evidentiary Findings */}
              {report.reasons && report.reasons.length > 0 && (
                <div className="pt-2 border-t border-[#e2e7dc]">
                  <span className="text-[11px] font-semibold text-[#636c5c] uppercase tracking-wider block mb-1">
                    Inspection Evidence:
                  </span>
                  <ul className="space-y-1 text-xs text-[#424b3a]">
                    {report.reasons.map((reason, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-1.5">
                        <span className="text-[#3d5926] font-bold">•</span>
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

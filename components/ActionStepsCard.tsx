"use client";

import React, { useState } from "react";
import { SafeActionStep, ScamAnalysisResult } from "@/lib/types";
import {
  CheckSquare,
  PhoneCall,
  ExternalLink,
  LifeBuoy,
  Download,
  Copy,
  Check,
  ShieldAlert,
} from "lucide-react";

interface ActionStepsCardProps {
  actionSteps: SafeActionStep[];
  plainLanguageSummary: string;
  fullResult?: ScamAnalysisResult | null;
  onOpenAssistance?: () => void;
}

export const ActionStepsCard: React.FC<ActionStepsCardProps> = ({
  actionSteps,
  plainLanguageSummary,
  fullResult,
  onOpenAssistance,
}) => {
  const [copiedChakshu, setCopiedChakshu] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadForensicReport = () => {
    if (!fullResult) return;
    const reportData = {
      reportTitle: "SafeGuard AI Forensic Threat Intelligence Report",
      incidentId: fullResult.id,
      generatedTimestamp: fullResult.timestamp,
      overallRisk: fullResult.overallRisk.toUpperCase(),
      threatScore: `${fullResult.riskScore}/100`,
      plainLanguageSummary: fullResult.plainLanguageSummary,
      inputTextPayload: fullResult.inputText,
      heuristicsTriggered: fullResult.heuristicsHits.map((h) => ({
        id: h.id,
        category: h.category,
        title: h.title,
        severity: h.severity,
        matchedSnippet: h.matchedText,
        explanation: h.explanation,
      })),
      urlsIdentified: fullResult.urlReports.map((u) => ({
        url: u.originalUrl,
        domain: u.normalizedDomain,
        riskScore: u.riskScore,
        reasons: u.reasons,
        lexicalMetrics: u.lexicalMetrics,
      })),
      impersonationFindings: fullResult.impersonationMatch,
      emailForensics: fullResult.emailForensics,
      tacticsBreakdown: fullResult.tacticsBreakdown,
      actionableRemediation: fullResult.actionSteps,
      complianceDisclaimer: fullResult.disclaimer,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `safeguard-forensic-report-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const handleCopyChakshuTemplate = async () => {
    if (!fullResult) return;
    const suspectedEntity = fullResult.impersonationMatch?.claimedEntity || "Unknown Institution";
    const urls = fullResult.urlReports.map((u) => u.originalUrl).join(", ") || "None";
    const triggers = fullResult.heuristicsHits.map((h) => h.title).join("; ") || "Coercive smishing";

    const chakshuReport = `
======================================================
SANCHAR SAATHI (CHAKSHU) / TRAI 1909 FRAUD REPORT
======================================================
Incident Reference: ${fullResult.id}
Timestamp: ${fullResult.timestamp}
Suspected Attack Type: ${fullResult.overallRisk.toUpperCase()} Risk Phishing / Scam
Claimed Organization: ${suspectedEntity}

Identified Phishing Links:
${urls}

Primary Fraudulent Indicators:
${triggers}

Raw Communication Payload:
"""
${fullResult.inputText}
"""

Generated via SafeGuard AI Deterministic Detection Engine
Evidence Attachment: cybercrime.gov.in / National Helpline: 1930
======================================================
`.trim();

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(chakshuReport);
        setCopiedChakshu(true);
        setTimeout(() => setCopiedChakshu(false), 2500);
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-5">
      {/* Plain Language Summary */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <LifeBuoy className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Plain-Language Risk Assessment
          </h3>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 font-normal">
          {plainLanguageSummary}
        </p>

        {onOpenAssistance && (
          <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 border border-rose-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <span>🚨 Already transferred money or shared sensitive details?</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Launch the Victim Recovery Assistant for immediate 1930 reporting, bank freeze steps, and official complaint filing.
              </p>
            </div>
            <button
              onClick={onOpenAssistance}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs whitespace-nowrap shadow-md shadow-rose-600/20 transition-all shrink-0"
            >
              Get Emergency Assistance →
            </button>
          </div>
        )}
      </div>

      {/* Action Steps Checklist */}
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Safe Actionable Next Steps
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Follow in recommended order
          </span>
        </div>

        <div className="space-y-3">
          {actionSteps.map((step, idx) => (
            <div
              key={step.id || idx}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-xs font-bold text-cyan-300 font-mono">
                    {idx + 1}
                  </span>
                  <h5 className="text-xs sm:text-sm font-semibold text-slate-100">
                    {step.action || step.title}
                  </h5>
                </div>

                <span
                  className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                    step.priority === "immediate"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : step.priority === "recommended"
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {step.priority}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-7">
                {step.explanation || step.instruction}
              </p>

              {(step.why || step.phoneHelpline || step.officialPortalUrl) && (
                <div className="mt-2 pl-7 pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                  {step.why && <span className="italic">Why: {step.why}</span>}

                  <div className="flex items-center gap-2 shrink-0">
                    {step.phoneHelpline && (
                      <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40 font-mono">
                        <PhoneCall className="w-3 h-3" />
                        <span>{step.phoneHelpline}</span>
                      </span>
                    )}

                    {step.officialPortalUrl && (
                      <a
                        href={step.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CitizenSafetyApp Forensic Export & Chakshu Reporting Bar */}
      {fullResult && (
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>Official Reporting & Legal Evidence Tools:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyChakshuTemplate}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              {copiedChakshu ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied Chakshu Template!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Copy TRAI / Chakshu Report</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadForensicReport}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 font-bold"
            >
              {downloaded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-950" />
                  <span>Report Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Evidence (.JSON)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

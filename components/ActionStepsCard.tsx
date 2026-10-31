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
    <div className="bg-white border border-[#e2e6dc] rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-5">
      {/* Plain Language Summary */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <LifeBuoy className="w-4 h-4 text-[#3d5926]" />
          <h3 className="text-base font-serif font-bold text-[#181a15] tracking-tight">
            Plain-Language Risk Assessment
          </h3>
        </div>
        <p className="text-sm text-[#181a15] leading-relaxed bg-[#f8faf6] p-4 rounded-2xl border border-[#e2e7dc] font-normal">
          {plainLanguageSummary}
        </p>

        {onOpenAssistance && (
          <div className="mt-3.5 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                <span>🚨 Already transferred money or shared sensitive details?</span>
              </div>
              <p className="text-[11px] text-rose-900/80">
                Launch the Victim Recovery Assistant for immediate 1930 reporting, bank freeze steps, and official complaint filing.
              </p>
            </div>
            <button
              onClick={onOpenAssistance}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs whitespace-nowrap shadow-xs transition-all shrink-0"
            >
              Get Emergency Assistance →
            </button>
          </div>
        )}
      </div>

      {/* Action Steps Checklist */}
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-[#edf1e8] pb-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#3d5926]" />
            <h4 className="text-base font-serif font-bold text-[#181a15] tracking-tight">
              Safe Actionable Next Steps
            </h4>
          </div>
          <span className="text-xs text-[#636c5c] font-medium">
            Follow in recommended order
          </span>
        </div>

        <div className="space-y-3">
          {actionSteps.map((step, idx) => (
            <div
              key={step.id || idx}
              className="p-4 rounded-2xl bg-[#f8faf6] border border-[#e2e7dc] hover:border-[#b0c897] transition-all shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#181a15] text-xs font-bold text-white font-mono">
                    {idx + 1}
                  </span>
                  <h5 className="text-xs sm:text-sm font-semibold text-[#181a15]">
                    {step.action || step.title}
                  </h5>
                </div>

                <span
                  className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full ${
                    step.priority === "immediate"
                      ? "bg-rose-100 text-rose-800 border border-rose-300"
                      : step.priority === "recommended"
                      ? "bg-[#eef4e8] text-[#3d5926] border border-[#d5e0cb]"
                      : "bg-[#f4f7f1] text-[#556149] border border-[#dde4d4]"
                  }`}
                >
                  {step.priority}
                </span>
              </div>

              <p className="text-xs text-[#525a4c] leading-relaxed pl-7">
                {step.explanation || step.instruction}
              </p>

              {(step.why || step.phoneHelpline || step.officialPortalUrl) && (
                <div className="mt-2.5 pl-7 pt-2 border-t border-[#e2e7dc] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#636c5c]">
                  {step.why && <span className="italic">Why: {step.why}</span>}

                  <div className="flex items-center gap-2 shrink-0">
                    {step.phoneHelpline && (
                      <span className="flex items-center gap-1 text-[#2c401c] bg-[#eef5e6] px-2.5 py-0.5 rounded-full border border-[#cbe0b8] font-mono font-medium">
                        <PhoneCall className="w-3 h-3 text-[#3d5926]" />
                        <span>{step.phoneHelpline}</span>
                      </span>
                    )}

                    {step.officialPortalUrl && (
                      <a
                        href={step.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#3d5926] hover:text-[#253915] bg-white px-2.5 py-0.5 rounded-full border border-[#dce3d5] font-medium shadow-2xs"
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
        <div className="pt-3.5 border-t border-[#edf1e8] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#636c5c]">
            <ShieldAlert className="w-4 h-4 text-[#3d5926]" />
            <span className="font-medium text-[#181a15]">Official Reporting & Legal Evidence Tools:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyChakshuTemplate}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-2xl text-xs font-semibold bg-[#f4f7f1] hover:bg-[#edf2e7] text-[#181a15] border border-[#dce3d5] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              {copiedChakshu ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#3d5926]" />
                  <span className="text-[#3d5926]">Copied Chakshu Template!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#556149]" />
                  <span>Copy TRAI / Chakshu Report</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadForensicReport}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-2xl text-xs font-bold bg-[#bef264] hover:bg-[#aee750] text-[#162704] border border-[#a8df4a]/70 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              {downloaded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#162704]" />
                  <span>Report Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#162704]" />
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

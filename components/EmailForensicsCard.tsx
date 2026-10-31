"use client";

import React from "react";
import { Mail, ShieldAlert, AlertTriangle, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { EmailHeaderForensics } from "@/lib/types";

interface EmailForensicsCardProps {
  emailForensics?: EmailHeaderForensics | null;
}

export const EmailForensicsCard: React.FC<EmailForensicsCardProps> = ({ emailForensics }) => {
  if (!emailForensics || !emailForensics.isEmail) return null;

  const { from, replyTo, returnPath, authResults, isDisplayNameSpoofed, isReplyToDivergent, anchorTextMismatches, riskFactors } = emailForensics;

  const getAuthBadge = (status: "pass" | "fail" | "softfail" | "neutral" | "none", label: string) => {
    switch (status) {
      case "pass":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#eef5e6] text-[#2c401c] border border-[#cbe0b8] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#3d5926]" />
            <span>{label}: PASS</span>
          </span>
        );
      case "fail":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>{label}: FAIL</span>
          </span>
        );
      case "softfail":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>{label}: SOFTFAIL</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#f4f7f1] text-[#636c5c] border border-[#dde4d4]">
            {label}: {status.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div className="p-6 bg-white border border-[#e2e6dc] rounded-3xl space-y-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#edf1e8]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#eef4e8] border border-[#d5e0cb] text-[#3d5926]">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#3d5926] font-semibold">
                RFC-822 Passive Header & Auth Forensics
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-[#f4f7f1] border border-[#dde4d4] text-[#556149]">
                Zero Network Query
              </span>
            </div>
            <h3 className="text-base font-serif font-bold text-[#181a15]">Email Authentication & Link Telemetry</h3>
          </div>
        </div>

        {/* SPF/DKIM/DMARC status pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {getAuthBadge(authResults.spf, "SPF")}
          {getAuthBadge(authResults.dkim, "DKIM")}
          {getAuthBadge(authResults.dmarc, "DMARC")}
        </div>
      </div>

      {/* From / Reply-To / Subject Inspection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* From Field */}
        <div className={`p-3.5 rounded-2xl border ${isDisplayNameSpoofed ? "bg-rose-50/70 border-rose-200" : "bg-[#f8faf6] border-[#e2e7dc]"} space-y-1`}>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#636c5c] uppercase">
            <span>From Header</span>
            {isDisplayNameSpoofed && (
              <span className="text-rose-700 font-bold flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-rose-600" />
                <span>Spoofed Identity</span>
              </span>
            )}
          </div>
          <div className="font-semibold text-[#181a15] truncate">{from?.displayName || "None"}</div>
          <div className="font-mono text-[#636c5c] text-[11px] truncate">{from?.address || from?.raw}</div>
        </div>

        {/* Reply-To Field */}
        <div className={`p-3.5 rounded-2xl border ${isReplyToDivergent ? "bg-amber-50/70 border-amber-200" : "bg-[#f8faf6] border-[#e2e7dc]"} space-y-1`}>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#636c5c] uppercase">
            <span>Reply-To Route</span>
            {isReplyToDivergent && (
              <span className="text-amber-800 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>Divergent Destination</span>
              </span>
            )}
          </div>
          <div className="font-semibold text-[#181a15] truncate">{replyTo?.address || "Matches From domain"}</div>
          <div className="font-mono text-[#636c5c] text-[11px] truncate">
            {returnPath ? `Return-Path: ${returnPath}` : "Direct Delivery"}
          </div>
        </div>
      </div>

      {/* HTML Anchor vs Href Mismatch Table */}
      {anchorTextMismatches.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-700">
            <span className="flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4 text-rose-600" />
              <span>Deceptive Anchor-Text Mismatches ({anchorTextMismatches.length})</span>
            </span>
            <span className="text-[10px] font-mono uppercase bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
              Phishing Link Obfuscation
            </span>
          </div>

          <div className="space-y-2">
            {anchorTextMismatches.map((m, idx) => (
              <div key={idx} className="p-3 bg-[#fdf8f8] rounded-xl border border-rose-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#636c5c]">Visible Text Shown to User:</span>
                  <span className="font-mono font-bold text-[#2c401c] truncate max-w-[280px]">
                    &ldquo;{m.visibleText}&rdquo;
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-rose-700 font-semibold">Actual Hidden &lt;a href&gt; Target:</span>
                  <span className="font-mono font-bold text-rose-700 truncate max-w-[280px]">
                    {m.href}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Factors List */}
      {riskFactors.length > 0 && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-1.5">
          <span className="text-[10px] font-mono text-rose-700 uppercase tracking-wider font-semibold">
            Email Threat Findings:
          </span>
          <ul className="list-disc list-inside text-xs text-rose-800 space-y-1 font-sans">
            {riskFactors.map((rf, idx) => (
              <li key={idx}>{rf}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


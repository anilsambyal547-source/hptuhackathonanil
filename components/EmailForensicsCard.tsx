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
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>{label}: PASS</span>
          </span>
        );
      case "fail":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800/40 flex items-center gap-1 animate-pulse">
            <XCircle className="w-3 h-3 text-rose-400" />
            <span>{label}: FAIL</span>
          </span>
        );
      case "softfail":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800/40 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>{label}: SOFTFAIL</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
            {label}: {status.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-5 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                RFC-822 Passive Header & Auth Forensics
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-cyan-950 border border-cyan-800/40 text-cyan-300">
                Zero Network Query
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Email Authentication & Link Telemetry</h3>
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
        <div className={`p-3.5 rounded-2xl border ${isDisplayNameSpoofed ? "bg-rose-950/20 border-rose-500/50" : "bg-slate-950/60 border-slate-800"} space-y-1`}>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
            <span>From Header</span>
            {isDisplayNameSpoofed && (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                <span>Spoofed Identity</span>
              </span>
            )}
          </div>
          <div className="font-semibold text-white truncate">{from?.displayName || "None"}</div>
          <div className="font-mono text-slate-400 text-[11px] truncate">{from?.address || from?.raw}</div>
        </div>

        {/* Reply-To Field */}
        <div className={`p-3.5 rounded-2xl border ${isReplyToDivergent ? "bg-amber-950/20 border-amber-500/50" : "bg-slate-950/60 border-slate-800"} space-y-1`}>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
            <span>Reply-To Route</span>
            {isReplyToDivergent && (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Divergent Destination</span>
              </span>
            )}
          </div>
          <div className="font-semibold text-white truncate">{replyTo?.address || "Matches From domain"}</div>
          <div className="font-mono text-slate-400 text-[11px] truncate">
            {returnPath ? `Return-Path: ${returnPath}` : "Direct Delivery"}
          </div>
        </div>
      </div>

      {/* HTML Anchor vs Href Mismatch Table */}
      {anchorTextMismatches.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-300">
            <span className="flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4 text-rose-400" />
              <span>Deceptive Anchor-Text Mismatches ({anchorTextMismatches.length})</span>
            </span>
            <span className="text-[10px] font-mono uppercase bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800/40">
              Phishing Link Obfuscation
            </span>
          </div>

          <div className="space-y-2">
            {anchorTextMismatches.map((m, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-rose-500/30 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Visible Text Shown to User:</span>
                  <span className="font-mono font-bold text-emerald-300 truncate max-w-[280px]">
                    &ldquo;{m.visibleText}&rdquo;
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-rose-400 font-semibold">Actual Hidden &lt;a href&gt; Target:</span>
                  <span className="font-mono font-bold text-rose-300 truncate max-w-[280px]">
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
        <div className="p-3.5 bg-rose-950/20 border border-rose-800/40 rounded-xl space-y-1.5">
          <span className="text-[10px] font-mono text-rose-300 uppercase tracking-wider font-semibold">
            Email Threat Findings:
          </span>
          <ul className="list-disc list-inside text-xs text-rose-200/90 space-y-1 font-sans">
            {riskFactors.map((rf, idx) => (
              <li key={idx}>{rf}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


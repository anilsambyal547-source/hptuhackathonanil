"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Send,
  Loader2,
} from "lucide-react";
import { ScamAnalysisResult } from "@/lib/types";
import { EmailForensicsCard } from "./EmailForensicsCard";
import { TacticsRadarCard } from "./TacticsRadarCard";
import { SafeUrlInspectorCard } from "./SafeUrlInspectorCard";
import { ActionStepsCard } from "./ActionStepsCard";
import { EvidenceHighlighter } from "./EvidenceHighlighter";

interface SimulatedItem {
  id: string;
  type: "email" | "sms";
  sender: string;
  subject: string;
  timestamp: string;
  snippet: string;
  rawPayload: string;
  expectedRisk: "high" | "low" | "suspicious";
}

const SIMULATED_ITEMS: SimulatedItem[] = [
  {
    id: "mail-1",
    type: "email",
    sender: `"State Bank of India Support" <no-reply@sbi-fraud-alert.top>`,
    subject: "URGENT: Your NetBanking account has been suspended pending KYC",
    timestamp: "10:24 AM",
    snippet: "Dear SBI Customer, your NetBanking access is disabled due to pending PAN linking...",
    rawPayload: `From: "State Bank of India Support" <no-reply@sbi-fraud-alert.top>
Reply-To: sbi.kyc.desk.claim@gmail.com
Subject: URGENT: Complete NetBanking KYC to prevent debit block
Authentication-Results: spf=fail; dkim=fail; dmarc=fail

Dear SBI Customer,
Your State Bank of India NetBanking privilege has been temporarily restricted due to missing PAN linking.

Please verify your credentials immediately within 24 hours to avoid permanent account termination:
<a href="http://sbi-login-portal.top/verify">https://www.onlinesbi.sbi/update</a>

Regards,
SBI Security Division`,
    expectedRisk: "high",
  },
  {
    id: "mail-2",
    type: "email",
    sender: `"Netflix Billing Desk" <membership@netflix-secure-billing.top>`,
    subject: "Notice: Your Netflix subscription has been placed on hold",
    timestamp: "Yesterday",
    snippet: "We could not process your recurring payment. Update payment card details to restore streaming...",
    rawPayload: `From: "Netflix Billing Desk" <membership@netflix-secure-billing.top>
Reply-To: refund.desk@gmail.com
Subject: Notice: Your Netflix subscription has been placed on hold
Authentication-Results: spf=softfail; dkim=none

Dear Subscriber,
Your payment method failed during automatic renewal. Your streaming access will terminate tonight at 11:59 PM.

Update your debit or credit card number immediately to prevent account suspension:
<a href="https://netflix-account-restore.top/login">https://www.netflix.com/youraccount</a>

Netflix Customer Operations`,
    expectedRisk: "high",
  },
  {
    id: "mail-3",
    type: "email",
    sender: `"HDFC Bank Alerts" <alerts@hdfcbank.net>`,
    subject: "E-Receipt: Transaction Alert for your A/C XX4921",
    timestamp: "28-Oct",
    snippet: "Rs 1,450.00 debited from A/C XX4921 for Swiggy. Available balance is Rs 34,200.00...",
    rawPayload: `From: "HDFC Bank Alerts" <alerts@hdfcbank.com>
Subject: E-Receipt: Transaction Alert for your A/C XX4921
Authentication-Results: spf=pass; dkim=pass; dmarc=pass

Dear Valued Customer,
Your Account XX4921 has been debited by Rs 1,450.00 on 28-Oct-26 via UPI reference #UPI99841249 to Swiggy.
Total Available Balance: Rs 34,200.00.

If you did not authorize this payment, please call our 24x7 phone banking helpline at 1800 202 6161 or visit our official netbanking portal at https://www.hdfcbank.com. Do not share your OTP or PIN with anyone.

Warm regards,
HDFC Bank Security Team`,
    expectedRisk: "low",
  },
  {
    id: "sms-1",
    type: "sms",
    sender: "+91 9876543210 (Personal Mobile)",
    subject: "Bijli Disconnection Threat Tonight",
    timestamp: "09:15 AM",
    snippet: "Dear consumer your electricity power will be disconnected tonight at 9:30 PM...",
    rawPayload: `Dear consumer, your electricity power will be disconnected tonight at 9:30 PM because previous month bill was not updated. Immediately contact electricity officer at 9876543210 to avoid power cut.`,
    expectedRisk: "high",
  },
  {
    id: "sms-2",
    type: "sms",
    sender: "VK-SBIIN (Official TRAI DLT Shortcode)",
    subject: "Official Transaction Alert",
    timestamp: "Yesterday",
    snippet: "Your A/C XX9812 has been credited by Rs 25,000 via NEFT...",
    rawPayload: `Your A/C XX9812 has been credited with Rs 25,000.00 on 29-Oct-26 via NEFT from TCS Ltd. Available Bal: Rs 82,140.50. Never share your OTP or UPI PIN with anyone - State Bank of India`,
    expectedRisk: "low",
  },
];

export const LiveInboxSimulator: React.FC = () => {
  const [activeItem, setActiveItem] = useState<SimulatedItem>(SIMULATED_ITEMS[0]);
  const [filterType, setFilterType] = useState<"all" | "email" | "sms">("all");
  const [analysisResult, setAnalysisResult] = useState<ScamAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customComposerOpen, setCustomComposerOpen] = useState(false);
  const [customPayload, setCustomPayload] = useState("");

  const analyzeSelected = async (payload: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/inbound-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawEmail: payload,
        }),
      });
      if (res.ok) {
        const data: ScamAnalysisResult = await res.json();
        setAnalysisResult(data);
      }
    } catch (err) {
      console.error("Live inbox analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (activeItem) {
      analyzeSelected(activeItem.rawPayload);
    }
  }, [activeItem]);

  const filteredItems = SIMULATED_ITEMS.filter((item) => {
    if (filterType === "all") return true;
    return item.type === filterType;
  });

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPayload.trim()) return;

    const newItem: SimulatedItem = {
      id: `custom-${Date.now()}`,
      type: customPayload.includes("From:") ? "email" : "sms",
      sender: customPayload.includes("From:") ? "Custom Forwarded Mail" : "Custom Webhook SMS",
      subject: "Inbound Forwarded Communication",
      timestamp: "Just now",
      snippet: customPayload.slice(0, 80) + "...",
      rawPayload: customPayload,
      expectedRisk: "high",
    };

    setActiveItem(newItem);
    setCustomComposerOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white border border-[#e2e6dc] rounded-3xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#eef4e8] border border-[#d5e0cb] text-[#3d5926] text-xs font-mono font-semibold">
              Live Mail Guard & Inbound Webhook Simulator
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#f4f7f1] text-[#556149] border border-[#dde4d4] font-mono">
              RFC-822 + TRAI DLT
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#181a15]">Interactive Mail & SMS Live Guard</h2>
          <p className="text-xs sm:text-sm text-[#5c6454]">
            Experience automatic in-mail protection without logging in. Click any message to trigger real-time passive forensic analysis.
          </p>
        </div>

        <button
          onClick={() => setCustomComposerOpen(true)}
          className="px-5 py-2.5 rounded-2xl text-xs font-bold text-[#162704] bg-[#bef264] hover:bg-[#aee750] border border-[#a8df4a]/70 transition-all flex items-center gap-2 shadow-2xs shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Simulate Forwarded Webhook</span>
        </button>
      </div>

      {/* Main Split-Pane Client */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Mail / SMS List (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#e2e6dc] rounded-3xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] flex flex-col">
          {/* List Filter Tabs */}
          <div className="p-3 bg-[#f8faf6] border-b border-[#edf1e8] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  filterType === "all" ? "bg-[#181a15] text-white shadow-2xs" : "text-[#556149] hover:text-[#181a15]"
                }`}
              >
                All Messages
              </button>
              <button
                onClick={() => setFilterType("email")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  filterType === "email" ? "bg-[#181a15] text-white shadow-2xs" : "text-[#556149] hover:text-[#181a15]"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Emails</span>
              </button>
              <button
                onClick={() => setFilterType("sms")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  filterType === "sms" ? "bg-[#181a15] text-white shadow-2xs" : "text-[#556149] hover:text-[#181a15]"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>SMS</span>
              </button>
            </div>
            <span className="text-[11px] font-mono text-[#636c5c]">{filteredItems.length} items</span>
          </div>

          {/* Messages Stream */}
          <div className="divide-y divide-[#edf1e8] max-h-[640px] overflow-y-auto">
            {filteredItems.map((item) => {
              const isSelected = activeItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`p-4 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? "bg-[#f4f8ee] border-l-4 border-[#8ec251]"
                      : "hover:bg-[#fafbf9] text-[#181a15]"
                  }`}
                >
                  <div className="space-y-1 flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      {item.type === "email" ? (
                        <Mail className="w-3.5 h-3.5 text-[#3d5926] shrink-0" />
                      ) : (
                        <MessageSquare className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      )}
                      <span className="text-xs font-bold text-[#181a15] truncate max-w-[200px]">
                        {item.sender.split("<")[0].replace(/"/g, "")}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-[#2c3524] truncate">{item.subject}</h4>
                    <p className="text-[11px] text-[#636c5c] line-clamp-1">{item.snippet}</p>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <span className="text-[10px] font-mono text-[#717a69]">{item.timestamp}</span>
                    <div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase font-mono ${
                          item.expectedRisk === "high"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : item.expectedRisk === "suspicious"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-[#eef5e6] text-[#2c401c] border border-[#cbe0b8]"
                        }`}
                      >
                        {item.expectedRisk}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Active Reader + Inline Security Banner & Diagnostics (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Inline Security Banner */}
          {analysisResult && (
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-2xs ${
                analysisResult.overallRisk === "high"
                  ? "bg-rose-50 border-rose-200 text-rose-900"
                  : analysisResult.overallRisk === "suspicious"
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : "bg-[#eef5e6] border-[#cbe0b8] text-[#2c401c]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white border border-black/5 shadow-2xs">
                  {analysisResult.overallRisk === "high" ? (
                    <ShieldAlert className="w-6 h-6 text-rose-600" />
                  ) : analysisResult.overallRisk === "suspicious" ? (
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  ) : (
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black uppercase tracking-wider">
                      SafeGuard Live Guard: {analysisResult.overallRisk.toUpperCase()} RISK
                    </span>
                    <span className="text-[10px] font-mono opacity-75">
                      Score: {analysisResult.riskScore}/100
                    </span>
                    {isAnalyzing && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3d5926]" />}
                  </div>
                  <p className="text-xs pt-0.5 leading-snug opacity-90">
                    {analysisResult.plainLanguageSummary}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Message Payload Viewer */}
          <div className="p-6 bg-white border border-[#e2e6dc] rounded-3xl space-y-4 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between pb-3 border-b border-[#edf1e8] text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-[#636c5c] tracking-wider">
                  Originating Channel
                </span>
                <div className="font-bold text-[#181a15] text-sm">{activeItem.sender}</div>
              </div>
              <span className="text-xs font-mono text-[#717a69]">{activeItem.timestamp}</span>
            </div>

            {/* Evidentiary Highlighter directly in the reader view */}
            {analysisResult ? (
              <EvidenceHighlighter
                text={analysisResult.inputText}
                spans={analysisResult.evidenceSpans}
              />
            ) : (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap">
                {activeItem.rawPayload}
              </div>
            )}
          </div>

          {/* Email Forensics Card if applicable */}
          {analysisResult?.emailForensics && (
            <EmailForensicsCard emailForensics={analysisResult.emailForensics} />
          )}

          {/* Tactics Radar Card */}
          {analysisResult?.tacticsBreakdown && (
            <TacticsRadarCard tactics={analysisResult.tacticsBreakdown} />
          )}

          {/* Safe URL Inspector */}
          {analysisResult && (
            <SafeUrlInspectorCard urlReports={analysisResult.urlReports} />
          )}

          {/* Safe Action Steps */}
          {analysisResult && (
            <ActionStepsCard
              actionSteps={analysisResult.actionSteps}
              plainLanguageSummary={analysisResult.plainLanguageSummary}
              fullResult={analysisResult}
            />
          )}
        </div>
      </div>

      {/* Inbound Webhook Simulator Composer Modal */}
      {customComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Simulate Inbound Forwarded Webhook</h3>
              </div>
              <button
                onClick={() => setCustomComposerOpen(false)}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <p className="text-xs text-slate-400">
                Paste RFC-822 email headers, HTML buttons, or raw SMS payload to simulate an external webhook forward into `/api/inbound-mail`:
              </p>
              <textarea
                value={customPayload}
                onChange={(e) => setCustomPayload(e.target.value)}
                rows={8}
                placeholder={`From: "Custom Brand" <spoofed@evil.top>\nReply-To: phisher@gmail.com\nSubject: Account Verification\n\nPlease update your password at https://bank-verify.top`}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCustomComposerOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={!customPayload.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
                >
                  Forward to Live Guard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


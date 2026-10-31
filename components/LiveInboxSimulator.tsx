"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Send,
  Loader2,
  Radar,
  Search,
  RefreshCw,
  Sparkles,
  Lock,
  Globe,
} from "lucide-react";
import {
  MailMessage,
  EmailErrorAuditResult,
  DEMO_MAILBOX_MESSAGES,
  auditEmailSecurityErrors,
} from "@/lib/mail/gmail-client";

export const LiveInboxSimulator: React.FC = () => {
  const [messages, setMessages] = useState<MailMessage[]>(DEMO_MAILBOX_MESSAGES);
  const [selectedEmail, setSelectedEmail] = useState<MailMessage>(DEMO_MAILBOX_MESSAGES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<"all" | "high" | "low">("all");
  const [activeTab, setActiveTab] = useState<"reader" | "audit" | "headers">("reader");
  const [errorAudit, setErrorAudit] = useState<EmailErrorAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [googleOAuthModalOpen, setGoogleOAuthModalOpen] = useState(false);
  const [customComposerOpen, setCustomComposerOpen] = useState(false);
  const [customPayload, setCustomPayload] = useState("");
  const [oauthToken, setOauthToken] = useState("");
  const [connectionMode, setConnectionMode] = useState<"demo" | "google">("demo");

  // Automatically run audit when selected email changes if already in audit mode
  useEffect(() => {
    if (selectedEmail) {
      setErrorAudit(auditEmailSecurityErrors(selectedEmail));
    }
  }, [selectedEmail]);

  // Handle Search & Filter
  const filteredMessages = messages.filter((msg) => {
    const matchesQuery =
      searchQuery === "" ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.senderEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.bodyText.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk =
      filterRisk === "all" ||
      (filterRisk === "high" && msg.expectedRisk === "high") ||
      (filterRisk === "low" && msg.expectedRisk === "low");

    return matchesQuery && matchesRisk;
  });

  // 1-Click Error Audit
  const handleRunAudit = async () => {
    setIsAuditing(true);
    setActiveTab("audit");
    try {
      const res = await fetch("/api/mail/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: selectedEmail }),
      });
      if (res.ok) {
        const data = await res.json();
        setErrorAudit(data.audit);
      } else {
        // Fallback to local client engine
        setErrorAudit(auditEmailSecurityErrors(selectedEmail));
      }
    } catch {
      setErrorAudit(auditEmailSecurityErrors(selectedEmail));
    } finally {
      setIsAuditing(false);
    }
  };

  // Connect Real Gmail / Fetch with Token
  const handleConnectGoogle = async (tokenToUse?: string) => {
    const token = tokenToUse || oauthToken;
    if (!token.trim()) {
      alert("Please enter a valid Google OAuth access token with gmail.readonly scope.");
      return;
    }

    setIsConnectingGoogle(true);
    try {
      const res = await fetch(`/api/mail/inbox?token=${encodeURIComponent(token.trim())}`);
      const data = await res.json();
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages);
        setSelectedEmail(data.messages[0]);
        setConnectionMode("google");
        setGoogleOAuthModalOpen(false);
      } else {
        alert("No messages returned or token expired. Verify your Google OAuth token.");
      }
    } catch (err) {
      console.error("Google connect error:", err);
      alert("Failed to connect with Google API. Verify network access and token validity.");
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  // Reset to Sandbox Mailbox
  const handleResetSandbox = () => {
    setMessages(DEMO_MAILBOX_MESSAGES);
    setSelectedEmail(DEMO_MAILBOX_MESSAGES[0]);
    setConnectionMode("demo");
    setErrorAudit(auditEmailSecurityErrors(DEMO_MAILBOX_MESSAGES[0]));
    setActiveTab("reader");
  };

  // Inbound Custom Payload Simulation
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPayload.trim()) return;

    const fromMatch = customPayload.match(/From:\s*(.+)/i);
    const subjectMatch = customPayload.match(/Subject:\s*(.+)/i);
    const replyToMatch = customPayload.match(/Reply-To:\s*(.+)/i);

    const newMsg: MailMessage = {
      id: `custom-${Date.now()}`,
      senderName: fromMatch ? fromMatch[1].split("<")[0].replace(/"/g, "").trim() : "Custom Inbound Sender",
      senderEmail: fromMatch ? fromMatch[1].match(/<([^>]+)>/)?.[1] || fromMatch[1].trim() : "custom@forwarded.mail",
      replyTo: replyToMatch ? replyToMatch[1].trim() : undefined,
      recipientEmail: "user@gmail.com",
      subject: subjectMatch ? subjectMatch[1].trim() : "Forwarded Suspicious Communication",
      date: "Just now",
      timestamp: "Just now",
      snippet: customPayload.slice(0, 80) + "...",
      bodyText: customPayload,
      headers: {
        From: fromMatch ? fromMatch[1].trim() : "",
        Subject: subjectMatch ? subjectMatch[1].trim() : "",
        "Reply-To": replyToMatch ? replyToMatch[1].trim() : "",
      },
      expectedRisk: "high",
    };

    setMessages((prev) => [newMsg, ...prev]);
    setSelectedEmail(newMsg);
    setCustomComposerOpen(false);
    setErrorAudit(auditEmailSecurityErrors(newMsg));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar: Mailbox Status, Search, and Controls */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-5 rounded-3xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Connection Status Badge */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#181a15]">
              {connectionMode === "google" ? "Google Mail API Active" : "Gmail Security Sandbox Active"}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#eef4e8] text-[#3d5926] border border-[#d5e0cb] font-mono">
              RFC-822 + Gmail API
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#181a15]">
            Gmail Inbox & 4-Layer Security Error Inspector
          </h2>
          <p className="text-xs text-[#5c6454]">
            Select any incoming email to inspect authentication headers, spoofed senders, and deceptive links.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {connectionMode === "google" ? (
            <button
              type="button"
              onClick={handleResetSandbox}
              className="px-3.5 py-2 rounded-2xl text-xs font-semibold bg-[#f7f9f5] hover:bg-[#edf2e7] text-[#181a15] border border-[#dce3d5] transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#557e33]" />
              <span>Switch to Demo Mailbox</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setGoogleOAuthModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl text-xs font-bold bg-[#181a15] hover:bg-black text-white transition-all flex items-center gap-2 shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-[#bef264]" />
              <span>Connect Real Gmail API</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setCustomComposerOpen(true)}
            className="px-3.5 py-2 rounded-2xl text-xs font-bold text-[#162704] bg-[#bef264] hover:bg-[#aee750] border border-[#a8df4a]/70 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Simulate Mail</span>
          </button>
        </div>
      </div>

      {/* Main Split-Pane Mail Client */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Searchable Messages List (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#e2e6dc] rounded-3xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] flex flex-col">
          {/* Search Box */}
          <div className="p-3 bg-[#f8faf6] border-b border-[#edf1e8] space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-[#717a69] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mail by subject, sender, content..."
                className="w-full bg-white border border-[#dce3d5] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#181a15] placeholder-[#8e9886] focus:outline-none focus:border-[#8ec251] shadow-2xs"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFilterRisk("all")}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    filterRisk === "all" ? "bg-[#181a15] text-white shadow-2xs" : "text-[#586150] hover:bg-white/60"
                  }`}
                >
                  All ({messages.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRisk("high")}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    filterRisk === "high" ? "bg-rose-600 text-white shadow-2xs" : "text-rose-700 hover:bg-rose-50"
                  }`}
                >
                  <ShieldAlert className="w-3 h-3" />
                  <span>Flagged Scams</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRisk("low")}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    filterRisk === "low" ? "bg-emerald-700 text-white shadow-2xs" : "text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </button>
              </div>

              <span className="text-[10px] font-mono text-[#717a69]">{filteredMessages.length} shown</span>
            </div>
          </div>

          {/* Email Items Stream */}
          <div className="divide-y divide-[#edf1e8] max-h-[600px] overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#717a69]">
                No emails match your search query.
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedEmail?.id === msg.id;
                const isHighRisk = msg.expectedRisk === "high";

                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedEmail(msg);
                      setActiveTab("reader");
                    }}
                    className={`p-3.5 cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? "bg-[#f4f8ee] border-l-4 border-[#8ec251]"
                        : "hover:bg-[#fafbf9] text-[#181a15]"
                    }`}
                  >
                    {/* Sender Avatar */}
                    <div
                      className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                        isHighRisk
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-[#e2edd8] text-[#2c401c] border border-[#cbe0b8]"
                      }`}
                    >
                      {msg.senderName.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#181a15] truncate max-w-[180px]">
                          {msg.senderName}
                        </span>
                        <span className="text-[10px] font-mono text-[#717a69]">{msg.timestamp}</span>
                      </div>

                      <h4 className="text-xs font-semibold text-[#2c3524] truncate">{msg.subject}</h4>
                      <p className="text-[11px] text-[#636c5c] line-clamp-1">{msg.snippet}</p>

                      <div className="pt-1 flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase font-mono ${
                            isHighRisk
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-[#eef5e6] text-[#2c401c] border border-[#cbe0b8]"
                          }`}
                        >
                          {isHighRisk ? "⚠️ Suspicious / Phish" : "✅ Authentic"}
                        </span>

                        {msg.authResults?.spf === "fail" && (
                          <span className="text-[9px] font-mono text-rose-600 bg-rose-50 px-1 rounded">
                            SPF Fail
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Email Reader & 4-Layer Forensic Error Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Reader Window Chrome */}
          <div className="bg-white border border-[#e2e6dc] rounded-3xl p-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-4">
            {/* Header Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#edf1e8]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#181a15]">{selectedEmail.senderName}</span>
                  <span className="text-xs font-mono text-[#717a69]">&lt;{selectedEmail.senderEmail}&gt;</span>
                </div>
                <div className="text-[11px] text-[#636c5c]">
                  To: <span className="font-mono text-[#181a15]">{selectedEmail.recipientEmail}</span> • {selectedEmail.date}
                </div>
                {selectedEmail.replyTo && (
                  <div className="text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md inline-block font-mono border border-rose-200">
                    Reply-To Divergence: {selectedEmail.replyTo}
                  </div>
                )}
              </div>

              {/* Primary Error Inspection Button */}
              <button
                type="button"
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-[#162704] bg-[#bef264] hover:bg-[#aee750] border border-[#a8df4a]/70 shadow-[0_2px_12px_rgba(190,242,100,0.35)] transition-all flex items-center gap-2 shrink-0"
              >
                {isAuditing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#162704]" />
                    <span>Auditing Security Layers...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#3d5926]" />
                    <span>Inspect for Security Errors</span>
                  </>
                )}
              </button>
            </div>

            {/* Subject Line */}
            <div>
              <h3 className="font-serif font-bold text-lg text-[#181a15] leading-snug">
                {selectedEmail.subject}
              </h3>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#f4f7f1] rounded-2xl border border-[#e2e8dc] text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("reader")}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "reader"
                    ? "bg-[#181a15] text-white shadow-xs"
                    : "text-[#586150] hover:text-[#181a15] hover:bg-white/60"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Message Body</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("audit")}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "audit"
                    ? "bg-[#181a15] text-white shadow-xs"
                    : "text-[#586150] hover:text-[#181a15] hover:bg-white/60"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#bef264]" />
                <span>Security Error Report</span>
                {errorAudit && errorAudit.errorsFound.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("headers")}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "headers"
                    ? "bg-[#181a15] text-white shadow-xs"
                    : "text-[#586150] hover:text-[#181a15] hover:bg-white/60"
                }`}
              >
                <Radar className="w-3.5 h-3.5" />
                <span>Raw Headers</span>
              </button>
            </div>

            {/* TAB 1: Message Body Reader */}
            {activeTab === "reader" && (
              <div className="p-4 bg-[#fbfcf9] rounded-2xl border border-[#e2e6dc] text-xs text-[#181a15] leading-relaxed whitespace-pre-wrap font-sans">
                {selectedEmail.bodyText}
              </div>
            )}

            {/* TAB 2: 4-Layer Forensic Error Audit Report */}
            {activeTab === "audit" && errorAudit && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Health Score & Verdict Banner */}
                <div
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs ${
                    errorAudit.verdict === "MALICIOUS_SPOOF"
                      ? "bg-rose-50 border-rose-200 text-rose-900"
                      : errorAudit.verdict === "SUSPICIOUS_PHISH"
                      ? "bg-amber-50 border-amber-200 text-amber-900"
                      : "bg-[#eef5e6] border-[#cbe0b8] text-[#2c401c]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white border border-black/5 shadow-2xs">
                      {errorAudit.verdict === "MALICIOUS_SPOOF" ? (
                        <ShieldAlert className="w-6 h-6 text-rose-600" />
                      ) : errorAudit.verdict === "SUSPICIOUS_PHISH" ? (
                        <AlertTriangle className="w-6 h-6 text-amber-600" />
                      ) : (
                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black uppercase tracking-wider">
                          Verdict: {errorAudit.verdict.replace("_", " ")}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/80 border border-black/10">
                          Security Health: {errorAudit.overallHealthScore}/100
                        </span>
                      </div>
                      <p className="text-xs pt-1 opacity-90">
                        {errorAudit.errorsFound.length} security error(s) & anomalies identified in email payload.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4-Layer Error Cards */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-[#181a15] flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span>Identified Protocol, Link, & Psychological Errors:</span>
                  </div>

                  {errorAudit.errorsFound.length === 0 ? (
                    <div className="p-4 bg-[#eef5e6] border border-[#cbe0b8] rounded-2xl text-xs text-[#2c401c] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#3d5926]" />
                      <span>Zero security errors detected! Cryptographic headers, domains, and links are fully authentic.</span>
                    </div>
                  ) : (
                    errorAudit.errorsFound.map((err, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl border text-xs space-y-1.5 shadow-2xs ${
                          err.severity === "critical"
                            ? "bg-rose-50/60 border-rose-200 text-rose-950"
                            : "bg-amber-50/60 border-amber-200 text-amber-950"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                err.severity === "critical" ? "bg-rose-600" : "bg-amber-500"
                              }`}
                            />
                            <span>{err.title}</span>
                          </div>
                          <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-white border border-black/10">
                            Layer: {err.layer.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#4b5543]">{err.description}</p>
                        <div className="p-2 bg-white/80 rounded-xl font-mono text-[10px] text-[#181a15] border border-black/5">
                          Evidence: {err.evidence}
                        </div>
                        <div className="text-[11px] font-semibold text-[#2c401c] pt-0.5">
                          Action: {err.recommendation}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Safe Containment Guidance */}
                <div className="p-4 bg-[#f8faf6] border border-[#e2e6dc] rounded-2xl space-y-2 text-xs">
                  <span className="font-bold text-[#181a15]">Remediation Guidance:</span>
                  <ul className="space-y-1 text-[#556149]">
                    {errorAudit.safeActionGuidance.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span>•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 3: Raw RFC-822 Headers Viewer */}
            {activeTab === "headers" && (
              <div className="p-4 bg-[#181a15] text-[#bef264] rounded-2xl text-[11px] font-mono overflow-x-auto space-y-1 max-h-[300px] overflow-y-auto">
                {Object.entries(selectedEmail.headers).map(([k, v]) => (
                  <div key={k}>
                    <span className="text-white/60">{k}: </span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Google OAuth Connect Modal */}
      {googleOAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181a15]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white border border-[#e2e6dc] rounded-3xl p-6 space-y-4 shadow-2xl text-[#181a15]">
            <div className="flex items-center justify-between pb-3 border-b border-[#edf1e8]">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#3d5926]" />
                <h3 className="font-serif text-base font-bold text-[#181a15]">Connect Real Gmail API</h3>
              </div>
              <button
                type="button"
                onClick={() => setGoogleOAuthModalOpen(false)}
                className="text-xs font-semibold text-[#636c5c] hover:text-[#181a15]"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#5c6454] leading-relaxed">
              <p>
                DIGIkavach connects directly to Google Workspace using the read-only scope (<code>gmail.readonly</code>). No emails are stored on servers; processing operates 100% inside browser memory.
              </p>
              <div className="p-3 bg-[#f8faf6] rounded-2xl border border-[#e2e6dc] space-y-1.5">
                <span className="font-semibold text-[#181a15]">Google OAuth 2.0 Access Token:</span>
                <input
                  type="password"
                  value={oauthToken}
                  onChange={(e) => setOauthToken(e.target.value)}
                  placeholder="Paste OAuth access token (Bearer ya29...)"
                  className="w-full bg-white border border-[#dce3d5] rounded-xl px-3 py-2 text-xs font-mono text-[#181a15] focus:outline-none focus:border-[#8ec251]"
                />
                <p className="text-[10px] text-[#717a69]">
                  Generated via Google Cloud Console OAuth 2.0 Playground or NextAuth.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  handleResetSandbox();
                  setGoogleOAuthModalOpen(false);
                }}
                className="text-xs text-[#3d5926] hover:underline font-semibold"
              >
                Continue with Demo Mailbox
              </button>

              <button
                type="button"
                disabled={isConnectingGoogle || !oauthToken.trim()}
                onClick={() => handleConnectGoogle()}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-[#162704] bg-[#bef264] hover:bg-[#aee750] border border-[#a8df4a]/70 disabled:opacity-40 transition-all flex items-center gap-2 shadow-xs"
              >
                {isConnectingGoogle ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Fetch Gmail Inbox</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inbound Webhook Simulator Composer Modal */}
      {customComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181a15]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white border border-[#e2e6dc] rounded-3xl p-6 space-y-4 shadow-2xl text-[#181a15]">
            <div className="flex items-center justify-between pb-3 border-b border-[#edf1e8]">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-[#3d5926]" />
                <h3 className="font-serif text-base font-bold text-[#181a15]">Simulate Custom Inbound Email</h3>
              </div>
              <button
                type="button"
                onClick={() => setCustomComposerOpen(false)}
                className="text-xs font-semibold text-[#636c5c] hover:text-[#181a15]"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <textarea
                value={customPayload}
                onChange={(e) => setCustomPayload(e.target.value)}
                rows={7}
                placeholder={`From: "Company Alert" <spoofed@scam-domain.top>\nReply-To: phisher@gmail.com\nSubject: Account Verification Required\n\nPlease update your credentials immediately at https://bank-update.top`}
                className="w-full bg-[#fcfdfa] border border-[#e2e6dc] rounded-2xl p-4 text-xs font-mono text-[#181a15] placeholder-[#9ca394] focus:outline-none focus:border-[#8ec251]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCustomComposerOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#636c5c] hover:bg-[#f7f9f5]"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={!customPayload.trim()}
                  className="px-5 py-2 rounded-2xl text-xs font-bold text-[#162704] bg-[#bef264] hover:bg-[#aee750] border border-[#a8df4a]/70 shadow-xs"
                >
                  Forward to Inbox
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

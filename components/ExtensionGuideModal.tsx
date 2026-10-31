"use client";

import React, { useState } from "react";
import { X, Chrome, Bookmark, Smartphone, Mail, Copy, Check, ShieldCheck, Zap } from "lucide-react";

interface ExtensionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateScan?: (text: string, type: "text" | "ocr_screenshot" | "email_eml") => void;
}

export const ExtensionGuideModal: React.FC<ExtensionGuideModalProps> = ({
  isOpen,
  onClose,
  onSimulateScan,
}) => {
  const [activeTab, setActiveTab] = useState<"chrome" | "bookmarklet" | "pwa" | "email">("chrome");
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const bookmarkletCode = `javascript:(function(){const sel=window.getSelection().toString()||window.location.href;window.open('http://localhost:3000/?text='+encodeURIComponent(sel),'_blank');})();`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSimulateChrome = () => {
    onClose();
    if (onSimulateScan) {
      onSimulateScan(
        "URGENT ALERT: Your HDFC Bank NetBanking access has been restricted due to incomplete KYC verification. Click https://hdfc-netbanking-kyc.top/verify immediately or account will be permanently deactivated within 24 hours.",
        "text"
      );
    }
  };

  const handleSimulatePwa = () => {
    onClose();
    if (onSimulateScan) {
      onSimulateScan(
        "WhatsApp Forward: Urgent alert from Delhi Police Cyber Cell! Your mobile number is found linked to illegal parcel seized by customs at Mumbai Airport. Digital arrest initiated. Join Skype interrogation immediately.",
        "text"
      );
    }
  };

  const handleSimulateEmail = () => {
    onClose();
    if (onSimulateScan) {
      onSimulateScan(
        `From: "State Bank of India Security" <no-reply@sbi-fraud-alert.top>
Reply-To: sbi.kyc.desk.claim@gmail.com
Subject: URGENT: Complete NetBanking KYC to prevent debit block
Authentication-Results: spf=fail; dkim=fail; dmarc=fail

Dear SBI Customer,
Your State Bank of India NetBanking privilege has been temporarily restricted due to missing PAN linking.

Please verify your credentials immediately to avoid account termination:
<a href="http://sbi-login-portal.top/verify">https://www.onlinesbi.sbi/update</a>

Regards,
SBI Security Division`,
        "email_eml"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-[#e2e6dc] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#edf1e8] flex items-center justify-between bg-[#f8faf6]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#eef4e8] border border-[#d5e0cb] text-[#3d5926]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#181a15]">SafeGuard Multi-Channel Ingestion & Integrations</h2>
              <p className="text-xs text-[#636c5c]">Zero-friction scanning across Browser, Mobile PWA, and Mail</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#636c5c] hover:text-[#181a15] hover:bg-white border border-transparent hover:border-[#dce3d5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#edf1e8] px-6 bg-[#fafbf9] gap-4 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab("chrome")}
            className={`py-3.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "chrome"
                ? "border-[#8ec251] text-[#181a15] font-bold"
                : "border-transparent text-[#636c5c] hover:text-[#181a15]"
            }`}
          >
            <Chrome className="w-4 h-4" />
            <span>Chrome Extension</span>
          </button>
          <button
            onClick={() => setActiveTab("bookmarklet")}
            className={`py-3.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "bookmarklet"
                ? "border-[#8ec251] text-[#181a15] font-bold"
                : "border-transparent text-[#636c5c] hover:text-[#181a15]"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>1-Click Bookmarklet</span>
          </button>
          <button
            onClick={() => setActiveTab("pwa")}
            className={`py-3.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "pwa"
                ? "border-[#8ec251] text-[#181a15] font-bold"
                : "border-transparent text-[#636c5c] hover:text-[#181a15]"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile PWA Share</span>
          </button>
          <button
            onClick={() => setActiveTab("email")}
            className={`py-3.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "email"
                ? "border-[#8ec251] text-[#181a15] font-bold"
                : "border-transparent text-[#636c5c] hover:text-[#181a15]"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Inbound Email API</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-[#363f2e] leading-relaxed">
          {activeTab === "chrome" && (
            <div className="space-y-4">
              <div className="p-4 bg-[#eef4e8] border border-[#d5e0cb] rounded-2xl text-xs text-[#2c401c]">
                🚀 The SafeGuard AI Chrome Extension adds context menu right-click scanning on any webpage, highlights suspicious links, and provides one-tap popup inspection.
              </div>

              {/* Actionable Live Simulation Button */}
              <button
                type="button"
                onClick={handleSimulateChrome}
                className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-[#bef264] hover:bg-[#aee750] text-[#162704] border border-[#a8df4a]/70 shadow-2xs transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>⚡ Simulate Live Browser Context-Menu Scan</span>
              </button>

              <ol className="space-y-3 list-decimal list-inside text-xs text-[#525a4c] pt-1">
                <li>
                  Open your browser and navigate to <code className="px-2 py-0.5 bg-[#f4f7f1] rounded font-mono text-[#181a15] border border-[#dce3d5]">chrome://extensions</code>
                </li>
                <li>
                  Toggle <strong className="text-[#181a15]">Developer mode</strong> in the top-right corner.
                </li>
                <li>
                  Click <strong className="text-[#181a15]">Load unpacked</strong> and select the directory:
                  <div className="mt-1.5 p-2.5 bg-[#f8faf6] border border-[#dce3d5] rounded-xl font-mono text-[11px] text-[#181a15] flex items-center justify-between">
                    <span>chrome-extension/</span>
                    <button
                      onClick={() => copyToClipboard("chrome-extension", "path")}
                      className="text-[#636c5c] hover:text-[#181a15]"
                    >
                      {copied === "path" ? <Check className="w-3.5 h-3.5 text-[#3d5926]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </li>
                <li>
                  Highlight any text or right-click any link on the web to trigger <strong className="text-[#181a15]">&ldquo;🛡️ Passively Inspect with SafeGuard AI&rdquo;</strong>.
                </li>
              </ol>
            </div>
          )}

          {activeTab === "bookmarklet" && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-xs text-purple-900">
                ⚡ Zero install required! Works instantly in any browser (Chrome, Firefox, Safari, Edge, Mobile).
              </div>
              <div className="p-5 bg-[#f8faf6] border border-[#dce3d5] rounded-2xl text-center space-y-3">
                <p className="text-xs text-[#636c5c]">Drag this button to your Bookmarks Toolbar:</p>
                <a
                  href={bookmarkletCode}
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Drag this button to your Bookmarks bar, or copy the code below!");
                  }}
                  className="inline-block px-5 py-2.5 bg-[#bef264] hover:bg-[#aee750] text-[#162704] font-bold text-xs rounded-xl shadow-2xs cursor-grab active:cursor-grabbing border border-[#a8df4a]/70"
                >
                  🛡️ Scan with SafeGuard
                </a>
              </div>
              <div>
                <p className="text-xs text-[#636c5c] mb-1.5">Or copy the bookmarklet JavaScript manually:</p>
                <div className="p-3 bg-[#f8faf6] border border-[#dce3d5] rounded-xl flex items-center justify-between text-[11px] font-mono text-[#181a15]">
                  <span className="truncate max-w-[480px]">{bookmarkletCode}</span>
                  <button
                    onClick={() => copyToClipboard(bookmarkletCode, "bm")}
                    className="ml-2 px-3 py-1 bg-white hover:bg-[#edf2e7] text-[#181a15] border border-[#dce3d5] rounded-lg text-xs flex items-center gap-1 shrink-0 shadow-2xs"
                  >
                    {copied === "bm" ? <Check className="w-3 h-3 text-[#3d5926]" /> : <Copy className="w-3 h-3" />}
                    <span>{copied === "bm" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "pwa" && (
            <div className="space-y-4">
              <div className="p-4 bg-[#eef5e6] border border-[#cbe0b8] rounded-2xl text-xs text-[#2c401c]">
                📲 Mobile Web Share Target enables native &ldquo;Share to SafeGuard&rdquo; directly from WhatsApp, Telegram, or SMS apps!
              </div>

              {/* Actionable Live Simulation Button */}
              <button
                type="button"
                onClick={handleSimulatePwa}
                className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-[#bef264] hover:bg-[#aee750] text-[#162704] border border-[#a8df4a]/70 shadow-2xs transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>⚡ Simulate Live Mobile Share Target (WhatsApp Phish)</span>
              </button>

              <ol className="space-y-2.5 list-decimal list-inside text-xs text-[#525a4c] pt-1">
                <li>Open SafeGuard in Chrome or Safari on your phone.</li>
                <li>Tap browser menu → <strong className="text-[#181a15]">Add to Home Screen</strong> (Install Web App).</li>
                <li>
                  When you receive a suspicious WhatsApp message or SMS, tap <strong className="text-[#181a15]">Share</strong> → select <strong className="text-[#3d5926]">SafeGuard AI</strong>.
                </li>
                <li>The payload is received via Web Share Target and evaluated with passive zero-fetch analysis immediately.</li>
              </ol>
            </div>
          )}

          {activeTab === "email" && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
                📨 Forward suspicious emails directly or integrate with your corporate mail flow via webhooks.
              </div>

              {/* Actionable Live Simulation Button */}
              <button
                type="button"
                onClick={handleSimulateEmail}
                className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-[#bef264] hover:bg-[#aee750] text-[#162704] border border-[#a8df4a]/70 shadow-2xs transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>⚡ Simulate Forwarded Phishing Email Webhook (.EML)</span>
              </button>

              <p className="text-xs text-[#636c5c] pt-1">
                SafeGuard exposes a dedicated inbound mail endpoint at <code className="text-[#181a15] font-mono bg-[#f4f7f1] px-1.5 py-0.5 rounded border border-[#dce3d5]">/api/inbound-mail</code>:
              </p>
              <div className="p-3.5 bg-[#f8faf6] border border-[#dce3d5] rounded-2xl font-mono text-xs text-[#181a15] space-y-2 shadow-2xs">
                <div className="text-[#2c401c] font-bold">POST /api/inbound-mail</div>
                <div className="text-[#525a4c] text-[11px] leading-relaxed">
                  Accepts JSON <code className="text-[#181a15] bg-white px-1 rounded border border-[#dce3d5]">&#123; rawEmail: string, from?: string, subject?: string &#125;</code> or multipart form. Inspects SPF, DKIM, DMARC, display spoofing, and anchor text mismatches with zero network calls.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#edf1e8] bg-[#f8faf6] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white hover:bg-[#edf2e7] text-[#181a15] border border-[#dce3d5] text-xs font-semibold rounded-xl shadow-2xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

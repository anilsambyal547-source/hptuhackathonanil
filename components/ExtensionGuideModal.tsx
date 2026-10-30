"use client";

import React, { useState } from "react";
import { X, Chrome, Bookmark, Smartphone, Mail, Copy, Check, ShieldCheck } from "lucide-react";

interface ExtensionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExtensionGuideModal: React.FC<ExtensionGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"chrome" | "bookmarklet" | "pwa" | "email">("chrome");
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const bookmarkletCode = `javascript:(function(){const sel=window.getSelection().toString()||window.location.href;window.open('http://localhost:3000/?text='+encodeURIComponent(sel),'_blank');})();`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">SafeGuard Multi-Channel Ingestion & Integrations</h2>
              <p className="text-xs text-slate-400">Zero-friction scanning across Browser, Mobile PWA, and Mail</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 px-5 bg-slate-950/40 gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab("chrome")}
            className={`py-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "chrome"
                ? "border-cyan-400 text-cyan-300 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Chrome className="w-4 h-4" />
            <span>Chrome Extension</span>
          </button>
          <button
            onClick={() => setActiveTab("bookmarklet")}
            className={`py-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "bookmarklet"
                ? "border-cyan-400 text-cyan-300 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>1-Click Bookmarklet</span>
          </button>
          <button
            onClick={() => setActiveTab("pwa")}
            className={`py-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "pwa"
                ? "border-cyan-400 text-cyan-300 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile PWA Share</span>
          </button>
          <button
            onClick={() => setActiveTab("email")}
            className={`py-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "email"
                ? "border-cyan-400 text-cyan-300 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Inbound Email API</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-300 leading-relaxed">
          {activeTab === "chrome" && (
            <div className="space-y-4">
              <div className="p-3.5 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-xs text-cyan-300">
                🚀 The SafeGuard AI Chrome Extension adds context menu right-click scanning on any webpage, highlights suspicious links, and provides one-tap popup inspection.
              </div>
              <ol className="space-y-3 list-decimal list-inside text-xs text-slate-300">
                <li>
                  Open your browser and navigate to <code className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-cyan-400">chrome://extensions</code>
                </li>
                <li>
                  Toggle <strong className="text-slate-100">Developer mode</strong> in the top-right corner.
                </li>
                <li>
                  Click <strong className="text-slate-100">Load unpacked</strong> and select the directory:
                  <div className="mt-1.5 p-2 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-amber-300 flex items-center justify-between">
                    <span>chrome-extension/</span>
                    <button
                      onClick={() => copyToClipboard("chrome-extension", "path")}
                      className="text-slate-400 hover:text-cyan-400"
                    >
                      {copied === "path" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </li>
                <li>
                  Highlight any text or right-click any link on the web to trigger <strong className="text-slate-100">&ldquo;🛡️ Passively Inspect with SafeGuard AI&rdquo;</strong>.
                </li>
              </ol>
            </div>
          )}

          {activeTab === "bookmarklet" && (
            <div className="space-y-4">
              <div className="p-3.5 bg-purple-950/30 border border-purple-800/40 rounded-xl text-xs text-purple-300">
                ⚡ Zero install required! Works instantly in any browser (Chrome, Firefox, Safari, Edge, Mobile).
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-3">
                <p className="text-xs text-slate-400">Drag this button to your Bookmarks Toolbar:</p>
                <a
                  href={bookmarkletCode}
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Drag this button to your Bookmarks bar, or copy the code below!");
                  }}
                  className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs rounded-lg shadow-md cursor-grab active:cursor-grabbing hover:opacity-95"
                >
                  🛡️ Scan with SafeGuard
                </a>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1.5">Or copy the bookmarklet JavaScript manually:</p>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span className="truncate max-w-[480px]">{bookmarkletCode}</span>
                  <button
                    onClick={() => copyToClipboard(bookmarkletCode, "bm")}
                    className="ml-2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1 shrink-0"
                  >
                    {copied === "bm" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied === "bm" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "pwa" && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-300">
                📲 Mobile Web Share Target enables native &ldquo;Share to SafeGuard&rdquo; directly from WhatsApp, Telegram, or SMS apps!
              </div>
              <ol className="space-y-2.5 list-decimal list-inside text-xs text-slate-300">
                <li>Open SafeGuard in Chrome or Safari on your phone.</li>
                <li>Tap browser menu → <strong className="text-slate-100">Add to Home Screen</strong> (Install Web App).</li>
                <li>
                  When you receive a suspicious WhatsApp message or SMS, tap <strong className="text-slate-100">Share</strong> → select <strong className="text-cyan-400">SafeGuard AI</strong>.
                </li>
                <li>The payload is received via Web Share Target and evaluated with passive zero-fetch analysis immediately.</li>
              </ol>
            </div>
          )}

          {activeTab === "email" && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-300">
                📨 Forward suspicious emails directly or integrate with your corporate mail flow via webhooks.
              </div>
              <p className="text-xs text-slate-400">
                SafeGuard exposes a dedicated inbound mail endpoint at <code className="text-amber-300 font-mono">/api/inbound-mail</code>:
              </p>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 space-y-2">
                <div className="text-cyan-400">POST /api/inbound-mail</div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  Accepts JSON <code className="text-slate-200">&#123; rawEmail: string, from?: string, subject?: string &#125;</code> or multipart form. Inspects SPF, DKIM, DMARC, display spoofing, and anchor text mismatches with zero network calls.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


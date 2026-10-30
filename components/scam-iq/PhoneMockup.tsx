"use client";

import React from "react";
import {
  Wifi,
  Battery,
  Signal,
  ChevronLeft,
  Mail,
  AlertTriangle,
  Info,
  ExternalLink,
  MessageSquare,
  FileText,
} from "lucide-react";

interface PhoneMockupProps {
  type: "sms" | "chat" | "email" | "notice";
  sender: string;
  timestamp: string;
  content: string;
  url?: string;
  badge?: string;
  highlightWords?: string[];
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  type,
  sender,
  timestamp,
  content,
  url,
  badge,
}) => {
  if (type === "email") {
    return (
      <div className="w-full max-w-xl mx-auto rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden font-sans">
        {/* Email App Header */}
        <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>SecureMail Preview</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/40 text-[10px]">
              EXTERNAL SENDER
            </span>
            <span>{timestamp}</span>
          </div>
        </div>

        {/* Sender Info */}
        <div className="p-4 sm:p-5 bg-slate-900/40 border-b border-slate-800/60 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                {sender.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{sender}</span>
                  {badge && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 font-normal">
                      {badge}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <span>To: me &lt;recipient@mail.in&gt;</span>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Unverified DKIM</span>
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs leading-relaxed text-slate-200 bg-slate-950">
          <div className="whitespace-pre-line text-slate-200 font-sans text-xs sm:text-[13px] leading-relaxed">
            {content}
          </div>

          {url && (
            <div className="pt-2">
              <div className="p-3 bg-slate-900 border border-cyan-500/30 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-[11px] text-cyan-400">
                  <span className="font-semibold flex items-center gap-1">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Embedded Action Link</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">Untrusted Destination</span>
                </div>
                <div className="font-mono text-xs text-white break-all">{url}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (type === "notice") {
    return (
      <div className="w-full max-w-xl mx-auto rounded-3xl bg-slate-950 border border-amber-500/30 shadow-2xl overflow-hidden font-sans relative">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Formal Notice Header */}
        <div className="px-5 py-4 bg-slate-900 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-wide uppercase">
                {sender}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Official Regulatory / Coercive Notice Dispatch
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800/40">
            CONFIDENTIAL / LEGAL
          </span>
        </div>

        {/* Notice Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs text-slate-200">
          <div className="whitespace-pre-line leading-relaxed font-sans text-xs sm:text-[13px] text-slate-200">
            {content}
          </div>

          {url && (
            <div className="p-3 bg-slate-900/80 border border-amber-500/40 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-semibold">
                Designated Enforcement Portal:
              </span>
              <div className="font-mono text-xs text-white break-all">{url}</div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between border-t border-slate-900 text-[10px] text-slate-500 font-mono">
            <span>DISPATCH TIMESTAMP: {timestamp}</span>
            <span>SIMULATED AUDIT ARTIFACT</span>
          </div>
        </div>
      </div>
    );
  }

  // Default: Phone (SMS / Chat) Simulation
  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto rounded-[2.5rem] p-3 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-4 border-slate-700/80 shadow-2xl shadow-cyan-950/20 font-sans">
      {/* Smartphone Inner Screen */}
      <div className="rounded-[2rem] bg-slate-950 border border-slate-800 overflow-hidden flex flex-col">
        {/* Phone Top Notch / Status Bar */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between text-slate-400 text-[11px] font-medium border-b border-slate-900/60">
          <span className="font-semibold text-slate-200">9:41</span>
          {/* Dynamic Island / Camera Notch */}
          <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3 h-3" />
            <span className="text-[10px] font-mono">5G</span>
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Messaging App Bar */}
        <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4 text-cyan-400" />
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-xs">
              {sender.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{sender}</span>
                {badge && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-slate-400">
                    {badge}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{type === "chat" ? "Encrypted Chat" : "SMS / Cellular"}</span>
              </div>
            </div>
          </div>
          <Info className="w-4 h-4 text-slate-500" />
        </div>

        {/* Messages Stream */}
        <div className="p-4 space-y-3 min-h-[220px] bg-gradient-to-b from-slate-950 to-slate-900/90 flex flex-col justify-end">
          <div className="text-center">
            <span className="text-[10px] font-mono text-slate-500 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
              {timestamp}
            </span>
          </div>

          {/* Incoming Message Bubble */}
          <div className="flex items-start gap-2 max-w-[92%]">
            <div className="p-3.5 rounded-2xl rounded-tl-sm bg-slate-800/90 border border-slate-700/60 text-slate-100 text-xs sm:text-[13px] space-y-2.5 shadow-lg">
              <div className="whitespace-pre-line leading-relaxed font-sans">
                {content}
              </div>

              {url && (
                <div className="p-2.5 bg-slate-950/80 border border-cyan-500/30 rounded-xl space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-cyan-400">
                    <ExternalLink className="w-3 h-3" />
                    <span>Attached Link</span>
                  </div>
                  <div className="font-mono text-[11px] text-cyan-300 break-all select-all">
                    {url}
                  </div>
                </div>
              )}

              <div className="text-[9px] font-mono text-slate-400 text-right">
                Delivered
              </div>
            </div>
          </div>
        </div>

        {/* Simulated Input Bar */}
        <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-slate-500 text-xs">
          <span className="text-[11px] text-slate-400 pl-2">Do not reply to this message</span>
          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
            <MessageSquare className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { Compass, AlertTriangle, Flame, ShieldAlert, Sparkles, KeyRound, DollarSign } from "lucide-react";
import { TacticsBreakdown } from "@/lib/types";

interface TacticsRadarCardProps {
  tactics?: TacticsBreakdown;
}

export const TacticsRadarCard: React.FC<TacticsRadarCardProps> = ({ tactics }) => {
  if (!tactics) return null;

  const items = [
    {
      label: "Manufactured Urgency & Panic",
      value: tactics.urgency,
      color: "bg-rose-500",
      textColor: "text-rose-700",
      icon: <Flame className="w-3.5 h-3.5 text-rose-600" />,
      desc: "Artificial countdowns & immediate deadline threats",
    },
    {
      label: "Legal Coercion & Digital Arrest",
      value: tactics.fearCoercion,
      color: "bg-purple-500",
      textColor: "text-purple-700",
      icon: <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />,
      desc: "Police warrants, customs narcotics & court summons",
    },
    {
      label: "Brand & Authority Spoofing",
      value: tactics.authoritySpoofing,
      color: "bg-teal-500",
      textColor: "text-teal-700",
      icon: <AlertTriangle className="w-3.5 h-3.5 text-teal-600" />,
      desc: "Banks, TRAI DLT mismatch, and government portals",
    },
    {
      label: "Financial Bait & Advance Fees",
      value: tactics.financialLure,
      color: "bg-amber-500",
      textColor: "text-amber-800",
      icon: <DollarSign className="w-3.5 h-3.5 text-amber-600" />,
      desc: "Job commissions, crypto doubling & KBC lotteries",
    },
    {
      label: "Credential & UPI PIN Harvesting",
      value: tactics.credentialHarvest,
      color: "bg-emerald-500",
      textColor: "text-[#2c401c]",
      icon: <KeyRound className="w-3.5 h-3.5 text-[#3d5926]" />,
      desc: "NetBanking logins, OTP extraction & QR reverse traps",
    },
  ];

  return (
    <div className="p-6 bg-white border border-[#e2e6dc] rounded-3xl space-y-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#edf1e8]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-700">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-purple-700 font-semibold">
                Vector Profiling Telemetry
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-purple-50 border border-purple-200 text-purple-800">
                5-Axis Vector Profiler
              </span>
            </div>
            <h3 className="text-base font-serif font-bold text-[#181a15]">Psychological Manipulation Analysis</h3>
          </div>
        </div>

        {tactics.dominantTactic && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f7f1] border border-[#dde4d4] text-xs text-[#181a15]">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-[#636c5c]">Primary Vector:</span>
            <span className="font-bold text-purple-800">{tactics.dominantTactic}</span>
          </div>
        )}
      </div>

      {/* 5-Axis Gauges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-[#f8faf6] border border-[#e2e7dc] rounded-2xl flex flex-col justify-between space-y-3 shadow-2xs"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#181a15]">
                  {it.icon}
                  <span className="truncate max-w-[130px]">{it.label.split("&")[0]}</span>
                </div>
                <span className={`font-mono text-sm font-bold ${it.textColor}`}>
                  {it.value}%
                </span>
              </div>
              <p className="text-[10px] text-[#636c5c] leading-tight">
                {it.desc}
              </p>
            </div>

            <div className="space-y-1">
              <div className="w-full bg-[#e6ebdf] h-2 rounded-full overflow-hidden border border-[#dde3d6]">
                <div
                  className={`${it.color} h-full transition-all duration-500 rounded-full`}
                  style={{ width: `${Math.max(4, it.value)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


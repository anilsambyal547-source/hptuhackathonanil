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
      color: "from-rose-500 to-red-600",
      textColor: "text-rose-400",
      icon: <Flame className="w-3.5 h-3.5 text-rose-400" />,
      desc: "Artificial countdowns & immediate deadline threats",
    },
    {
      label: "Legal Coercion & Digital Arrest",
      value: tactics.fearCoercion,
      color: "from-purple-500 to-indigo-600",
      textColor: "text-purple-400",
      icon: <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />,
      desc: "Police warrants, customs narcotics & court summons",
    },
    {
      label: "Brand & Authority Spoofing",
      value: tactics.authoritySpoofing,
      color: "from-cyan-500 to-blue-600",
      textColor: "text-cyan-400",
      icon: <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />,
      desc: "Banks, TRAI DLT mismatch, and government portals",
    },
    {
      label: "Financial Bait & Advance Fees",
      value: tactics.financialLure,
      color: "from-amber-500 to-yellow-600",
      textColor: "text-amber-400",
      icon: <DollarSign className="w-3.5 h-3.5 text-amber-400" />,
      desc: "Job commissions, crypto doubling & KBC lotteries",
    },
    {
      label: "Credential & UPI PIN Harvesting",
      value: tactics.credentialHarvest,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-400",
      icon: <KeyRound className="w-3.5 h-3.5 text-emerald-400" />,
      desc: "NetBanking logins, OTP extraction & QR reverse traps",
    },
  ];

  return (
    <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-5 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold">
                ScamGuard × TrustScan Telemetry
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-purple-950 border border-purple-800/40 text-purple-300">
                5-Axis Vector Profiler
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Psychological Manipulation Analysis</h3>
          </div>
        </div>

        {tactics.dominantTactic && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-400">Primary Vector:</span>
            <span className="font-bold text-purple-300">{tactics.dominantTactic}</span>
          </div>
        )}
      </div>

      {/* 5-Axis Gauges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-2xl flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  {it.icon}
                  <span className="truncate max-w-[130px]">{it.label.split("&")[0]}</span>
                </div>
                <span className={`font-mono text-sm font-bold ${it.textColor}`}>
                  {it.value}%
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                {it.desc}
              </p>
            </div>

            <div className="space-y-1">
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`bg-gradient-to-r ${it.color} h-full transition-all duration-500`}
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


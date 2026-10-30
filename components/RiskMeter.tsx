"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, ShieldAlert, Zap, Globe, Landmark, Brain } from "lucide-react";
import { RiskLevel } from "@/lib/types";

interface RiskMeterProps {
  overallRisk: RiskLevel;
  riskScore: number;
  breakdown: {
    heuristicScore: number;
    urlScore: number;
    impersonationScore: number;
    aiScore: number | null;
    aiAvailable?: boolean;
  };
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ overallRisk, riskScore, breakdown }) => {
  const getRiskConfig = () => {
    switch (overallRisk) {
      case "high":
        return {
          title: "HIGH RISK SCAM",
          badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
          barColor: "bg-rose-500",
          glowColor: "shadow-rose-500/20",
          icon: ShieldAlert,
          description: "Dangerous coercion, credential theft, or malicious links detected.",
        };
      case "suspicious":
        return {
          title: "SUSPICIOUS / UNVERIFIED",
          badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          barColor: "bg-amber-500",
          glowColor: "shadow-amber-500/20",
          icon: AlertTriangle,
          description: "Anomalous patterns or urgency indicators found. Caution advised.",
        };
      case "low":
      default:
        return {
          title: "LOW RISK / PROBABLE LEGITIMATE",
          badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
          barColor: "bg-emerald-500",
          glowColor: "shadow-emerald-500/20",
          icon: ShieldCheck,
          description: "No prominent scam vectors, credential solicitation, or deceptive URLs.",
        };
    }
  };

  const config = getRiskConfig();
  const IconComponent = config.icon;

  return (
    <div className={`bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm ${config.glowColor}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl border ${config.badgeBg}`}>
            <IconComponent className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${config.badgeBg}`}>
                {config.title}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{config.description}</p>
          </div>
        </div>

        {/* Big Score Counter */}
        <div className="text-right flex items-baseline gap-1">
          <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            {riskScore}
          </span>
          <span className="text-xs text-slate-500 font-medium">/ 100</span>
        </div>
      </div>

      {/* Main Animated Progress Bar */}
      <div className="mt-5">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Overall Threat Index</span>
          <span className="font-mono">{riskScore}%</span>
        </div>
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${riskScore}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${config.barColor} shadow-md`}
          />
        </div>
      </div>

      {/* Multi-Method Subsystem Score Cards */}
      <div className="mt-6 pt-5 border-t border-slate-800/80">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Multi-Method Subsystem Attribution
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Heuristic Rules */}
          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Heuristics</span>
              </span>
              <span className="font-mono text-slate-200">{breakdown.heuristicScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{ width: `${breakdown.heuristicScore}%` }}
              />
            </div>
          </div>

          {/* Safe Passive URL */}
          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Passive URL</span>
              </span>
              <span className="font-mono text-slate-200">{breakdown.urlScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-cyan-400 rounded-full"
                style={{ width: `${breakdown.urlScore}%` }}
              />
            </div>
          </div>

          {/* Impersonation Engine */}
          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-purple-400" />
                <span>Impersonation</span>
              </span>
              <span className="font-mono text-slate-200">{breakdown.impersonationScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-purple-400 rounded-full"
                style={{ width: `${breakdown.impersonationScore}%` }}
              />
            </div>
          </div>

          {/* Contextual AI */}
          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-blue-400" />
                <span>Contextual AI</span>
              </span>
              <span className="font-mono text-slate-200 text-[11px]">
                {breakdown.aiScore !== null ? `${breakdown.aiScore}%` : "AI unavailable"}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full ${breakdown.aiScore !== null ? "bg-blue-400" : "bg-slate-700"}`}
                style={{ width: `${breakdown.aiScore ?? 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

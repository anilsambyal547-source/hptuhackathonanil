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
          badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
          barColor: "bg-rose-500",
          glowColor: "shadow-rose-100",
          icon: ShieldAlert,
          description: "Dangerous coercion, credential theft, or malicious links detected.",
        };
      case "suspicious":
        return {
          title: "SUSPICIOUS / UNVERIFIED",
          badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
          barColor: "bg-amber-500",
          glowColor: "shadow-amber-100",
          icon: AlertTriangle,
          description: "Anomalous patterns or urgency indicators found. Caution advised.",
        };
      case "low":
      default:
        return {
          title: "LOW RISK / PROBABLE LEGITIMATE",
          badgeBg: "bg-[#eef4e8] text-[#3d5926] border-[#d5e0cb]",
          barColor: "bg-[#7db432]",
          glowColor: "shadow-emerald-50",
          icon: ShieldCheck,
          description: "No prominent scam vectors, credential solicitation, or deceptive URLs.",
        };
    }
  };

  const config = getRiskConfig();
  const IconComponent = config.icon;

  return (
    <div
      role="region"
      aria-label="Risk Assessment Meter"
      aria-live="polite"
      className="bg-white border border-[#e2e6dc] rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#edf1e8] pb-5">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl border ${config.badgeBg}`}>
            <IconComponent className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${config.badgeBg}`}>
                {config.title}
              </span>
            </div>
            <p className="text-xs text-[#636c5c] mt-1">{config.description}</p>
          </div>
        </div>

        {/* Big Score Counter */}
        <div className="text-right flex items-baseline gap-1">
          <span className="text-4xl sm:text-5xl font-serif font-bold text-[#181a15] tracking-tight">
            {riskScore}
          </span>
          <span className="text-xs text-[#717a69] font-medium">/ 100</span>
        </div>
      </div>

      {/* Main Animated Progress Bar */}
      <div className="mt-5">
        <div className="flex justify-between text-xs text-[#636c5c] mb-2 font-medium">
          <span>Overall Threat Index</span>
          <span className="font-mono text-[#181a15] font-semibold">{riskScore}%</span>
        </div>
        <div className="w-full h-3 bg-[#eef2e9] rounded-full overflow-hidden p-0.5 border border-[#dde3d6]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${riskScore}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${config.barColor} shadow-xs`}
          />
        </div>
      </div>

      {/* Multi-Method Subsystem Score Cards */}
      <div className="mt-6 pt-5 border-t border-[#edf1e8]">
        <h4 className="text-xs font-semibold text-[#636c5c] uppercase tracking-wider mb-3">
          Multi-Method Subsystem Attribution
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Heuristic Rules */}
          <div className="bg-[#f8faf6] border border-[#e2e7dc] rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-xs text-[#525a4c] mb-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Heuristics</span>
              </span>
              <span className="font-mono text-[#181a15] font-semibold">{breakdown.heuristicScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#e4e9de] rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${breakdown.heuristicScore}%` }}
              />
            </div>
          </div>

          {/* Safe Passive URL */}
          <div className="bg-[#f8faf6] border border-[#e2e7dc] rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-xs text-[#525a4c] mb-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Globe className="w-3.5 h-3.5 text-teal-600" />
                <span>Passive URL</span>
              </span>
              <span className="font-mono text-[#181a15] font-semibold">{breakdown.urlScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#e4e9de] rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-teal-500 rounded-full"
                style={{ width: `${breakdown.urlScore}%` }}
              />
            </div>
          </div>

          {/* Impersonation Engine */}
          <div className="bg-[#f8faf6] border border-[#e2e7dc] rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-xs text-[#525a4c] mb-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Landmark className="w-3.5 h-3.5 text-purple-600" />
                <span>Impersonation</span>
              </span>
              <span className="font-mono text-[#181a15] font-semibold">{breakdown.impersonationScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#e4e9de] rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${breakdown.impersonationScore}%` }}
              />
            </div>
          </div>

          {/* Contextual AI */}
          <div className="bg-[#f8faf6] border border-[#e2e7dc] rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-xs text-[#525a4c] mb-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Brain className="w-3.5 h-3.5 text-blue-600" />
                <span>Contextual AI</span>
              </span>
              <span className="font-mono text-[#181a15] font-semibold text-[11px]">
                {breakdown.aiScore !== null ? `${breakdown.aiScore}%` : "AI unavailable"}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#e4e9de] rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full ${breakdown.aiScore !== null ? "bg-blue-500" : "bg-[#c8cfc1]"}`}
                style={{ width: `${breakdown.aiScore ?? 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

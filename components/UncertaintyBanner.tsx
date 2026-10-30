"use client";

import React from "react";
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";
import { UncertaintyReport } from "@/lib/types";

interface UncertaintyBannerProps {
  uncertainty: UncertaintyReport;
}

export const UncertaintyBanner: React.FC<UncertaintyBannerProps> = ({ uncertainty }) => {
  const getLevelConfig = () => {
    switch (uncertainty.uncertaintyLevel) {
      case "high":
        return {
          bg: "bg-amber-950/30 border-amber-800/60 text-amber-300",
          badge: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
          icon: AlertCircle,
          label: "High Uncertainty / Inconclusive Evidence",
        };
      case "moderate":
        return {
          bg: "bg-blue-950/30 border-blue-800/60 text-blue-300",
          badge: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
          icon: HelpCircle,
          label: "Moderate Uncertainty / Partial Context",
        };
      case "low":
      default:
        return {
          bg: "bg-emerald-950/20 border-emerald-800/40 text-emerald-300",
          badge: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
          icon: CheckCircle2,
          label: "High Analysis Confidence",
        };
    }
  };

  const config = getLevelConfig();
  const IconComponent = config.icon;

  return (
    <div className={`border rounded-2xl p-5 ${config.bg} backdrop-blur-sm shadow-md`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <IconComponent className="w-5 h-5 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide">
            Uncertainty & Transparency Assessment
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${config.badge}`}>
            {uncertainty.confidencePercent}% Confidence
          </span>
        </div>

        <span className="text-xs opacity-75 font-medium">{config.label}</span>
      </div>

      <div className="mt-3 space-y-2">
        <p className="text-xs leading-relaxed text-slate-200">
          {uncertainty.recommendation}
        </p>

        {uncertainty.reasons && uncertainty.reasons.length > 0 && (
          <div className="pt-2">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">
              Calibration Factors:
            </span>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
              {uncertainty.reasons.map((reason, idx) => (
                <li key={idx} className="leading-snug">
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};


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
          bg: "bg-amber-50/70 border-amber-200 text-amber-900",
          badge: "bg-amber-100 text-amber-900 border border-amber-300",
          icon: AlertCircle,
          label: "High Uncertainty / Inconclusive Evidence",
        };
      case "moderate":
        return {
          bg: "bg-blue-50/70 border-blue-200 text-blue-900",
          badge: "bg-blue-100 text-blue-900 border border-blue-300",
          icon: HelpCircle,
          label: "Moderate Uncertainty / Partial Context",
        };
      case "low":
      default:
        return {
          bg: "bg-[#eef5e6] border-[#cbe0b8] text-[#2c401c]",
          badge: "bg-white text-[#2c401c] border border-[#cbe0b8]",
          icon: CheckCircle2,
          label: "High Analysis Confidence",
        };
    }
  };

  const config = getLevelConfig();
  const IconComponent = config.icon;

  return (
    <div className={`border rounded-3xl p-5 sm:p-6 ${config.bg} shadow-xs`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-black/5 pb-3.5">
        <div className="flex items-center gap-2.5">
          <IconComponent className="w-5 h-5 shrink-0" />
          <span className="text-sm font-serif font-bold tracking-tight">
            Uncertainty & Transparency Assessment
          </span>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${config.badge}`}>
            {uncertainty.confidencePercent}% Confidence
          </span>
        </div>

        <span className="text-xs font-semibold opacity-85">{config.label}</span>
      </div>

      <div className="mt-3.5 space-y-2">
        <p className="text-xs sm:text-sm leading-relaxed opacity-95">
          {uncertainty.recommendation}
        </p>

        {uncertainty.reasons && uncertainty.reasons.length > 0 && (
          <div className="pt-2">
            <span className="text-[11px] font-semibold opacity-75 block mb-1">
              Confidence Assessment Factors:
            </span>
            <ul className="list-disc list-inside space-y-1 text-xs opacity-90">
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

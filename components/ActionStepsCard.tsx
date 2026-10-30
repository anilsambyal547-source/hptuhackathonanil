"use client";

import React from "react";
import { SafeActionStep } from "@/lib/types";
import { CheckSquare, PhoneCall, ExternalLink, LifeBuoy } from "lucide-react";

interface ActionStepsCardProps {
  actionSteps: SafeActionStep[];
  plainLanguageSummary: string;
  onOpenAssistance?: () => void;
}

export const ActionStepsCard: React.FC<ActionStepsCardProps> = ({
  actionSteps,
  plainLanguageSummary,
  onOpenAssistance,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-5">
      {/* Plain Language Summary */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <LifeBuoy className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Plain-Language Risk Assessment
          </h3>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 font-normal">
          {plainLanguageSummary}
        </p>

        {onOpenAssistance && (
          <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 border border-rose-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <span>🚨 Already transferred money or shared sensitive details?</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Launch the Victim Recovery Assistant for immediate 1930 reporting, bank freeze steps, and official complaint filing.
              </p>
            </div>
            <button
              onClick={onOpenAssistance}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs whitespace-nowrap shadow-md shadow-rose-600/20 transition-all shrink-0"
            >
              Get Emergency Assistance →
            </button>
          </div>
        )}
      </div>

      {/* Action Steps Checklist */}
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Safe Actionable Next Steps
            </h4>
          </div>
          <span className="text-xs text-slate-400">
            Follow in recommended order
          </span>
        </div>

        <div className="space-y-3">
          {actionSteps.map((step, idx) => (
            <div
              key={step.id || idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-xs font-bold text-cyan-300 font-mono">
                    {idx + 1}
                  </span>
                  <h5 className="text-xs sm:text-sm font-semibold text-slate-100">
                    {step.title}
                  </h5>
                </div>

                <span
                  className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                    step.priority === "immediate"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : step.priority === "recommended"
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {step.priority}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-7">
                {step.instruction}
              </p>

              <div className="mt-2 pl-7 pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                <span className="italic">Why: {step.why}</span>

                <div className="flex items-center gap-2 shrink-0">
                  {step.phoneHelpline && (
                    <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40 font-mono">
                      <PhoneCall className="w-3 h-3" />
                      <span>{step.phoneHelpline}</span>
                    </span>
                  )}

                  {step.officialPortalUrl && (
                    <a
                      href={step.officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


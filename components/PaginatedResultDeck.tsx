"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Layers,
  FileSearch,
  Radar,
  LifeBuoy,
  Shield,
} from "lucide-react";
import { ScamAnalysisResult } from "@/lib/types";
import { RiskMeter } from "./RiskMeter";
import { MultiEngineBreakdown } from "./MultiEngineBreakdown";
import { UncertaintyBanner } from "./UncertaintyBanner";
import { EvidenceHighlighter } from "./EvidenceHighlighter";
import { SafeUrlInspectorCard } from "./SafeUrlInspectorCard";
import { TacticsRadarCard } from "./TacticsRadarCard";
import { EmailForensicsCard } from "./EmailForensicsCard";
import { ActionStepsCard } from "./ActionStepsCard";

interface PaginatedResultDeckProps {
  analysisResult: ScamAnalysisResult;
  onOpenRecoveryAssistant: () => void;
  onReset: () => void;
}

export const PaginatedResultDeck: React.FC<PaginatedResultDeckProps> = ({
  analysisResult,
  onOpenRecoveryAssistant,
  onReset,
}) => {
  // 4 Focused Result Stages
  // 1: Verdict & Engines
  // 2: Evidence & URL Sandbox
  // 3: Forensics & Psychological Tactics
  // 4: Recovery Checklist & Helplines
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  const steps = [
    {
      id: 1,
      title: "Verdict & Score",
      icon: Layers,
      description: "Risk score & multi-engine attribution",
    },
    {
      id: 2,
      title: "Evidence & Sandbox",
      icon: FileSearch,
      description: "Highlighted spans & safe URL sandbox",
    },
    {
      id: 3,
      title: "Forensics & Tactics",
      icon: Radar,
      description: "5-axis radar & RFC-822 email headers",
    },
    {
      id: 4,
      title: "Recovery & Action Plan",
      icon: LifeBuoy,
      description: "Personalized action plan & 1930 routing",
    },
  ];

  const getRiskBadge = () => {
    switch (analysisResult.overallRisk) {
      case "high":
        return {
          bg: "bg-rose-50 text-rose-700 border-rose-200",
          dot: "bg-rose-600",
          icon: ShieldAlert,
          label: "HIGH RISK TRAP",
        };
      case "suspicious":
        return {
          bg: "bg-amber-50 text-amber-800 border-amber-200",
          dot: "bg-amber-600",
          icon: AlertTriangle,
          label: "SUSPICIOUS THREAT",
        };
      default:
        return {
          bg: "bg-[#eef5e6] text-[#3d5926] border-[#d5e0cb]",
          dot: "bg-[#5c8a27]",
          icon: ShieldCheck,
          label: "VERIFIED LEGITIMATE",
        };
    }
  };

  const riskBadge = getRiskBadge();
  const RiskIcon = riskBadge.icon;

  return (
    <div className="space-y-6 pt-2 animate-in fade-in duration-300">
      {/* macOS Window Chrome Header Bar */}
      <div className="bg-white/90 backdrop-blur-xl border border-[#e2e6dc] rounded-3xl p-4 sm:p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* macOS Traffic Lights + Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 shrink-0 pl-1">
            <span className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/30" />
            <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/30" />
            <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/30" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base sm:text-lg text-[#181a15]">
                DIGIkavach Evidentiary Audit Deck
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${riskBadge.bg}`}
              >
                <RiskIcon className="w-3.5 h-3.5" />
                <span>{riskBadge.label}</span>
              </span>
            </div>
            <p className="text-xs text-[#636c5c] hidden sm:block">
              Inspecting one forensic dimension at a time • Zero vertical scroll overload
            </p>
          </div>
        </div>

        {/* Action: New Scan Button */}
        <button
          onClick={onReset}
          className="self-stretch sm:self-auto px-4 py-2 rounded-2xl text-xs font-semibold bg-[#f7f9f5] hover:bg-[#eef2e7] text-[#181a15] border border-[#e2e6dc] transition-all flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#636c5c]" />
          <span>New Scan</span>
        </button>
      </div>

      {/* macOS Segmented Stage Switcher Navigation */}
      <div className="bg-white/80 backdrop-blur-xl border border-[#e2e6dc] rounded-2xl p-1.5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] flex items-center justify-between overflow-x-auto gap-1">
        {steps.map((step) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id as 1 | 2 | 3 | 4)}
              className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2.5 justify-center ${
                isActive
                  ? "bg-[#181a15] text-white shadow-xs font-semibold"
                  : "text-[#636c5c] hover:text-[#181a15] hover:bg-[#f7f9f5]"
              }`}
            >
              <StepIcon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#bef264]" : "text-[#717a69]"}`} />
              <div className="text-left">
                <div className="leading-tight font-semibold">{step.title}</div>
                <div className={`text-[10px] hidden md:block ${isActive ? "text-slate-300" : "text-[#8c9682]"}`}>
                  Stage {step.id} of 4
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Focused Stage Container (Render ONLY Current Stage) */}
      <div className="transition-all duration-300">
        {/* STAGE 1: Verdict & Multi-Engine Breakdown */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Visual Risk Meter */}
            <RiskMeter
              overallRisk={analysisResult.overallRisk}
              riskScore={analysisResult.riskScore}
              breakdown={analysisResult.metricsBreakdown}
            />

            {/* 4-Engine Multi-Method Detection Breakdown */}
            <MultiEngineBreakdown
              metricsBreakdown={analysisResult.metricsBreakdown}
              heuristicsHits={analysisResult.heuristicsHits}
              urlReports={analysisResult.urlReports}
              impersonationMatch={analysisResult.impersonationMatch}
              aiAnalysis={analysisResult.aiAnalysis}
              confidencePercent={analysisResult.uncertainty.confidencePercent}
            />

            {/* Calibrated Uncertainty Banner */}
            <UncertaintyBanner uncertainty={analysisResult.uncertainty} />
          </div>
        )}

        {/* STAGE 2: Evidentiary Spans & Passive URL Sandbox */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Evidentiary Highlighting Spans */}
            <EvidenceHighlighter
              text={analysisResult.inputText}
              spans={analysisResult.evidenceSpans}
            />

            {/* Safe Passive URL Sandbox Findings */}
            <SafeUrlInspectorCard urlReports={analysisResult.urlReports} />
          </div>
        )}

        {/* STAGE 3: Tactics Radar & Email Forensics */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* 5-Axis Psychological Manipulation Radar */}
            {analysisResult.tacticsBreakdown ? (
              <TacticsRadarCard tactics={analysisResult.tacticsBreakdown} />
            ) : (
              <div className="p-8 bg-white border border-[#e2e6dc] rounded-3xl text-center space-y-2">
                <Radar className="w-8 h-8 text-[#636c5c] mx-auto opacity-50" />
                <h4 className="font-serif text-base font-bold text-[#181a15]">
                  No Psychological Coercion Detected
                </h4>
                <p className="text-xs text-[#636c5c]">
                  The analyzed message does not display urgent social engineering tactics.
                </p>
              </div>
            )}

            {/* Email Header & Authentication Forensics (when applicable) */}
            {analysisResult.emailForensics ? (
              <EmailForensicsCard emailForensics={analysisResult.emailForensics} />
            ) : (
              <div className="p-6 bg-white border border-[#e2e6dc] rounded-2xl text-xs text-[#636c5c] flex items-center justify-between">
                <span>RFC-822 Email Forensics: Not applicable for raw text or screenshot payload.</span>
                <span className="font-mono text-[11px] text-[#3d5926]">Clean Execution</span>
              </div>
            )}
          </div>
        )}

        {/* STAGE 4: Recovery Action Plan & Helplines */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Plain-Language Assessment & Action Steps + Forensic Export + Victim Help */}
            <ActionStepsCard
              actionSteps={analysisResult.actionSteps}
              plainLanguageSummary={analysisResult.plainLanguageSummary}
              fullResult={analysisResult}
              onOpenAssistance={onOpenRecoveryAssistant}
            />

            {/* Safety & Compliance Disclaimer */}
            <div className="p-4 bg-white border border-[#e2e6dc] rounded-2xl text-xs text-[#5c6454] leading-relaxed flex items-start gap-2.5 shadow-xs">
              <Shield className="w-4 h-4 text-[#3d5926] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#181a15]">Security & Privacy Guarantee: </span>
                {analysisResult.disclaimer}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom macOS Stage Navigation Dock */}
      <div className="p-4 bg-white/90 backdrop-blur-xl border border-[#e2e6dc] rounded-3xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] flex items-center justify-between gap-3">
        {/* Previous Button */}
        <button
          onClick={() => setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4) : prev))}
          disabled={currentStep === 1}
          className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            currentStep === 1
              ? "opacity-40 cursor-not-allowed text-[#8c9682]"
              : "bg-[#f7f9f5] hover:bg-[#eef2e7] text-[#181a15] border border-[#e2e6dc] shadow-2xs"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Stage</span>
        </button>

        {/* Stage Dot Indicator */}
        <div className="flex items-center gap-2">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(s.id as 1 | 2 | 3 | 4)}
              className={`h-2.5 rounded-full transition-all ${
                currentStep === s.id
                  ? "w-8 bg-[#181a15]"
                  : "w-2.5 bg-[#dce3d5] hover:bg-[#b0c897]"
              }`}
              title={`Jump to Stage ${s.id}: ${s.title}`}
            />
          ))}
          <span className="text-xs font-mono text-[#636c5c] pl-1 font-semibold">
            Stage {currentStep} of 4
          </span>
        </div>

        {/* Next Button */}
        {currentStep < 4 ? (
          <button
            onClick={() => setCurrentStep((prev) => (prev < 4 ? ((prev + 1) as 1 | 2 | 3 | 4) : prev))}
            className="px-5 py-2.5 rounded-2xl text-xs font-bold text-[#162704] bg-[#bef264] hover:bg-[#aee750] border border-[#a8df4a]/70 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span>Next Stage: {steps[currentStep].title}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onOpenRecoveryAssistant}
            className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Open Victim Assistance</span>
          </button>
        )}
      </div>
    </div>
  );
};

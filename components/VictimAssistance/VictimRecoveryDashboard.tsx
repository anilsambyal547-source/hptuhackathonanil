"use client";

import React, { useState } from "react";
import {
  LifeBuoy,
  Languages,
  ArrowLeft,
  FileText,
  Building2,
  BookmarkCheck,
  CheckSquare,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { ScamCategoryType, Language } from "@/lib/types/recovery";
import { EmergencyBanner } from "./EmergencyBanner";
import { ScamCategoryRouter } from "./ScamCategoryRouter";
import { RecoveryChecklist } from "./RecoveryChecklist";
import { EvidenceOrganizer } from "./EvidenceOrganizer";
import { AuthorityDirectory } from "./AuthorityDirectory";
import { ComplaintTracker } from "./ComplaintTracker";

interface VictimRecoveryDashboardProps {
  initialCategory?: ScamCategoryType;
  prefilledUrl?: string;
  prefilledText?: string;
  isAiImported?: boolean;
  onBackToScanner?: () => void;
}

export const VictimRecoveryDashboard: React.FC<VictimRecoveryDashboardProps> = ({
  initialCategory = "banking_upi",
  prefilledUrl = "",
  prefilledText = "",
  isAiImported = false,
  onBackToScanner,
}) => {
  const [language, setLanguage] = useState<Language>("en");
  const [selectedCategory, setSelectedCategory] = useState<ScamCategoryType>(initialCategory);
  const [hasLostMoney, setHasLostMoney] = useState<boolean>(true);
  const [activeSubSection, setActiveSubSection] = useState<
    "actions" | "evidence" | "authorities" | "tracker"
  >("actions");

  const isHi = language === "hi";

  const RECOVERY_STAGES = [
    {
      id: "actions" as const,
      labelEn: "1. Action Plan",
      labelHi: "१. कार्ययोजना",
      descEn: "Golden hour emergency checklist",
      descHi: "स्वर्णिम घंटे की आपातकालीन चेकलिस्ट",
      icon: CheckSquare,
    },
    {
      id: "evidence" as const,
      labelEn: "2. Evidence Prep",
      labelHi: "२. सबूत तैयार करें",
      descEn: "Organize logs, receipts & draft report",
      descHi: "लेनदेन विवरण एवं शिकायत का प्रारूप",
      icon: FileText,
    },
    {
      id: "authorities" as const,
      labelEn: "3. Official Portals",
      labelHi: "३. आधिकारिक पोर्टल",
      descEn: "1930 Helpline, RBI, Sanchar Saathi",
      descHi: "१९३० हेल्पलाइन, आरबीआई, संचार साथी",
      icon: Building2,
    },
    {
      id: "tracker" as const,
      labelEn: "4. Track Complaints",
      labelHi: "४. शिकायत ट्रैकर",
      descEn: "Manage statutory complaint IDs",
      descHi: "दर्ज शिकायतों की स्थिति ट्रैक करें",
      icon: BookmarkCheck,
    },
  ];

  const currentStageIndex = RECOVERY_STAGES.findIndex((s) => s.id === activeSubSection);
  const currentStage = RECOVERY_STAGES[currentStageIndex] || RECOVERY_STAGES[0];

  const handleNextStage = () => {
    if (currentStageIndex < RECOVERY_STAGES.length - 1) {
      setActiveSubSection(RECOVERY_STAGES[currentStageIndex + 1].id);
      window.scrollTo({ top: 380, behavior: "smooth" });
    }
  };

  const handlePrevStage = () => {
    if (currentStageIndex > 0) {
      setActiveSubSection(RECOVERY_STAGES[currentStageIndex - 1].id);
      window.scrollTo({ top: 380, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Bar with Language Selector and Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white border border-[#e2e6dc] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          {onBackToScanner && (
            <button
              onClick={onBackToScanner}
              className="p-2.5 rounded-2xl bg-[#f4f7f1] hover:bg-[#edf2e7] text-[#181a15] border border-[#dce3d5] transition-colors shadow-2xs"
              title="Return to Scam Scanner"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200">
              <LifeBuoy className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-serif font-bold text-[#181a15] tracking-tight">
                  {isHi ? "साइबर पीड़ित सहायता एवं शिकायत केंद्र" : "Scam Victim Recovery & Official Complaint Assistant"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                  National Triage
                </span>
              </div>
              <p className="text-xs text-[#636c5c]">
                {isHi
                  ? "सत्यापित भारत सरकार के पोर्टल, 1930 हेल्पलाइन और कानूनी मार्गदर्शन"
                  : "Official Government of India Portals, 1930 Cyber Fraud Line, & Statutory Redress"}
              </p>
            </div>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#f4f7f1] border border-[#dce3d5] text-xs">
            <Languages className="w-3.5 h-3.5 text-[#3d5926]" />
            <button
              onClick={() => setLanguage("en")}
              className={`font-semibold px-2.5 py-0.5 rounded-xl transition-colors ${
                language === "en" ? "bg-[#181a15] text-white shadow-2xs" : "text-[#636c5c] hover:text-[#181a15]"
              }`}
            >
              English
            </button>
            <span className="text-[#ccd4c4]">|</span>
            <button
              onClick={() => setLanguage("hi")}
              className={`font-semibold px-2.5 py-0.5 rounded-xl transition-colors ${
                language === "hi" ? "bg-[#181a15] text-white shadow-2xs" : "text-[#636c5c] hover:text-[#181a15]"
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* 1. Emergency Golden Hour Banner */}
      <EmergencyBanner
        language={language}
        hasLostMoney={hasLostMoney}
        onToggleLostMoney={setHasLostMoney}
      />

      {/* 2. Scam Category Identification Wizard */}
      <ScamCategoryRouter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        language={language}
        isAiDetected={isAiImported}
      />

      {/* 3. macOS Segmented 4-Stage Step Bar (One Stage at a Time, Zero Scroll Overload) */}
      <div className="bg-white/90 backdrop-blur-xl border border-[#e2e6dc] rounded-3xl p-3 sm:p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-3">
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8ec251] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#181a15]">
              {isHi ? "पीड़ित पुनर्प्राप्ति चरण" : "Victim Recovery Workflow"}
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#636c5c]">
            {isHi
              ? `चरण ${currentStageIndex + 1} / ४: ${currentStage.labelHi}`
              : `Step ${currentStageIndex + 1} of 4: ${currentStage.labelEn}`}
          </span>
        </div>

        {/* Segmented Stages Switcher */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {RECOVERY_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = activeSubSection === stage.id;
            const isCompleted = idx < currentStageIndex;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveSubSection(stage.id)}
                className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                  isSelected
                    ? "bg-[#181a15] text-white border-[#181a15] shadow-xs"
                    : isCompleted
                    ? "bg-[#f4f8ee] text-[#2c401c] border-[#cbe0b8] hover:border-[#8ec251]"
                    : "bg-[#fbfcf9] text-[#586150] border-[#e2e8dc] hover:border-[#ccd4c4]"
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl shrink-0 ${
                    isSelected
                      ? "bg-white/10 text-[#bef264]"
                      : isCompleted
                      ? "bg-[#e2edd8] text-[#3d5926]"
                      : "bg-[#edf1e8] text-[#717a69]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold truncate">
                    {isHi ? stage.labelHi : stage.labelEn}
                  </div>
                  <div
                    className={`text-[10px] truncate ${
                      isSelected ? "text-white/70" : "text-[#717a69]"
                    }`}
                  >
                    {isHi ? stage.descHi : stage.descEn}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Active Stage Component (Renders exactly one focused stage) */}
      <div className="space-y-6">
        {activeSubSection === "actions" && (
          <div className="animate-in fade-in duration-200">
            <RecoveryChecklist
              selectedCategory={selectedCategory}
              language={language}
              hasLostMoney={hasLostMoney}
            />
          </div>
        )}

        {activeSubSection === "evidence" && (
          <div className="animate-in fade-in duration-200">
            <EvidenceOrganizer
              selectedCategory={selectedCategory}
              language={language}
              prefilledUrl={prefilledUrl}
              prefilledText={prefilledText}
            />
          </div>
        )}

        {activeSubSection === "authorities" && (
          <div className="animate-in fade-in duration-200">
            <AuthorityDirectory
              selectedCategory={selectedCategory}
              language={language}
            />
          </div>
        )}

        {activeSubSection === "tracker" && (
          <div className="animate-in fade-in duration-200">
            <ComplaintTracker language={language} />
          </div>
        )}

        {/* Bottom macOS Stage Navigation Dock */}
        <div className="p-4 bg-white/90 backdrop-blur-xl border border-[#e2e6dc] rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Previous Stage Button */}
          <button
            type="button"
            onClick={handlePrevStage}
            disabled={currentStageIndex === 0}
            className="w-full sm:w-auto px-4 py-2 rounded-2xl text-xs font-semibold text-[#181a15] bg-[#f7f9f5] hover:bg-[#edf2e7] border border-[#dce3d5] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{isHi ? "पिछला चरण" : "Previous Stage"}</span>
          </button>

          {/* Step Dots */}
          <div className="flex items-center gap-2">
            {RECOVERY_STAGES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSubSection(s.id)}
                className={`transition-all rounded-full ${
                  idx === currentStageIndex
                    ? "w-7 h-2 bg-[#181a15]"
                    : idx < currentStageIndex
                    ? "w-2.5 h-2.5 bg-[#8ec251]"
                    : "w-2.5 h-2.5 bg-[#dde3d6]"
                }`}
                title={isHi ? s.labelHi : s.labelEn}
              />
            ))}
          </div>

          {/* Next Stage Button */}
          {currentStageIndex < RECOVERY_STAGES.length - 1 ? (
            <button
              type="button"
              onClick={handleNextStage}
              className="w-full sm:w-auto px-5 py-2 rounded-2xl text-xs font-bold text-[#162704] bg-[#bef264] hover:bg-[#aee750] border border-[#a8df4a]/70 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>
                {isHi
                  ? `अगला: ${RECOVERY_STAGES[currentStageIndex + 1].labelHi}`
                  : `Next: ${RECOVERY_STAGES[currentStageIndex + 1].labelEn}`}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="px-4 py-2 rounded-2xl text-xs font-bold text-[#2c401c] bg-[#eef5e6] border border-[#cbe0b8] flex items-center gap-1.5">
              <span>{isHi ? "✓ सभी चरण पूर्ण" : "✓ All Steps Complete"}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

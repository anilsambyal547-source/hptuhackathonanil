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
    "all" | "actions" | "evidence" | "authorities" | "tracker"
  >("all");

  const isHi = language === "hi";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Bar with Language Selector and Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          {onBackToScanner && (
            <button
              onClick={onBackToScanner}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Return to Scam Scanner"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <LifeBuoy className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {isHi ? "साइबर पीड़ित सहायता एवं शिकायत केंद्र" : "Scam Victim Recovery & Official Complaint Assistant"}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-950/80 text-rose-300 border border-rose-800/40">
                  National Triage
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isHi
                  ? "सत्यापित भारत सरकार के पोर्टल, 1930 हेल्पलाइन और कानूनी मार्गदर्शन"
                  : "Official Government of India Portals, 1930 Cyber Fraud Line, & Statutory Redress"}
              </p>
            </div>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <Languages className="w-3.5 h-3.5 text-cyan-400" />
            <button
              onClick={() => setLanguage("en")}
              className={`font-semibold px-2 py-0.5 rounded transition-colors ${
                language === "en" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:text-white"
              }`}
            >
              English
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setLanguage("hi")}
              className={`font-semibold px-2 py-0.5 rounded transition-colors ${
                language === "hi" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:text-white"
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

      {/* Section Quick Jump Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveSubSection("all")}
          className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeSubSection === "all"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          {isHi ? "संपूर्ण गाइड (All Sections)" : "Complete Guide (All Sections)"}
        </button>

        <button
          onClick={() => setActiveSubSection("actions")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeSubSection === "actions"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>{isHi ? "कार्ययोजना" : "Action Plan"}</span>
        </button>

        <button
          onClick={() => setActiveSubSection("evidence")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeSubSection === "evidence"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{isHi ? "सबूत तैयार करें" : "Evidence Prep"}</span>
        </button>

        <button
          onClick={() => setActiveSubSection("authorities")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeSubSection === "authorities"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>{isHi ? "आधिकारिक पोर्टल" : "Official Portals"}</span>
        </button>

        <button
          onClick={() => setActiveSubSection("tracker")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeSubSection === "tracker"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          <BookmarkCheck className="w-3.5 h-3.5" />
          <span>{isHi ? "शिकायत ट्रैकर" : "Track Complaints"}</span>
        </button>
      </div>

      {/* 2. Scam Category Identification Wizard */}
      <ScamCategoryRouter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        language={language}
        isAiDetected={isAiImported}
      />

      {/* 3. Action Plan Checklist */}
      {(activeSubSection === "all" || activeSubSection === "actions") && (
        <RecoveryChecklist
          selectedCategory={selectedCategory}
          language={language}
          hasLostMoney={hasLostMoney}
        />
      )}

      {/* 4. Evidence Organizer */}
      {(activeSubSection === "all" || activeSubSection === "evidence") && (
        <EvidenceOrganizer
          selectedCategory={selectedCategory}
          language={language}
          prefilledUrl={prefilledUrl}
          prefilledText={prefilledText}
        />
      )}

      {/* 5. Official Authority Directory */}
      {(activeSubSection === "all" || activeSubSection === "authorities") && (
        <AuthorityDirectory
          selectedCategory={selectedCategory}
          language={language}
        />
      )}

      {/* 6. Complaint Tracker */}
      {(activeSubSection === "all" || activeSubSection === "tracker") && (
        <ComplaintTracker language={language} />
      )}
    </div>
  );
};

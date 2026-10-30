"use client";

import React from "react";
import {
  Landmark,
  ShieldAlert,
  TrendingUp,
  Package,
  UserX,
  Briefcase,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { ScamCategoryType, Language } from "@/lib/types/recovery";
import { SCAM_CATEGORIES } from "@/lib/data/scam-routing";

interface ScamCategoryRouterProps {
  selectedCategory: ScamCategoryType;
  onSelectCategory: (cat: ScamCategoryType) => void;
  language: Language;
  isAiDetected?: boolean;
}

export const ScamCategoryRouter: React.FC<ScamCategoryRouterProps> = ({
  selectedCategory,
  onSelectCategory,
  language,
  isAiDetected = false,
}) => {
  const isHi = language === "hi";

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Landmark":
        return <Landmark className="w-5 h-5" />;
      case "ShieldAlert":
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case "TrendingUp":
        return <TrendingUp className="w-5 h-5 text-amber-400" />;
      case "Package":
        return <Package className="w-5 h-5 text-cyan-400" />;
      case "UserX":
        return <UserX className="w-5 h-5 text-indigo-400" />;
      case "Briefcase":
        return <Briefcase className="w-5 h-5 text-emerald-400" />;
      default:
        return <HelpCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const currentCategoryDetail = SCAM_CATEGORIES.find((c) => c.id === selectedCategory) || SCAM_CATEGORIES[0];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>{isHi ? "1. अपनी धोखाधड़ी की श्रेणी चुनें" : "1. Identify What Happened"}</span>
            {isAiDetected && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                {isHi ? "AI स्कैनर द्वारा ऑटो-डिटेक्ट" : "Auto-Identified from Scan"}
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400">
            {isHi
              ? "सही श्रेणी चुनने से आपको संबंधित आधिकारिक पोर्टल, कानूनी नियम और हेल्पलाइन प्राप्त होंगे।"
              : "Select the incident type to generate an official step-by-step recovery plan and authority routes."}
          </p>
        </div>
      </div>

      {/* Grid of 6 Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {SCAM_CATEGORIES.map((cat) => {
          const isSelected = cat.id === selectedCategory;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`text-left p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? "bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 text-slate-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                        : "bg-slate-800/80 text-slate-400 border border-slate-700/60"
                    }`}
                  >
                    {isHi ? cat.badgeHi : cat.badge}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1.5">
                  {isHi ? cat.titleHi : cat.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {isHi ? cat.shortDescriptionHi : cat.shortDescription}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex items-center justify-between text-[11px] font-semibold text-cyan-400">
                <span>{isSelected ? (isHi ? "वर्तमान में चयनित" : "Selected Plan") : (isHi ? "यह योजना देखें" : "View Recovery Plan")}</span>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? "translate-x-1" : ""}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Legal Reality & Myth Buster Callout for the Selected Category */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-cyan-800/40 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            {isHi ? "कानूनी स्थिति एवं वास्तविक अधिकार:" : "Legal Reality & Rights for this Incident:"}
          </span>
        </div>
        <p className="text-slate-200 leading-relaxed pl-6">
          {isHi ? currentCategoryDetail.legalRealityHi : currentCategoryDetail.legalReality}
        </p>
        {currentCategoryDetail.urgentGoldenHourNote && (
          <div className="pl-6 pt-1 text-rose-300 font-medium">
            ⚡ {isHi ? currentCategoryDetail.urgentGoldenHourNoteHi : currentCategoryDetail.urgentGoldenHourNote}
          </div>
        )}
      </div>
    </div>
  );
};


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
          <h3 className="text-lg font-serif font-bold text-[#181a15] flex items-center gap-2">
            <span>{isHi ? "1. अपनी धोखाधड़ी की श्रेणी चुनें" : "1. Identify What Happened"}</span>
            {isAiDetected && (
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#eef4e8] text-[#3d5926] border border-[#d5e0cb]">
                <Sparkles className="w-3 h-3 text-[#3d5926]" />
                {isHi ? "AI स्कैनर द्वारा ऑटो-डिटेक्ट" : "Auto-Identified from Scan"}
              </span>
            )}
          </h3>
          <p className="text-xs text-[#636c5c]">
            {isHi
              ? "सही श्रेणी चुनने से आपको संबंधित आधिकारिक पोर्टल, कानूनी नियम और हेल्पलाइन प्राप्त होंगे।"
              : "Select the incident type to generate an official step-by-step recovery plan and authority routes."}
          </p>
        </div>
      </div>

      {/* Grid of 6 Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {SCAM_CATEGORIES.map((cat) => {
          const isSelected = cat.id === selectedCategory;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`text-left p-5 rounded-3xl border transition-all relative flex flex-col justify-between shadow-2xs ${
                isSelected
                  ? "bg-[#f4f8ee] border-[#8ec251] shadow-sm ring-1 ring-[#8ec251]"
                  : "bg-white border-[#e2e6dc] hover:border-[#ccd6c3] hover:bg-[#fafbf9] text-[#181a15]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2.5 rounded-2xl ${
                      isSelected ? "bg-[#bef264] text-[#162704]" : "bg-[#f4f7f1] text-[#363f2e]"
                    }`}
                  >
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-[#eef4e8] text-[#3d5926] border border-[#d5e0cb]"
                        : "bg-[#f4f7f1] text-[#636c5c] border border-[#dde4d4]"
                    }`}
                  >
                    {isHi ? cat.badgeHi : cat.badge}
                  </span>
                </div>

                <h4 className="text-base font-serif font-bold text-[#181a15] mb-1.5">
                  {isHi ? cat.titleHi : cat.title}
                </h4>

                <p className="text-xs text-[#525a4c] leading-relaxed line-clamp-2">
                  {isHi ? cat.shortDescriptionHi : cat.shortDescription}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#e8eee1] flex items-center justify-between text-[11px] font-semibold text-[#2c401c]">
                <span>{isSelected ? (isHi ? "वर्तमान में चयनित" : "Selected Plan") : (isHi ? "यह योजना देखें" : "View Recovery Plan")}</span>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? "translate-x-1" : ""}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Legal Reality & Myth Buster Callout for the Selected Category */}
      <div className="p-5 rounded-2xl bg-[#f8faf6] border border-[#dce3d5] space-y-2 text-xs shadow-2xs">
        <div className="flex items-center gap-2 text-[#2c401c] font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            {isHi ? "कानूनी स्थिति एवं वास्तविक अधिकार:" : "Legal Reality & Rights for this Incident:"}
          </span>
        </div>
        <p className="text-[#363f2e] leading-relaxed pl-6">
          {isHi ? currentCategoryDetail.legalRealityHi : currentCategoryDetail.legalReality}
        </p>
        {currentCategoryDetail.urgentGoldenHourNote && (
          <div className="pl-6 pt-1 text-rose-700 font-semibold">
            ⚡ {isHi ? currentCategoryDetail.urgentGoldenHourNoteHi : currentCategoryDetail.urgentGoldenHourNote}
          </div>
        )}
      </div>
    </div>
  );
};


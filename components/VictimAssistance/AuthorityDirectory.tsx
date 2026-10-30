"use client";

import React, { useState } from "react";
import {
  Building2,
  ExternalLink,
  PhoneCall,
  Clock,
  FileCheck,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Scale,
} from "lucide-react";
import { ScamCategoryType, Language } from "@/lib/types/recovery";
import { OFFICIAL_AUTHORITIES } from "@/lib/data/authorities";
import { SCAM_CATEGORIES } from "@/lib/data/scam-routing";

interface AuthorityDirectoryProps {
  selectedCategory: ScamCategoryType;
  language: Language;
}

export const AuthorityDirectory: React.FC<AuthorityDirectoryProps> = ({
  selectedCategory,
  language,
}) => {
  const isHi = language === "hi";
  const categoryDetail =
    SCAM_CATEGORIES.find((c) => c.id === selectedCategory) || SCAM_CATEGORIES[0];

  const [expandedId, setExpandedId] = useState<string | null>(
    categoryDetail.primaryAuthorityIds[0] || "cybercrime_gov"
  );
  const [filter, setFilter] = useState<string>("all");

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filteredAuthorities = OFFICIAL_AUTHORITIES.filter((auth) => {
    if (filter === "all") return true;
    if (filter === "recommended") {
      return (
        categoryDetail.primaryAuthorityIds.includes(auth.id) ||
        categoryDetail.secondaryAuthorityIds.includes(auth.id)
      );
    }
    return auth.category === filter;
  });

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              {isHi ? "4. आधिकारिक प्राधिकरण निर्देशिका (Report & Get Help)" : "4. Report & Get Help — Verified Official Authorities"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isHi
              ? "केवल सत्यापित भारत सरकार और नियामक पोर्टलों का उपयोग करें। सभी लिंक नई टैब में खुलते हैं।"
              : "Direct links to verified Government of India & statutory regulatory portals with step-by-step submission guides."}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              filter === "all"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
            }`}
          >
            {isHi ? "सभी पोर्टल" : "All Authorities"}
          </button>
          <button
            onClick={() => setFilter("recommended")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              filter === "recommended"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
            }`}
          >
            ⭐ {isHi ? "इस केस के लिए अनुशंसित" : "Recommended for This Incident"}
          </button>
        </div>
      </div>

      {/* Critical Statutory Distinction Callout */}
      <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-800/40 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-amber-300 font-bold">
          <Scale className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {isHi
              ? "महत्वपूर्ण कानूनी अंतर: अपराध रिपोर्टिंग बनाम बैंक शिकायत (RBI CMS)"
              : "Critical Legal Distinction: Crime Reporting (NCRP) vs Regulatory Grievance (RBI CMS)"}
          </span>
        </div>
        <div className="text-slate-300 space-y-1.5 leading-relaxed pl-6">
          <p>
            • <strong className="text-white">cybercrime.gov.in (1930)</strong>:{" "}
            {isHi
              ? "अपराधियों को पकड़ने और अंतर-बैंक स्तर पर पैसे फ्रीज कराने के लिए पुलिस शिकायत दर्ज करने का आधिकारिक मंच है।"
              : "The official criminal reporting portal to catch scammers and initiate interbank emergency fund freezes via police nodal officers."}
          </p>
          <p>
            • <strong className="text-white">cms.rbi.org.in (RBI Banking Ombudsman)</strong>:{" "}
            {isHi
              ? "यह जालसाजों को पकड़ने का पुलिस पोर्टल नहीं है। यह केवल तब इस्तेमाल करें जब आपका अपना बैंक 30 दिनों में अनधिकृत लेनदेन पर उचित कदम न उठाए।"
              : "NOT for catching scammers. Use this only if YOUR bank fails in its customer service duties, refuses to reverse unauthorized debits, or does not resolve your formal grievance within 30 days."}
          </p>
        </div>
      </div>

      {/* Authority Cards List */}
      <div className="space-y-4">
        {filteredAuthorities.map((auth) => {
          const isPrimary = categoryDetail.primaryAuthorityIds.includes(auth.id);
          const isSecondary = categoryDetail.secondaryAuthorityIds.includes(auth.id);
          const isExpanded = expandedId === auth.id;

          return (
            <div
              key={auth.id}
              className={`rounded-xl border transition-all ${
                isPrimary
                  ? "bg-slate-950 border-cyan-500/50 shadow-md shadow-cyan-500/5 ring-1 ring-cyan-500/20"
                  : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Card Header Summary */}
              <div
                onClick={() => toggleExpand(auth.id)}
                className="p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      {isHi ? auth.nameHi : auth.name}
                    </h4>
                    {isPrimary && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {isHi ? "प्राथमिक अनुशंसित" : "Primary Route"}
                      </span>
                    )}
                    {isSecondary && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {isHi ? "द्वितीयक अपील" : "Secondary Escalation"}
                      </span>
                    )}
                    {auth.isGovernment && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
                        Govt of India
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    {isHi ? auth.descriptionHi : auth.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {auth.phoneHelpline && (
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-mono font-bold text-xs">
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{auth.phoneHelpline}</span>
                    </span>
                  )}

                  <button
                    type="button"
                    aria-label="Expand details"
                    className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable Deep Guide */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-slate-900 space-y-4 text-xs animate-in fade-in duration-200">
                  {/* Why Contact */}
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="font-bold text-cyan-300">
                      {isHi ? "आपको यहाँ संपर्क क्यों करना चाहिए: " : "Why Contact This Authority: "}
                    </span>
                    <span className="text-slate-200">{isHi ? auth.whyContactHi : auth.whyContact}</span>
                  </div>

                  {/* Important Notice */}
                  {auth.importantNotice && (
                    <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/40 text-rose-200">
                      <span className="font-bold">⚠️ {isHi ? "विशेष निर्देश: " : "Important Requirement: "}</span>
                      <span>{isHi ? auth.importantNoticeHi : auth.importantNotice}</span>
                    </div>
                  )}

                  {/* Step by Step Guide */}
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isHi ? "शिकायत दर्ज करने के चरणबद्ध निर्देश:" : "Step-by-Step Filing Instructions:"}</span>
                    </h5>
                    <ol className="space-y-1 pl-4 list-decimal text-slate-300 leading-relaxed">
                      {(isHi ? auth.stepByStepGuideHi : auth.stepByStepGuide).map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Required Documents */}
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-slate-200 flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isHi ? "आवश्यक दस्तावेज एवं साक्ष्य:" : "Required Documents & Evidence:"}</span>
                    </h5>
                    <ul className="space-y-1 pl-4 list-disc text-slate-300 leading-relaxed">
                      {(isHi ? auth.requiredDocumentsHi : auth.requiredDocuments).map((doc, i) => (
                        <li key={i}>{doc}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Portal Launch Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-900">
                    <div className="text-[11px] text-slate-400">
                      {auth.operatingHours && (
                        <span>
                          {isHi ? "कार्य समय: " : "Operating Hours: "}
                          <strong className="text-slate-300">{isHi ? auth.operatingHoursHi : auth.operatingHours}</strong>
                        </span>
                      )}
                    </div>

                    <a
                      href={auth.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all"
                    >
                      <span>
                        {isHi
                          ? `आधिकारिक वेबसाइट खोलें (${auth.name.split("(")[0].trim()})`
                          : `Visit Official Portal (${auth.name.split("(")[0].trim()})`}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Statutory Legal Disclaimer */}
      <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-400 leading-relaxed flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-200">
            {isHi ? "वैधानिक दायित्व मुक्ति (Legal Transparency): " : "Statutory Transparency Statement: "}
          </span>
          {isHi
            ? "सेफगार्ड एआई पीड़ितों को सही आधिकारिक माध्यमों तक पहुँचाने में सहायता करता है। हमारा प्लेटफॉर्म स्वयं पुलिस में शिकायत दर्ज नहीं करता और न ही सीधे पैसे फ्रीज करने का दावा करता है। पीड़ित को आधिकारिक सरकारी पोर्टल पर जाकर स्वयं आवेदन पूरा करना होगा। किसी भी स्वचालित फंड रिकवरी का झूठा वादा नहीं किया जाता है।"
            : "SafeGuard AI is an educational victim navigation assistant. Our platform does not directly file police complaints, freeze bank accounts, or guarantee recovery of lost funds. All formal submissions must be completed by the victim directly on authorized government and regulatory portals."}
        </div>
      </div>
    </div>
  );
};

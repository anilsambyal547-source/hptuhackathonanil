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
    <div className="bg-white border border-[#e2e6dc] rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#edf1e8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#3d5926]" />
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#181a15]">
              {isHi ? "4. आधिकारिक प्राधिकरण निर्देशिका (Report & Get Help)" : "4. Report & Get Help — Verified Official Authorities"}
            </h3>
          </div>
          <p className="text-xs text-[#636c5c] mt-1">
            {isHi
              ? "केवल सत्यापित भारत सरकार और नियामक पोर्टलों का उपयोग करें। सभी लिंक नई टैब में खुलते हैं।"
              : "Direct links to verified Government of India & statutory regulatory portals with step-by-step submission guides."}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filter === "all"
                ? "bg-[#181a15] text-white shadow-2xs"
                : "bg-[#f4f7f1] text-[#556149] hover:bg-[#edf2e7] border border-[#dce3d5]"
            }`}
          >
            {isHi ? "सभी पोर्टल" : "All Authorities"}
          </button>
          <button
            onClick={() => setFilter("recommended")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filter === "recommended"
                ? "bg-[#181a15] text-white shadow-2xs"
                : "bg-[#f4f7f1] text-[#556149] hover:bg-[#edf2e7] border border-[#dce3d5]"
            }`}
          >
            ⭐ {isHi ? "इस केस के लिए अनुशंसित" : "Recommended for This Incident"}
          </button>
        </div>
      </div>

      {/* Critical Statutory Distinction Callout */}
      <div className="p-4 rounded-2xl bg-[#f8faf6] border border-[#dce3d5] space-y-2 text-xs shadow-2xs">
        <div className="flex items-center gap-2 text-[#2c401c] font-bold">
          <Scale className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            {isHi
              ? "महत्वपूर्ण कानूनी अंतर: अपराध रिपोर्टिंग बनाम बैंक शिकायत (RBI CMS)"
              : "Critical Legal Distinction: Crime Reporting (NCRP) vs Regulatory Grievance (RBI CMS)"}
          </span>
        </div>
        <div className="text-[#525a4c] space-y-1.5 leading-relaxed pl-6">
          <p>
            • <strong className="text-[#181a15]">cybercrime.gov.in (1930)</strong>:{" "}
            {isHi
              ? "अपराधियों को पकड़ने और अंतर-बैंक स्तर पर पैसे फ्रीज कराने के लिए पुलिस शिकायत दर्ज करने का आधिकारिक मंच है।"
              : "The official criminal reporting portal to catch scammers and initiate interbank emergency fund freezes via police nodal officers."}
          </p>
          <p>
            • <strong className="text-[#181a15]">cms.rbi.org.in (RBI Banking Ombudsman)</strong>:{" "}
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
              className={`rounded-2xl border transition-all shadow-2xs ${
                isPrimary
                  ? "bg-[#fafcf8] border-[#8ec251] shadow-xs"
                  : "bg-[#f8faf6] border-[#e2e7dc] hover:border-[#ccd6c3]"
              }`}
            >
              {/* Card Header Summary */}
              <div
                onClick={() => toggleExpand(auth.id)}
                className="p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm sm:text-base font-serif font-bold text-[#181a15]">
                      {isHi ? auth.nameHi : auth.name}
                    </h4>
                    {isPrimary && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                        {isHi ? "प्राथमिक अनुशंसित" : "Primary Route"}
                      </span>
                    )}
                    {isSecondary && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                        {isHi ? "द्वितीयक अपील" : "Secondary Escalation"}
                      </span>
                    )}
                    {auth.isGovernment && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#eef4e8] text-[#3d5926] border border-[#d5e0cb]">
                        Govt of India
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#525a4c] leading-relaxed max-w-2xl">
                    {isHi ? auth.descriptionHi : auth.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {auth.phoneHelpline && (
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eef5e6] border border-[#cbe0b8] text-[#2c401c] font-mono font-bold text-xs">
                      <PhoneCall className="w-3.5 h-3.5 text-[#3d5926]" />
                      <span>{auth.phoneHelpline}</span>
                    </span>
                  )}

                  <button
                    type="button"
                    aria-label="Expand details"
                    className="p-1.5 rounded-xl bg-white border border-[#dce3d5] text-[#556149] hover:text-[#181a15]"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable Deep Guide */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-3 border-t border-[#e2e7dc] space-y-4 text-xs animate-in fade-in duration-200">
                  {/* Why Contact */}
                  <div className="p-3.5 rounded-xl bg-white border border-[#dce3d5]">
                    <span className="font-bold text-[#181a15]">
                      {isHi ? "आपको यहाँ संपर्क क्यों करना चाहिए: " : "Why Contact This Authority: "}
                    </span>
                    <span className="text-[#525a4c]">{isHi ? auth.whyContactHi : auth.whyContact}</span>
                  </div>

                  {/* Important Notice */}
                  {auth.importantNotice && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                      <span className="font-bold">⚠️ {isHi ? "विशेष निर्देश: " : "Important Requirement: "}</span>
                      <span>{isHi ? auth.importantNoticeHi : auth.importantNotice}</span>
                    </div>
                  )}

                  {/* Step by Step Guide */}
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-[#181a15] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#3d5926]" />
                      <span>{isHi ? "शिकायत दर्ज करने के चरणबद्ध निर्देश:" : "Step-by-Step Filing Instructions:"}</span>
                    </h5>
                    <ol className="space-y-1 pl-4 list-decimal text-[#525a4c] leading-relaxed">
                      {(isHi ? auth.stepByStepGuideHi : auth.stepByStepGuide).map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Required Documents */}
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-[#181a15] flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-[#3d5926]" />
                      <span>{isHi ? "आवश्यक दस्तावेज एवं साक्ष्य:" : "Required Documents & Evidence:"}</span>
                    </h5>
                    <ul className="space-y-1 pl-4 list-disc text-[#525a4c] leading-relaxed">
                      {(isHi ? auth.requiredDocumentsHi : auth.requiredDocuments).map((doc, i) => (
                        <li key={i}>{doc}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Portal Launch Button */}
                  <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[#e2e7dc]">
                    <div className="text-[11px] text-[#636c5c]">
                      {auth.operatingHours && (
                        <span>
                          {isHi ? "कार्य समय: " : "Operating Hours: "}
                          <strong className="text-[#181a15]">{isHi ? auth.operatingHoursHi : auth.operatingHours}</strong>
                        </span>
                      )}
                    </div>

                    <a
                      href={auth.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#bef264] hover:bg-[#aee750] text-[#162704] font-bold text-xs border border-[#a8df4a]/70 shadow-2xs transition-all"
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
      <div className="p-4 bg-[#f8faf6] border border-[#dce3d5] rounded-2xl text-xs text-[#525a4c] leading-relaxed flex items-start gap-3 shadow-2xs">
        <ShieldCheck className="w-4 h-4 text-[#3d5926] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#181a15]">
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

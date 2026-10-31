"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  Copy,
  Check,
  AlertTriangle,
  ShieldAlert,
  Info,
  Calendar,
  IndianRupee,
  Phone,
  Link as LinkIcon,
} from "lucide-react";
import { ScamCategoryType, Language, EvidenceDraft } from "@/lib/types/recovery";
import { SCAM_CATEGORIES } from "@/lib/data/scam-routing";

interface EvidenceOrganizerProps {
  selectedCategory: ScamCategoryType;
  language: Language;
  prefilledUrl?: string;
  prefilledText?: string;
}

export const EvidenceOrganizer: React.FC<EvidenceOrganizerProps> = ({
  selectedCategory,
  language,
  prefilledUrl = "",
  prefilledText = "",
}) => {
  const isHi = language === "hi";
  const categoryDetail =
    SCAM_CATEGORIES.find((c) => c.id === selectedCategory) || SCAM_CATEGORIES[0];

  const [evidence, setEvidence] = useState<EvidenceDraft>({
    incidentDate: new Date().toISOString().split("T")[0],
    scamCategory: selectedCategory,
    amountLost: "",
    bankName: "",
    transactionIds: "",
    utrNumbers: "",
    scammerPhones: "",
    scammerEmails: "",
    scammerUpiHandles: "",
    suspiciousUrls: prefilledUrl,
    platformUsed: "WhatsApp / SMS",
    incidentDescription: prefilledText ? `Sample message received:\n"${prefilledText}"` : "",
  });

  const [copied, setCopied] = useState(false);
  const [credentialWarning, setCredentialWarning] = useState<string | null>(null);

  // Sensitive credential checker
  const handleInputChange = (field: keyof EvidenceDraft, value: string) => {
    // Check for sensitive credential terms
    const sensitivePatterns = [
      /\b(otp|one time password)\b/i,
      /\b(cvv|cvc)\b/i,
      /\b(pin|atm pin|upi pin)\b/i,
      /\b(password|passwd)\b/i,
      /\b\d{16}\b/, // 16 digit card number pattern
    ];

    const hasSensitive = sensitivePatterns.some((pattern) => pattern.test(value));
    if (hasSensitive) {
      setCredentialWarning(
        isHi
          ? "चेतावनी: कृपया अपना गुप्त पासवर्ड, ओटीपी, एटीएम पिन या सीवीवी कभी न लिखें!"
          : "SECURITY WARNING: Never enter your secret OTP, ATM PIN, Password, or CVV. Authorities never require these."
      );
    } else {
      setCredentialWarning(null);
    }

    setEvidence((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateReportText = () => {
    return `
================================================================================
OFFICIAL CYBERCRIME INCIDENT SUMMARY DRAFT
(Generated via SafeGuard AI Victim Assistance for submission on cybercrime.gov.in)
================================================================================

1. INCIDENT OVERVIEW
--------------------------------------------------------------------------------
Incident Date: ${evidence.incidentDate || "Not Specified"}
Incident Category: ${categoryDetail.title}
Platform / Medium Used: ${evidence.platformUsed || "Not Specified"}
Total Financial Loss Claimed: ₹${evidence.amountLost || "0 (Attempt only / No loss)"}
Victim Bank / Wallet Name: ${evidence.bankName || "Not Specified"}

2. TRANSACTION & BANKING IDENTIFIERS (FOR CFCFRMS / 1930)
--------------------------------------------------------------------------------
Bank Transaction IDs: ${evidence.transactionIds || "None"}
UTR (Unique Transaction Reference) Numbers: ${evidence.utrNumbers || "None"}
Scammer UPI ID / Beneficiary Account: ${evidence.scammerUpiHandles || "None"}

3. PERPETRATOR DETAILS & CONTACT CHANNELS
--------------------------------------------------------------------------------
Scammer Phone Numbers / WhatsApp: ${evidence.scammerPhones || "None"}
Scammer Email Addresses: ${evidence.scammerEmails || "None"}
Phishing / Deceptive URLs: ${evidence.suspiciousUrls || "None"}

4. BRIEF INCIDENT NARRATIVE
--------------------------------------------------------------------------------
${evidence.incidentDescription || "Victim reported being targeted by a deceptive communication."}

5. CHECKLIST OF ATTACHED EVIDENCE (TO UPLOAD ON PORTAL)
--------------------------------------------------------------------------------
[ ] Bank Account Statement showing unauthorized debit (PDF)
[ ] Screenshots of fake SMS / WhatsApp conversations
[ ] Call records showing timestamps
[ ] Copy of victim government photo ID proof

LEGAL NOTICE:
This incident summary is prepared by the victim for filing on https://cybercrime.gov.in
and submitting to their bank grievance cell. No passwords, OTPs, or PINs are included.
Report prepared on: ${new Date().toLocaleString("en-IN")}
================================================================================
    `.trim();
  };

  const handleDownloadReport = () => {
    const report = generateReportText();
    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Cybercrime_Incident_Report_${evidence.incidentDate || "draft"}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyReport = () => {
    const report = generateReportText();
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white border border-[#e2e6dc] rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#edf1e8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#3d5926]" />
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#181a15]">
              {isHi ? "3. अपने साक्ष्य व सबूत तैयार करें" : "3. Organize Evidence for Official Reporting"}
            </h3>
          </div>
          <p className="text-xs text-[#636c5c] mt-1">
            {isHi
              ? "यह जानकारी एक संरचित रिपोर्ट बनाती है जिसे आप 1930 या cybercrime.gov.in पर आसानी से पेस्ट कर सकते हैं।"
              : "Consolidate your transaction UTRs, scammer contacts, and links into an official incident summary ready for NCRP filing."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f4f7f1] hover:bg-[#edf2e7] text-xs font-semibold text-[#181a15] border border-[#dce3d5] transition-colors shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#3d5926]" /> : <Copy className="w-3.5 h-3.5 text-[#556149]" />}
            <span>{copied ? (isHi ? "कॉपी हो गया!" : "Copied!") : (isHi ? "रिपोर्ट कॉपी करें" : "Copy Report")}</span>
          </button>

          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#bef264] hover:bg-[#aee750] text-xs font-bold text-[#162704] border border-[#a8df4a]/70 shadow-2xs transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isHi ? "डाउनलोड करें (.txt)" : "Download Incident Summary"}</span>
          </button>
        </div>
      </div>

      {/* Strict Privacy Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-[#f8faf6] border border-[#dce3d5] flex items-start gap-3 text-xs text-[#525a4c] shadow-2xs">
        <ShieldAlert className="w-4 h-4 text-[#3d5926] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-[#181a15]">
            {isHi ? "गोपनीयता एवं सुरक्षा गारंटी: " : "Zero Credential Storage Guarantee: "}
          </span>
          {isHi
            ? "हम कभी भी आपका पासवर्ड, ओटीपी, यूपीआई पिन या कार्ड सीवीवी नहीं मांगते और न ही स्टोर करते हैं। यह सारा डेटा केवल आपके ब्राउज़र में रहता है।"
            : "SafeGuard AI never asks for or stores OTPs, PINs, passwords, or CVVs. All inputs remain strictly in your local browser memory for generating your police report."}
        </div>
      </div>

      {credentialWarning && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-800 font-semibold">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{credentialWarning}</span>
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {/* Incident Date */}
        <div>
          <label className="block font-semibold text-[#181a15] mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#3d5926]" />
            <span>{isHi ? "घटना की तारीख" : "Date of Incident"}</span>
          </label>
          <input
            type="date"
            value={evidence.incidentDate}
            onChange={(e) => handleInputChange("incidentDate", e.target.value)}
            className="w-full bg-[#fcfdfa] border border-[#d8e0d0] rounded-xl px-3 py-2 text-[#181a15] focus:outline-none focus:ring-2 focus:ring-[#bef264] focus:border-[#a0d944] text-xs shadow-2xs"
          />
        </div>

        {/* Amount Lost */}
        <div>
          <label className="block font-semibold text-[#181a15] mb-1.5 flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-rose-600" />
            <span>{isHi ? "कटी हुई राशि (₹ में)" : "Amount Lost (in ₹)"}</span>
          </label>
          <input
            type="text"
            placeholder="e.g. 25000 (or 0 if none)"
            value={evidence.amountLost}
            onChange={(e) => handleInputChange("amountLost", e.target.value)}
            className="w-full bg-[#fcfdfa] border border-[#d8e0d0] rounded-xl px-3 py-2 text-[#181a15] focus:outline-none focus:ring-2 focus:ring-[#bef264] focus:border-[#a0d944] text-xs shadow-2xs"
          />
        </div>

        {/* Victim Bank Name */}
        <div>
          <label className="block font-semibold text-[#181a15] mb-1.5">
            {isHi ? "आपका बैंक / वॉलेट नाम" : "Your Bank / Payment App"}
          </label>
          <input
            type="text"
            placeholder="e.g. SBI, HDFC, PhonePe, Paytm"
            value={evidence.bankName}
            onChange={(e) => handleInputChange("bankName", e.target.value)}
            className="w-full bg-[#fcfdfa] border border-[#d8e0d0] rounded-xl px-3 py-2 text-[#181a15] focus:outline-none focus:ring-2 focus:ring-[#bef264] focus:border-[#a0d944] text-xs shadow-2xs"
          />
        </div>

        {/* UTR Numbers */}
        <div>
          <label className="block font-semibold text-[#181a15] mb-1.5">
            {isHi ? "UTR / ट्रांजैक्शन संदर्भ नंबर" : "Transaction UTR / Reference ID"}
          </label>
          <input
            type="text"
            placeholder="e.g. 430918274912, 12-digit UTR"
            value={evidence.utrNumbers}
            onChange={(e) => handleInputChange("utrNumbers", e.target.value)}
            className="w-full bg-[#fcfdfa] border border-[#d8e0d0] rounded-xl px-3 py-2 text-[#181a15] focus:outline-none focus:ring-2 focus:ring-[#bef264] focus:border-[#a0d944] text-xs font-mono shadow-2xs"
          />
        </div>

        {/* Scammer Phone / WhatsApp */}
        <div>
          <label className="block font-semibold text-[#181a15] mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#3d5926]" />
            <span>{isHi ? "जालसाज का फोन नंबर / व्हाट्सएप" : "Scammer's Phone / WhatsApp"}</span>
          </label>
          <input
            type="text"
            placeholder="e.g. +91 98765 43210"
            value={evidence.scammerPhones}
            onChange={(e) => handleInputChange("scammerPhones", e.target.value)}
            className="w-full bg-[#fcfdfa] border border-[#d8e0d0] rounded-xl px-3 py-2 text-[#181a15] focus:outline-none focus:ring-2 focus:ring-[#bef264] focus:border-[#a0d944] text-xs font-mono shadow-2xs"
          />
        </div>

        {/* Scammer UPI / Beneficiary */}
        <div>
          <label className="block font-semibold text-[#181a15] mb-1.5">
            {isHi ? "जालसाज की UPI ID या खाता" : "Scammer's UPI / Recipient Account"}
          </label>
          <input
            type="text"
            placeholder="e.g. fraudster@okhdfcbank"
            value={evidence.scammerUpiHandles}
            onChange={(e) => handleInputChange("scammerUpiHandles", e.target.value)}
            className="w-full bg-[#fcfdfa] border border-[#d8e0d0] rounded-xl px-3 py-2 text-[#181a15] focus:outline-none focus:ring-2 focus:ring-[#bef264] focus:border-[#a0d944] text-xs shadow-2xs"
          />
        </div>

        {/* Deceptive URL */}
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block font-semibold text-[#181a15] mb-1.5 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-[#3d5926]" />
            <span>{isHi ? "संदिग्ध वेबसाइट लिंक (URL)" : "Suspicious Link / Phishing Website"}</span>
          </label>
          <input
            type="text"
            placeholder="e.g. https://sbi-kyc-update.xyz (do not click)"
            value={evidence.suspiciousUrls}
            onChange={(e) => handleInputChange("suspiciousUrls", e.target.value)}
            className="w-full bg-[#fcfdfa] border border-[#d8e0d0] rounded-xl px-3 py-2 text-[#181a15] focus:outline-none focus:ring-2 focus:ring-[#bef264] focus:border-[#a0d944] text-xs font-mono shadow-2xs"
          />
        </div>

        {/* Incident Narrative */}
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block font-semibold text-[#181a15] mb-1.5">
            {isHi ? "घटना का संक्षिप्त विवरण (क्या हुआ?)" : "Brief Description / Sequence of Events"}
          </label>
          <textarea
            rows={3}
            placeholder={
              isHi
                ? "वर्णन करें कि धोखेबाज ने कैसे संपर्क किया, क्या कहा और पैसे कैसे कटे..."
                : "Explain how the scammer contacted you, what claims they made, and how transactions occurred..."
            }
            value={evidence.incidentDescription}
            onChange={(e) => handleInputChange("incidentDescription", e.target.value)}
            className="w-full bg-[#fcfdfa] border border-[#d8e0d0] rounded-2xl p-3.5 text-[#181a15] focus:outline-none focus:ring-2 focus:ring-[#bef264] focus:border-[#a0d944] text-xs leading-relaxed shadow-2xs"
          />
        </div>
      </div>

      {/* Evidence Document Checklist */}
      <div className="p-5 rounded-2xl bg-[#f8faf6] border border-[#dce3d5] space-y-2 shadow-2xs">
        <h4 className="text-xs font-bold text-[#181a15] uppercase tracking-wider flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#3d5926]" />
          <span>{isHi ? "पोर्टल पर अपलोड करने के लिए दस्तावेज चेकलिस्ट:" : "Documents to keep ready for upload:"}</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#525a4c]">
          {categoryDetail.evidenceChecklist.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7db432] shrink-0" />
              <span>{isHi ? item.labelHi : item.label}</span>
              {item.required && (
                <span className="text-[10px] text-rose-700 font-semibold font-mono">
                  ({isHi ? "अनिवार्य" : "Required"})
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


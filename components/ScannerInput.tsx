"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Globe,
  KeyRound,
  Clipboard,
  Mail,
  Smartphone,
  Package,
  EyeOff,
  FolderOpen,
} from "lucide-react";
import { OcrQualityReport } from "@/lib/types";
import { runLocalOcr } from "@/lib/ocr/local-ocr";
import { analyzeImageCanvas } from "@/lib/ocr/canvas-ocr";
import { maskCredentials, MaskedEntity } from "@/lib/security/credential-masker";
import { isRawEmail } from "@/lib/engine/email-parser";

interface ScannerInputProps {
  onAnalyze: (
    text: string,
    inputType: "text" | "ocr_screenshot" | "email_eml",
    ocrQuality?: OcrQualityReport
  ) => void;
  isLoading: boolean;
}

const PRESET_SAMPLES = [
  {
    label: "SBI KYC Smishing",
    category: "Phishing",
    text: "Dear SBI user, your NetBanking account has been suspended due to pending KYC. Please update your PAN immediately within 24 hours at https://sbi-kyc-verify.top/login or your account will be blocked.",
  },
  {
    label: "India Post Delivery",
    category: "Courier",
    text: "India Post: Your package cannot be delivered due to missing house number. Please update delivery address within 12 hours at https://indiapost-parcel-update.xyz or package will be returned to sender.",
  },
  {
    label: "Digital Arrest CBI",
    category: "Coercion",
    text: "CBI Investigation Notice: A non-bailable arrest warrant has been issued against your Aadhaar for international money laundering and illegal parcel seized at customs. Digital arrest initiated. Join Skype interrogation immediately.",
  },
  {
    label: "Electricity Cut",
    category: "Utility",
    text: "Dear consumer, your electricity power will be disconnected tonight at 9:30 PM because previous month bill was not updated. Immediately contact electricity officer at 9876543210 to avoid power cut.",
  },
  {
    label: "Hinglish Bijli Cut",
    category: "Hinglish",
    text: "Priye upbhokta, aaj raat bijli cut ho jayegi kyunki pichle mahine ka bill update nahi hua. Turant bijli officer se sampark karein 9876543210 par.",
  },
  {
    label: "QR Code Refund Trap",
    category: "Payment Bait",
    text: "PayTM Cash Refund: Your cashback of Rs 2,500 is ready. Scan this QR code to receive money in your bank account immediately.",
  },
  {
    label: "LinkedIn Job Bait",
    category: "Job Scam",
    text: "LinkedIn Recruiter: You have 1 unread executive offer from Microsoft India. Submit your resume and PAN details at https://linkedin-recruitment-portal.site/apply",
  },
  {
    label: "SBI Spoofed .EML",
    category: "Email Phish",
    text: `From: "State Bank of India Support" <no-reply@sbi-fraud-alert.top>
Reply-To: sbi.kyc.desk.claim@gmail.com
Subject: URGENT: Complete NetBanking KYC to prevent debit block
Authentication-Results: spf=fail; dkim=fail; dmarc=fail

Dear SBI Customer,
Your State Bank of India NetBanking privilege has been temporarily restricted due to missing PAN linking.

Please verify your credentials immediately to avoid account termination:
<a href="http://sbi-login-portal.top/verify">https://www.onlinesbi.sbi/update</a>

Regards,
SBI Security Division`,
  },
  {
    label: "Legit Bank Alert",
    category: "Legitimate",
    text: "Your A/C XX4921 has been debited by Rs 350.00 on 30-Oct-26 via UPI to Starbucks. Avl Bal: Rs 24,150.25. If not you, SMS BLOCK to 5676712 - HDFC Bank",
  },
];

/**
 * Dynamically synthesizes realistic mobile screenshots using HTML5 Canvas.
 * ZERO external network fetches; operates 100% inside browser memory.
 */
function createSyntheticScreenshot(type: "bank" | "courier" | "blurry"): {
  dataUrl: string;
  text: string;
  ocrQuality: OcrQualityReport;
} {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("HTML5 Canvas context unavailable");
  }

  if (type === "bank") {
    canvas.width = 640;
    canvas.height = 360;

    // Dark sleek phone background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 360);
    bgGrad.addColorStop(0, "#0b0f19");
    bgGrad.addColorStop(1, "#111827");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 640, 360);

    // Top mobile status bar
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("9:41 AM", 24, 26);
    ctx.fillText("5G • 88%", 560, 26);

    // Sender title bar
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 40, 640, 56);
    ctx.strokeStyle = "#334155";
    ctx.strokeRect(0, 40, 640, 1);

    // Bank Icon Badge
    ctx.beginPath();
    ctx.arc(42, 68, 16, 0, Math.PI * 2);
    ctx.fillStyle = "#1d4ed8";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.fillText("SBI", 32, 72);

    // Sender Info
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 14px system-ui, sans-serif";
    ctx.fillText("SBI Alerts (+91 9876543210)", 70, 63);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillText("Transactional & Security Notification • Official", 70, 80);

    // Message Bubble
    ctx.fillStyle = "#1e293b";
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(30, 120, 580, 170, 14);
    ctx.fill();
    ctx.stroke();

    // Message Text
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "15px system-ui, sans-serif";
    ctx.fillText("SBI Alert: Your NetBanking account KYC is expired.", 48, 155);
    ctx.fillText("Update immediately to avoid permanent account block:", 48, 185);

    // Malicious Phishing Link
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 15px monospace";
    ctx.fillText("http://sbi-kyc-update.xyz", 48, 220);

    // Time & Delivered
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillText("Today 10:15 AM • SMS via +91 9876543210", 48, 260);

    const text =
      "SBI Alert: Your account KYC is expired. Update immediately at http://sbi-kyc-update.xyz or account will be blocked";
    const dataUrl = canvas.toDataURL("image/png");
    const ocrQuality: OcrQualityReport = {
      isReadable: true,
      confidence: 96,
      charCount: text.length,
      warnings: [],
    };
    return { dataUrl, text, ocrQuality };
  } else if (type === "courier") {
    canvas.width = 640;
    canvas.height = 360;

    // Dark sleek background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 360);
    bgGrad.addColorStop(0, "#090d16");
    bgGrad.addColorStop(1, "#0f172a");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 640, 360);

    // Top status bar
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("2:30 PM", 24, 26);
    ctx.fillText("LTE • 92%", 560, 26);

    // Sender title bar
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 40, 640, 56);
    ctx.strokeStyle = "#334155";
    ctx.strokeRect(0, 40, 640, 1);

    // Courier Badge
    ctx.beginPath();
    ctx.arc(42, 68, 16, 0, Math.PI * 2);
    ctx.fillStyle = "#dc2626";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.fillText("POST", 27, 72);

    // Sender Info
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 14px system-ui, sans-serif";
    ctx.fillText("India Post Parcel Care (+91 9123456789)", 70, 63);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillText("Consignment Delivery Desk • Urgent Notification", 70, 80);

    // Message Bubble
    ctx.fillStyle = "#1e293b";
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(30, 120, 580, 170, 14);
    ctx.fill();
    ctx.stroke();

    // Message Text
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "15px system-ui, sans-serif";
    ctx.fillText("India Post: Parcel held at customs due to incomplete address.", 48, 155);
    ctx.fillText("Pay Rs 49 fee within 12 hours or package will be returned:", 48, 185);

    // Link
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 15px monospace";
    ctx.fillText("http://indiapost-track.org", 48, 220);

    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillText("Consignment: CP98234190IN • Pay before return dispatch", 48, 260);

    const text =
      "India Post: Parcel held at customs due to incomplete address. Pay Rs 49 fee within 12 hours at http://indiapost-track.org";
    const dataUrl = canvas.toDataURL("image/png");
    const ocrQuality: OcrQualityReport = {
      isReadable: true,
      confidence: 94,
      charCount: text.length,
      warnings: [],
    };
    return { dataUrl, text, ocrQuality };
  } else {
    // Blurry / Degraded Screenshot (Graceful Failure Test)
    canvas.width = 360;
    canvas.height = 180;

    // Muddy low contrast background
    ctx.fillStyle = "#1e232b";
    ctx.fillRect(0, 0, 360, 180);

    // Faint low-contrast text with blur
    ctx.fillStyle = "#334155";
    ctx.font = "12px monospace";
    ctx.fillText("URGENT: Verify account at bit.ly/unreadable", 16, 45);
    ctx.fillText("OTP requested immediately within 5 mins", 16, 75);
    ctx.fillText("Failure will cause immediate cancellation", 16, 105);
    ctx.fillText("Contact support center 98xxxxxx", 16, 135);

    // Add noise overlay to simulate compression and distortion
    const imgData = ctx.getImageData(0, 0, 360, 180);
    for (let i = 0; i < imgData.data.length; i += 4 * 3) {
      const noise = (Math.random() - 0.5) * 40;
      imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + noise));
      imgData.data[i + 1] = Math.max(0, Math.min(255, imgData.data[i + 1] + noise));
      imgData.data[i + 2] = Math.max(0, Math.min(255, imgData.data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    const text = "urg... ver... acc... [UNREADABLE / BLURRY OCR RESULT]";
    const dataUrl = canvas.toDataURL("image/png");
    const ocrQuality: OcrQualityReport = {
      isReadable: false,
      confidence: 18,
      charCount: 22,
      warnings: [
        "Low screenshot sharpness (Laplacian variance 14/100). Image appears heavily blurred or out of focus.",
        "Low contrast ratio detected between text and background. Optical character recognition cannot guarantee accurate URL or keyword extraction.",
        "Graceful unreadable image handling: High uncertainty penalty applied to avoid overconfident safe verdicts.",
      ],
    };
    return { dataUrl, text, ocrQuality };
  }
}

export const ScannerInput: React.FC<ScannerInputProps> = ({ onAnalyze, isLoading }) => {
  const [activeMode, setActiveMode] = useState<"text" | "image" | "email">("text");
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrStatusText, setOcrStatusText] = useState("Extracting text with OCR...");
  const [ocrQuality, setOcrQuality] = useState<OcrQualityReport | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [useCloudOcr, setUseCloudOcr] = useState(false);
  const [maskedEntities, setMaskedEntities] = useState<MaskedEntity[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emailFileInputRef = useRef<HTMLInputElement>(null);

  // Clipboard paste listener for images (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleImageFile(file);
            setActiveMode("image");
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useCloudOcr]);

  const handleTextPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const rawPasted = e.clipboardData.getData("text");
    const maskRes = maskCredentials(rawPasted);
    if (maskRes.hasMaskedItems) {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newText = inputText.slice(0, start) + maskRes.maskedText + inputText.slice(end);
      setInputText(newText);
      setMaskedEntities((prev) => [...prev, ...maskRes.maskedEntities]);
    }
  };

  // 1-Click "Paste & Auto-Scan" Button
  const handleQuickPasteAndScan = async () => {
    try {
      if (navigator.clipboard?.read) {
        try {
          const items = await navigator.clipboard.read();
          for (const item of items) {
            const imageType = item.types.find((t) => t.startsWith("image/"));
            if (imageType) {
              const blob = await item.getType(imageType);
              const file = new File([blob], "clipboard-screenshot.png", { type: imageType });
              handleImageFile(file);
              setActiveMode("image");
              return;
            }
          }
        } catch {
          // Fall back to text
        }
      }

      if (navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          const maskRes = maskCredentials(text);
          setInputText(maskRes.maskedText);
          if (maskRes.hasMaskedItems) {
            setMaskedEntities(maskRes.maskedEntities);
          }
          const isEmailPayload = isRawEmail(maskRes.maskedText);
          onAnalyze(maskRes.maskedText, isEmailPayload ? "email_eml" : "text");
        }
      }
    } catch (err) {
      console.warn("Clipboard auto-read error:", err);
    }
  };

  const handleEmailOrTextFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || "";
      if (text.trim()) {
        const maskRes = maskCredentials(text);
        setInputText(maskRes.maskedText);
        if (maskRes.hasMaskedItems) {
          setMaskedEntities(maskRes.maskedEntities);
        }
        setActiveMode(isRawEmail(maskRes.maskedText) ? "email" : "text");
        onAnalyze(maskRes.maskedText, isRawEmail(maskRes.maskedText) ? "email_eml" : "text");
      }
    };
    reader.readAsText(file);
  };

  const handleImageFile = (file: File) => {
    if (
      file.name.endsWith(".eml") ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".html") ||
      file.type.includes("text") ||
      file.type.includes("message/rfc822")
    ) {
      handleEmailOrTextFile(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setSelectedImage(base64);
      setIsProcessingOcr(true);
      setOcrStatusText("Preparing screenshot...");

      const img = new Image();
      img.onload = async () => {
        let canvasWarnings: string[] = [];
        try {
          const canvas = document.createElement("canvas");
          canvas.width = Math.min(img.naturalWidth, 1200);
          canvas.height = Math.min(img.naturalHeight, 800);
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const metrics = analyzeImageCanvas(ctx, canvas.width, canvas.height);
            canvasWarnings = metrics.recommendations;
          }
        } catch (canvasErr) {
          console.warn("Canvas analysis error:", canvasErr);
        }

        if (useCloudOcr) {
          setOcrStatusText("Contacting Gemini Vision Cloud OCR...");
          try {
            const res = await fetch("/api/ocr", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                imageBase64: base64,
                mimeType: file.type || "image/png",
                width: img.naturalWidth,
                height: img.naturalHeight,
                fileSizeBytes: file.size,
                explicitCloudConsent: true,
              }),
            });
            const data = await res.json();
            if (data.extractedText) {
              const maskRes = maskCredentials(data.extractedText);
              setInputText(maskRes.maskedText);
              if (maskRes.hasMaskedItems) {
                setMaskedEntities(maskRes.maskedEntities);
              }
            }
            if (data.ocrReport) {
              setOcrQuality({
                ...data.ocrReport,
                warnings: Array.from(new Set([...data.ocrReport.warnings, ...canvasWarnings])),
              });
            }
          } catch (err) {
            console.error("Cloud OCR API failed:", err);
            setOcrQuality({
              isReadable: false,
              confidence: 0,
              charCount: 0,
              warnings: ["Cloud OCR request failed. Check server logs or toggle offline Local OCR."],
            });
          } finally {
            setIsProcessingOcr(false);
          }
        } else {
          try {
            const result = await runLocalOcr(file, (p) => {
              setOcrStatusText(p.status);
            });

            if (result.text) {
              const maskRes = maskCredentials(result.text);
              setInputText(maskRes.maskedText);
              if (maskRes.hasMaskedItems) {
                setMaskedEntities(maskRes.maskedEntities);
              }
            }

            const isReadable = result.text.length > 5 && result.confidence >= 30;
            const warnings = [...canvasWarnings];
            if (result.confidence < 45) {
              warnings.push(`Low local OCR character confidence (${result.confidence}%). Verify extracted words.`);
            }
            if (!result.text.trim()) {
              warnings.push("No readable text detected in screenshot. Image might be blank or text resolution too low.");
            }

            setOcrQuality({
              isReadable,
              confidence: result.confidence,
              charCount: result.text.length,
              warnings,
            });
          } catch (err: unknown) {
            console.error("Local OCR failed:", err);
            const msg = err instanceof Error ? err.message : String(err);
            setOcrQuality({
              isReadable: false,
              confidence: 0,
              charCount: 0,
              warnings: [`Local OCR engine failed: ${msg}. Try pasting text manually.`],
            });
          } finally {
            setIsProcessingOcr(false);
          }
        }
      };
      img.src = base64;
    };
    reader.readAsDataURL(file);
  };

  // 1-Click Built-in Test Screenshot Generator
  const handleLoadBuiltinScreenshot = (type: "bank" | "courier" | "blurry") => {
    try {
      const sample = createSyntheticScreenshot(type);
      setSelectedImage(sample.dataUrl);
      setInputText(sample.text);
      setOcrQuality(sample.ocrQuality);
      setActiveMode("image");
      onAnalyze(sample.text, "ocr_screenshot", sample.ocrQuality);
    } catch (err) {
      console.error("Failed to generate test screenshot:", err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const maskRes = maskCredentials(inputText);
    if (maskRes.hasMaskedItems) {
      setMaskedEntities((prev) => [...prev, ...maskRes.maskedEntities]);
      setInputText(maskRes.maskedText);
    }

    const isEmailPayload = isRawEmail(maskRes.maskedText);
    const inputType = activeMode === "image" ? "ocr_screenshot" : isEmailPayload ? "email_eml" : "text";

    onAnalyze(maskRes.maskedText, inputType, ocrQuality || undefined);
  };

  return (
    <div className="bg-white border border-[#e2e6dc] rounded-3xl p-5 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-4">
      {/* Input Mode Selector & 1-Click Paste & Scan */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[#edf1e8] pb-4">
        <div className="flex flex-wrap items-center gap-2 bg-[#f4f7f1] p-1 rounded-2xl border border-[#e2e8dc]">
          <button
            type="button"
            onClick={() => setActiveMode("text")}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-all ${
              activeMode === "text"
                ? "bg-[#181a15] text-white shadow-xs font-semibold"
                : "text-[#586150] hover:text-[#181a15] hover:bg-white/60"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>SMS / WhatsApp / Text</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode("image")}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-all ${
              activeMode === "image"
                ? "bg-[#181a15] text-white shadow-xs font-semibold"
                : "text-[#586150] hover:text-[#181a15] hover:bg-white/60"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Screenshot OCR</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-[#eef4e8] text-[#3d5926] rounded border border-[#d5e0cb]">
              Ctrl+V
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode("email")}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-all ${
              activeMode === "email"
                ? "bg-[#181a15] text-white shadow-xs font-semibold"
                : "text-[#586150] hover:text-[#181a15] hover:bg-white/60"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Drop .EML / Email</span>
          </button>
        </div>

        {/* 1-Click Smart Paste & Scan Button */}
        <button
          type="button"
          onClick={handleQuickPasteAndScan}
          disabled={isLoading}
          className="px-4 py-2 rounded-2xl text-xs font-semibold bg-[#eef4e8] hover:bg-[#e2edd8] text-[#2c401c] border border-[#d5e0cb] transition-all flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <Clipboard className="w-3.5 h-3.5 text-[#3d5926]" />
          <span>1-Click Paste & Auto-Scan</span>
        </button>
      </div>

      {/* Preset Quick Loads */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-[#557e33]" />
          <span className="text-xs font-semibold text-[#636c5c]">Attack Vectors & Email Presets:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_SAMPLES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const maskRes = maskCredentials(preset.text);
                setInputText(maskRes.maskedText);
                setSelectedImage(null);
                setOcrQuality(null);
                setMaskedEntities(maskRes.maskedEntities);
                setActiveMode(preset.category === "Email Phish" ? "email" : "text");
              }}
              className="text-xs px-3 py-1.5 rounded-full bg-[#f7f9f5] hover:bg-[#edf2e7] text-[#363f2e] border border-[#dce3d5] transition-all flex items-center gap-1.5 font-medium shadow-2xs"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  preset.category === "Legitimate"
                    ? "bg-emerald-500"
                    : preset.category === "Email Phish"
                    ? "bg-purple-500"
                    : "bg-rose-500"
                }`}
              />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,.eml,.txt,.html"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleImageFile(e.target.files[0]);
            }
          }}
        />

        <input
          type="file"
          ref={emailFileInputRef}
          accept=".eml,.txt,.html,message/rfc822"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleEmailOrTextFile(e.target.files[0]);
            }
          }}
        />

        {/* Screenshot OCR Mode */}
        {activeMode === "image" && (
          <div className="space-y-3">
            {/* 1-Click Built-in Test Screenshots Toolbar */}
            <div className="p-3.5 bg-[#f7f9f5] border border-[#dce3d5] rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#2c401c] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#557e33]" />
                  <span>1-Click Built-in Test Screenshots (Zero File Dialog Required):</span>
                </span>
                <span className="text-[10px] text-[#636c5c] font-mono">HTML5 Canvas Synthesized</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleLoadBuiltinScreenshot("bank")}
                  className="px-3 py-2.5 rounded-xl bg-white hover:bg-[#edf2e7] border border-[#dce3d5] hover:border-[#9ec964] text-left transition-all group flex items-start gap-2 shadow-2xs"
                >
                  <Smartphone className="w-4 h-4 text-[#3d5926] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-xs font-semibold text-[#181a15]">📱 Bank KYC Scam</div>
                    <div className="text-[10px] text-[#636c5c]">SBI Alert SMS • Clear OCR (96% Conf)</div>
                  </div>
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleLoadBuiltinScreenshot("courier")}
                  className="px-3 py-2.5 rounded-xl bg-white hover:bg-rose-50/50 border border-[#dce3d5] hover:border-rose-300 text-left transition-all group flex items-start gap-2 shadow-2xs"
                >
                  <Package className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-xs font-semibold text-[#181a15]">📦 Courier Parcel Trap</div>
                    <div className="text-[10px] text-[#636c5c]">India Post SMS • Customs Fee Link</div>
                  </div>
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleLoadBuiltinScreenshot("blurry")}
                  className="px-3 py-2.5 rounded-xl bg-white hover:bg-amber-50/50 border border-[#dce3d5] hover:border-amber-300 text-left transition-all group flex items-start gap-2 shadow-2xs"
                >
                  <EyeOff className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-xs font-semibold text-[#181a15]">🌫️ Blurry / Degraded Image</div>
                    <div className="text-[10px] text-[#636c5c]">Graceful Failure & High Uncertainty</div>
                  </div>
                </button>
              </div>
            </div>

            {/* OCR Privacy Mode Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-[#f7f9f5] border border-[#dce3d5] rounded-xl text-xs">
              <div className="flex items-center gap-2">
                {useCloudOcr ? (
                  <Globe className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <div>
                  <span className="font-semibold text-[#181a15]">
                    {useCloudOcr ? "Cloud Gemini Vision OCR" : "Offline Local OCR (English + Hindi)"}
                  </span>
                  <p className="text-[11px] text-[#636c5c]">
                    {useCloudOcr
                      ? "⚠️ Notice: Sends screenshot image to Google Gemini API. Disable for strict offline privacy."
                      : "🔒 Processed entirely inside your browser via Web Worker. No screenshot leaves your device."}
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer self-start sm:self-center shrink-0">
                <input
                  type="checkbox"
                  checked={useCloudOcr}
                  onChange={(e) => setUseCloudOcr(e.target.checked)}
                  className="rounded border-[#ccd4c4] text-[#bef264] focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-[11px] text-[#363f2e] font-medium">Enable Cloud OCR</span>
              </label>
            </div>

            {/* Interactive Image Dropzone with Explicit Button */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const files = e.dataTransfer.files;
                if (files && files[0]) {
                  handleImageFile(files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                dragOver
                  ? "border-[#84b83f] bg-[#eef5e6]"
                  : "border-[#d0d8c8] hover:border-[#9ec964] bg-[#f9faf7]"
              }`}
            >
              <Upload className="w-8 h-8 text-[#3d5926] mx-auto mb-2" />
              <p className="text-xs sm:text-sm font-semibold text-[#181a15]">
                Drag and drop screenshot (.png, .jpg, .webp) here
              </p>
              <p className="text-xs text-[#636c5c] mt-1 mb-3">
                Paste directly from clipboard with Ctrl+V, or browse manually
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-[#edf2e7] text-[#181a15] border border-[#d0d8c8] transition-all shadow-2xs"
              >
                <FolderOpen className="w-3.5 h-3.5 text-[#3d5926]" />
                <span>Browse File from Computer</span>
              </button>
            </div>

            {selectedImage && (
              <div className="p-3 bg-[#f7f9f5] border border-[#dce3d5] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedImage}
                    alt="Loaded Screenshot"
                    className="w-14 h-14 object-cover rounded-lg border border-[#dce3d5] shadow-xs"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[#181a15]">
                      {isProcessingOcr ? ocrStatusText : "Screenshot Loaded & Parsed"}
                    </span>
                    <p className="text-[11px] text-[#636c5c]">
                      {isProcessingOcr
                        ? "Scanning characters..."
                        : `${ocrQuality?.charCount || inputText.length} characters extracted • Confidence ${
                            ocrQuality?.confidence ?? 90
                          }%`}
                    </p>
                  </div>
                </div>

                {isProcessingOcr && <RefreshCw className="w-4 h-4 text-[#3d5926] animate-spin" />}
              </div>
            )}
          </div>
        )}

        {/* Drop .EML / Email Mode */}
        {activeMode === "email" && (
          <div className="space-y-3">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const files = e.dataTransfer.files;
                if (files && files[0]) {
                  handleEmailOrTextFile(files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                dragOver
                  ? "border-[#84b83f] bg-[#eef5e6]"
                  : "border-[#d0d8c8] hover:border-[#9ec964] bg-[#f9faf7]"
              }`}
            >
              <Mail className="w-8 h-8 text-[#3d5926] mx-auto mb-2" />
              <p className="text-xs sm:text-sm font-semibold text-[#181a15]">
                Drag and drop raw email file (.eml, .txt, .html)
              </p>
              <p className="text-xs text-[#636c5c] mt-1 mb-3">
                Inspects RFC-822 headers, From vs. Reply-To divergence, SPF/DKIM/DMARC & anchor mismatches
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  emailFileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-[#edf2e7] text-[#181a15] border border-[#d0d8c8] transition-all shadow-2xs"
              >
                <FolderOpen className="w-3.5 h-3.5 text-[#3d5926]" />
                <span>Browse .EML / Email File</span>
              </button>
            </div>
          </div>
        )}

        {/* Credential Masking Safety Notice */}
        {maskedEntities.length > 0 && (
          <div className="p-3.5 bg-[#eef5e6] border border-[#cbe0b8] rounded-2xl text-xs text-[#2c401c] flex items-start gap-2.5 animate-in fade-in">
            <KeyRound className="w-4 h-4 text-[#3d5926] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-[#1f3012]">
                Sensitive Credential Masking Active:
              </span>
              <p className="text-[11px] text-[#556149] leading-relaxed">
                Protected {maskedEntities.length} sensitive credential value(s) in browser memory prior to any analysis.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {maskedEntities.map((ent, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-white border border-[#cbe0b8] text-[10px] font-mono text-[#2c401c] shadow-2xs"
                  >
                    {ent.label}: {ent.originalRedacted}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* OCR Quality Notice / Warnings */}
        {ocrQuality && ocrQuality.warnings.length > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-900">OCR Image Quality Notice: </span>
              {ocrQuality.warnings.join(" ")}
            </div>
          </div>
        )}

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onPaste={handleTextPaste}
            placeholder={
              activeMode === "email"
                ? "Paste RFC-822 email headers + body (From, Subject, Reply-To, Authentication-Results)..."
                : activeMode === "image"
                ? "Extracted screenshot text appears here automatically (or paste manually)..."
                : "Paste suspicious SMS, WhatsApp message, email excerpt, or URL here..."
            }
            rows={5}
            className="w-full bg-[#fcfdfa] border border-[#d8e0d0] rounded-2xl p-4 text-sm text-[#181a15] placeholder-[#9aa392] focus:outline-none focus:ring-2 focus:ring-[#bef264] focus:border-[#a0d944] transition-all font-mono resize-y shadow-2xs"
          />
          <div className="absolute bottom-3 right-3 text-[11px] text-[#636c5c] bg-white/90 px-2 py-0.5 rounded-md border border-[#d8e0d0]">
            {inputText.length} chars
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => {
              setInputText("");
              setSelectedImage(null);
              setOcrQuality(null);
              setMaskedEntities([]);
            }}
            className="text-xs text-[#717a69] hover:text-[#181a15] transition-colors"
          >
            Clear input
          </button>

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-6 py-2.5 rounded-2xl font-bold text-sm text-[#162704] bg-[#bef264] hover:bg-[#aee750] border border-[#a8df4a]/70 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_12px_rgba(190,242,100,0.35)] transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Multi-Engine Scan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Message</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

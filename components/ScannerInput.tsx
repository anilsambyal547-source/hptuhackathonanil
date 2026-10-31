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
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-sm space-y-4">
      {/* Input Mode Selector & 1-Click Paste & Scan (Tab clicks ONLY switch mode, NEVER auto-open OS dialog) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveMode("text")}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-all ${
              activeMode === "text"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200"
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
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Screenshot OCR</span>
            <span className="text-[10px] px-1 bg-cyan-950 text-cyan-300 rounded border border-cyan-800/50">
              Ctrl+V
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode("email")}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-all ${
              activeMode === "email"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200"
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
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Clipboard className="w-3.5 h-3.5 text-cyan-400" />
          <span>1-Click Paste & Auto-Scan</span>
        </button>
      </div>

      {/* Preset Quick Loads */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-medium text-slate-400">Attack Vectors & Email Presets:</span>
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
              className="text-xs px-2.5 py-1 rounded-xl bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50 transition-colors flex items-center gap-1.5"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  preset.category === "Legitimate"
                    ? "bg-emerald-400"
                    : preset.category === "Email Phish"
                    ? "bg-purple-400"
                    : "bg-rose-400"
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
            <div className="p-3 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-950/90 border border-cyan-800/40 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>1-Click Built-in Test Screenshots (Zero File Dialog Required):</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">HTML5 Canvas Synthesized</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleLoadBuiltinScreenshot("bank")}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-left transition-all group flex items-start gap-2"
                >
                  <Smartphone className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-xs font-semibold text-slate-200">📱 Bank KYC Scam</div>
                    <div className="text-[10px] text-slate-400">SBI Alert SMS • Clear OCR (96% Conf)</div>
                  </div>
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleLoadBuiltinScreenshot("courier")}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-rose-500/50 text-left transition-all group flex items-start gap-2"
                >
                  <Package className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-xs font-semibold text-slate-200">📦 Courier Parcel Trap</div>
                    <div className="text-[10px] text-slate-400">India Post SMS • Customs Fee Link</div>
                  </div>
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleLoadBuiltinScreenshot("blurry")}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-left transition-all group flex items-start gap-2"
                >
                  <EyeOff className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-xs font-semibold text-slate-200">🌫️ Blurry / Degraded Image</div>
                    <div className="text-[10px] text-slate-400">Graceful Failure & High Uncertainty</div>
                  </div>
                </button>
              </div>
            </div>

            {/* OCR Privacy Mode Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                {useCloudOcr ? (
                  <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <div>
                  <span className="font-medium text-slate-200">
                    {useCloudOcr ? "Cloud Gemini Vision OCR" : "Offline Local OCR (English + Hindi)"}
                  </span>
                  <p className="text-[11px] text-slate-400">
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
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-[11px] text-slate-300">Enable Cloud OCR</span>
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
                  ? "border-cyan-400 bg-cyan-950/20"
                  : "border-slate-700 hover:border-slate-600 bg-slate-950/40"
              }`}
            >
              <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-xs sm:text-sm font-medium text-slate-200">
                Drag and drop screenshot (.png, .jpg, .webp) here
              </p>
              <p className="text-xs text-slate-500 mt-1 mb-3">
                Paste directly from clipboard with Ctrl+V, or browse manually
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm"
              >
                <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Browse File from Computer</span>
              </button>
            </div>

            {selectedImage && (
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedImage}
                    alt="Loaded Screenshot"
                    className="w-14 h-14 object-cover rounded-lg border border-slate-700 shadow-sm"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-200">
                      {isProcessingOcr ? ocrStatusText : "Screenshot Loaded & Parsed"}
                    </span>
                    <p className="text-[11px] text-slate-400">
                      {isProcessingOcr
                        ? "Scanning characters..."
                        : `${ocrQuality?.charCount || inputText.length} characters extracted • Confidence ${
                            ocrQuality?.confidence ?? 90
                          }%`}
                    </p>
                  </div>
                </div>

                {isProcessingOcr && <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />}
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
                  ? "border-cyan-400 bg-cyan-950/20"
                  : "border-slate-700 hover:border-slate-600 bg-slate-950/40"
              }`}
            >
              <Mail className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-xs sm:text-sm font-medium text-slate-200">
                Drag and drop raw email file (.eml, .txt, .html)
              </p>
              <p className="text-xs text-slate-500 mt-1 mb-3">
                Inspects RFC-822 headers, From vs. Reply-To divergence, SPF/DKIM/DMARC & anchor mismatches
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  emailFileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm"
              >
                <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Browse .EML / Email File</span>
              </button>
            </div>
          </div>
        )}

        {/* Credential Masking Safety Notice */}
        {maskedEntities.length > 0 && (
          <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl text-xs text-cyan-300 flex items-start gap-2.5 animate-in fade-in">
            <KeyRound className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-cyan-200">
                Sensitive Credential Masking Active:
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Protected {maskedEntities.length} sensitive credential value(s) in browser memory prior to any analysis.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {maskedEntities.map((ent, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-cyan-800/50 text-[10px] font-mono text-cyan-300"
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
          <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300">OCR Image Quality Notice: </span>
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
            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono resize-y"
          />
          <div className="absolute bottom-3 right-3 text-[11px] text-slate-500 bg-slate-950/90 px-2 py-0.5 rounded border border-slate-800">
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
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Clear input
          </button>

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
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

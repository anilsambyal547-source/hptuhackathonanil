"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, FileText, Image as ImageIcon, Sparkles, RefreshCw, AlertCircle, CheckCircle2, ShieldCheck, Globe, KeyRound } from "lucide-react";
import { OcrQualityReport } from "@/lib/types";
import { runLocalOcr } from "@/lib/ocr/local-ocr";
import { analyzeImageCanvas } from "@/lib/ocr/canvas-ocr";
import { maskCredentials, MaskedEntity } from "@/lib/security/credential-masker";

interface ScannerInputProps {
  onAnalyze: (text: string, inputType: "text" | "ocr_screenshot", ocrQuality?: OcrQualityReport) => void;
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
    label: "Legit Bank Alert",
    category: "Legitimate",
    text: "Your A/C XX4921 has been debited by Rs 350.00 on 30-Oct-26 via UPI to Starbucks. Avl Bal: Rs 24,150.25. If not you, SMS BLOCK to 5676712 - HDFC Bank",
  },
];

export const ScannerInput: React.FC<ScannerInputProps> = ({ onAnalyze, isLoading }) => {
  const [activeMode, setActiveMode] = useState<"text" | "image">("text");
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrStatusText, setOcrStatusText] = useState("Extracting text with OCR...");
  const [ocrQuality, setOcrQuality] = useState<OcrQualityReport | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [useCloudOcr, setUseCloudOcr] = useState(false);
  const [maskedEntities, setMaskedEntities] = useState<MaskedEntity[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setSelectedImage(base64);
      setIsProcessingOcr(true);
      setOcrStatusText("Preparing screenshot...");

      const img = new Image();
      img.onload = async () => {
        // Measure canvas quality client-side
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
          // Explicit Cloud Gemini Vision OCR path
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
          // Local In-Browser OCR path (Tesseract.js English + Hindi)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Run final credential redaction check before analysis
    const maskRes = maskCredentials(inputText);
    if (maskRes.hasMaskedItems) {
      setMaskedEntities((prev) => [...prev, ...maskRes.maskedEntities]);
      setInputText(maskRes.maskedText);
    }

    onAnalyze(maskRes.maskedText, activeMode === "image" ? "ocr_screenshot" : "text", ocrQuality || undefined);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
      {/* Input Mode Selector */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveMode("text")}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 transition-all ${
              activeMode === "text"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Message Text</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode("image")}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 transition-all ${
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
        </div>

        <span className="text-xs text-slate-500 hidden sm:block">
          Passive analysis • Links are never visited
        </span>
      </div>

      {/* Preset Quick Loads */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-medium text-slate-400">Try Real Attack Presets:</span>
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
                setActiveMode("text");
              }}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50 transition-colors flex items-center gap-1.5"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  preset.category === "Legitimate" ? "bg-emerald-400" : "bg-rose-400"
                }`}
              />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {activeMode === "image" && (
          <div className="space-y-3">
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
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragOver
                  ? "border-cyan-400 bg-cyan-950/20"
                  : "border-slate-700 hover:border-slate-600 bg-slate-950/40"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageFile(e.target.files[0]);
                  }
                }}
              />

              {selectedImage ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedImage}
                    alt="Uploaded screenshot"
                    className="max-h-36 rounded-lg border border-slate-700 object-contain shadow-md"
                  />
                  <div className="text-left text-xs text-slate-300 space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-slate-200">Screenshot Loaded</span>
                    </div>
                    {isProcessingOcr ? (
                      <div className="flex items-center gap-2 text-cyan-400">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{ocrStatusText}</span>
                      </div>
                    ) : (
                      <p className="text-slate-400">Click or drop a different image to replace</p>
                    )}
                    {ocrQuality && (
                      <div className="mt-2 pt-2 border-t border-slate-800">
                        <span className="text-[11px] text-slate-400">
                          OCR Confidence:{" "}
                          <strong className="text-cyan-400">{ocrQuality.confidence}%</strong>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-cyan-400 mx-auto" />
                  <p className="text-sm font-medium text-slate-300">
                    Drop a suspicious SMS / WhatsApp screenshot here, or{" "}
                    <span className="text-cyan-400 underline">browse</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    Or press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">Ctrl+V</kbd> anywhere to paste screenshot from clipboard
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Security Notice: Never paste real credentials */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>
              <strong>Privacy Notice:</strong> Never enter real active OTPs, ATM PINs, passwords, or full card numbers.
            </span>
          </div>
          <span className="text-slate-500 hidden sm:inline">Auto-redacted in browser</span>
        </div>

        {/* Masked Credentials Banner */}
        {maskedEntities.length > 0 && (
          <div className="p-3 bg-cyan-950/30 border border-cyan-800/50 rounded-xl text-xs text-cyan-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-cyan-300">
                Client-Side Redaction Active: {maskedEntities.length} sensitive credential{maskedEntities.length > 1 ? "s" : ""} masked
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {maskedEntities.map((ent, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-cyan-900/50 text-cyan-200 border border-cyan-700/40 font-mono text-[11px]"
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
              <span className="font-semibold text-amber-300">OCR Image Notice: </span>
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
            placeholder="Paste suspicious SMS, WhatsApp message, email excerpt, or URL here..."
            rows={5}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono resize-y"
          />
          <div className="absolute bottom-3 right-3 text-[11px] text-slate-500 bg-slate-950/90 px-2 py-0.5 rounded border border-slate-800">
            {inputText.length} chars
          </div>
        </div>

        {/* Action Button */}
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
            className="px-6 py-2.5 rounded-xl font-medium text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
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

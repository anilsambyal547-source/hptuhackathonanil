import { OcrQualityReport } from "../types";

export interface ImageInspectionInput {
  base64Data: string;
  mimeType: string;
  width?: number;
  height?: number;
  fileSizeBytes?: number;
}

export function assessImageQuality({
  mimeType,
  width = 800,
  height = 600,
  fileSizeBytes = 50000,
}: ImageInspectionInput): {
  qualityScore: number; // 0 - 100
  isReadable: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  let score = 90;

  // 1. Resolution checks
  if (width < 320 || height < 240) {
    score -= 40;
    warnings.push(`Low resolution (${width}x${height}px). Small text or micro-URLs may fail to resolve.`);
  } else if (width < 640 || height < 480) {
    score -= 20;
    warnings.push(`Moderate resolution (${width}x${height}px). Recommended minimum is 1080p for crisp text rendering.`);
  }

  // 2. File size / Compression artifact check
  if (fileSizeBytes < 15000) {
    // Under 15KB indicates severe compression or tiny icon
    score -= 30;
    warnings.push("High compression artifacts detected. JPEG blockiness can distort character shapes.");
  }

  // 3. Supported formats check
  const supportedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!supportedMimeTypes.includes(mimeType.toLowerCase())) {
    score -= 35;
    warnings.push(`Unsupported or irregular image format '${mimeType}'. Best results with PNG or WebP screenshots.`);
  }

  const finalScore = Math.max(10, Math.min(100, score));
  const isReadable = finalScore >= 40;

  return {
    qualityScore: finalScore,
    isReadable,
    warnings,
  };
}

export function formatOcrQualityReport({
  extractedText,
  qualityScore,
  rawWarnings,
}: {
  extractedText: string;
  qualityScore: number;
  rawWarnings: string[];
}): OcrQualityReport {
  const charCount = extractedText.trim().length;
  const warnings = [...rawWarnings];

  let adjustedConfidence = qualityScore;
  if (charCount === 0) {
    adjustedConfidence = 0;
    warnings.push("No legible text could be extracted from this image.");
  } else if (charCount < 30) {
    adjustedConfidence = Math.min(adjustedConfidence, 50);
    warnings.push("Extracted text is very short (< 30 characters). Possible partial screenshot.");
  }

  return {
    isReadable: adjustedConfidence >= 40 && charCount > 0,
    confidence: adjustedConfidence,
    charCount,
    warnings,
  };
}


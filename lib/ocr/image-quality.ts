import type { OcrQualityReport } from "../types/index.ts";

export interface ImageInspectionInput {
  base64Data: string;
  mimeType: string;
  width?: number;
  height?: number;
  fileSizeBytes?: number;
  isBlank?: boolean;
}

export interface ImageValidationResult {
  isValid: boolean;
  isReadable: boolean;
  qualityScore: number;
  error?: string;
  warnings: string[];
}

const SUPPORTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_DIMENSION = 8000; // 8000px

/**
 * Validates image integrity and handles corrupted, truncated, zero-byte,
 * wrong-type, oversized, and blank screenshots gracefully without crashing.
 */
export function validateImageIntegrity(input: ImageInspectionInput): ImageValidationResult {
  const warnings: string[] = [];

  // 1. Zero-byte check
  if (!input.base64Data || input.base64Data.trim().length === 0 || input.fileSizeBytes === 0) {
    return {
      isValid: false,
      isReadable: false,
      qualityScore: 0,
      error: "Zero-byte image payload: The uploaded file is completely empty (0 bytes).",
      warnings: ["Image payload contains 0 bytes."],
    };
  }

  // 2. Wrong-type / unsupported format check
  const normalizedMime = (input.mimeType || "").toLowerCase().trim();
  if (!normalizedMime || !SUPPORTED_MIME_TYPES.includes(normalizedMime)) {
    return {
      isValid: false,
      isReadable: false,
      qualityScore: 0,
      error: `Unsupported file format '${input.mimeType || "unknown"}'. Only PNG, JPEG, and WebP screenshots are supported.`,
      warnings: [`Unsupported MIME type: ${input.mimeType}`],
    };
  }

  // 3. Oversized check
  const estimatedSize = input.fileSizeBytes || Math.round(input.base64Data.length * 0.75);
  if (estimatedSize > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (estimatedSize / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      isReadable: false,
      qualityScore: 0,
      error: `Oversized image: File size (${sizeMb} MB) exceeds maximum allowed limit of 10 MB.`,
      warnings: [`File size ${sizeMb} MB exceeds 10MB threshold`],
    };
  }

  if ((input.width && input.width > MAX_DIMENSION) || (input.height && input.height > MAX_DIMENSION)) {
    return {
      isValid: false,
      isReadable: false,
      qualityScore: 0,
      error: `Oversized dimensions: Image resolution (${input.width}x${input.height}) exceeds maximum allowable dimension of ${MAX_DIMENSION}px.`,
      warnings: ["Image dimensions exceed maximum allowed scale."],
    };
  }

  // 4. Base64 Corruption & Truncation checks
  const cleanBase64 = input.base64Data.replace(/^data:image\/[a-z]+;base64,/, "").trim();
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  if (!base64Regex.test(cleanBase64) || cleanBase64.length % 4 !== 0) {
    return {
      isValid: false,
      isReadable: false,
      qualityScore: 0,
      error: "Corrupted or truncated image data: Base64 byte sequence is malformed or invalidly padded.",
      warnings: ["Base64 encoding corruption detected."],
    };
  }

  // Verify header magic bytes
  try {
    const rawHeader = Buffer.from(cleanBase64.slice(0, 32), "base64");
    if (rawHeader.length < 4) {
      return {
        isValid: false,
        isReadable: false,
        qualityScore: 0,
        error: "Truncated image header: File ended prematurely before magic signature could be identified.",
        warnings: ["Image file header truncated."],
      };
    }

    const isPng = rawHeader[0] === 0x89 && rawHeader[1] === 0x50 && rawHeader[2] === 0x4e && rawHeader[3] === 0x47;
    const isJpg = rawHeader[0] === 0xff && rawHeader[1] === 0xd8 && rawHeader[2] === 0xff;
    const isGif = rawHeader[0] === 0x47 && rawHeader[1] === 0x49 && rawHeader[2] === 0x46;
    const isWebp = rawHeader.length >= 12 && rawHeader.toString("ascii", 0, 4) === "RIFF" && rawHeader.toString("ascii", 8, 12) === "WEBP";

    if (!isPng && !isJpg && !isGif && !isWebp) {
      return {
        isValid: false,
        isReadable: false,
        qualityScore: 0,
        error: "Corrupted image file: File header does not match valid PNG, JPEG, WebP, or GIF magic bytes.",
        warnings: ["Invalid magic header bytes."],
      };
    }
  } catch (err) {
    return {
      isValid: false,
      isReadable: false,
      qualityScore: 0,
      error: `Image decoding failure: ${err instanceof Error ? err.message : String(err)}`,
      warnings: ["Buffer decoding error."],
    };
  }

  // 5. Blank image check
  if (input.isBlank) {
    return {
      isValid: false,
      isReadable: false,
      qualityScore: 0,
      error: "Blank screenshot: Image contains uniform or blank background with no discernible textual content.",
      warnings: ["Image is blank or monochromatic."],
    };
  }

  // 6. Quality assessments for resolution, aspect ratio, and compression
  let score = 90;
  const width = input.width || 800;
  const height = input.height || 600;

  if (width < 150 || height < 80) {
    score -= 60;
    warnings.push(`Extremely low resolution (${width}x${height}px). Text is likely illegible or severely pixelated.`);
  } else if (width < 320 || height < 240) {
    score -= 40;
    warnings.push(`Low resolution (${width}x${height}px). Small text or micro-URLs may fail to resolve.`);
  } else if (width < 640 || height < 480) {
    score -= 20;
    warnings.push(`Moderate resolution (${width}x${height}px). Recommended minimum is 1080p for crisp text rendering.`);
  }

  if (estimatedSize < 15000) {
    score -= 30;
    warnings.push("High compression artifacts detected. JPEG blockiness can distort character shapes.");
  }

  const finalScore = Math.max(10, Math.min(100, score));
  return {
    isValid: true,
    isReadable: finalScore >= 40,
    qualityScore: finalScore,
    warnings,
  };
}

export function assessImageQuality(input: ImageInspectionInput): {
  qualityScore: number;
  isReadable: boolean;
  warnings: string[];
} {
  const result = validateImageIntegrity(input);
  return {
    qualityScore: result.qualityScore,
    isReadable: result.isReadable,
    warnings: result.error ? [result.error, ...result.warnings] : result.warnings,
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

  // Check for non-alphanumeric noise ratio (gibberish/noisy OCR check)
  const nonAlphaNum = extractedText.replace(/[\s\w.,!?:;/@-]/g, "").length;
  const gibberishRatio = charCount > 0 ? nonAlphaNum / charCount : 0;
  if (gibberishRatio > 0.30 && charCount > 15) {
    adjustedConfidence = Math.min(adjustedConfidence, 40);
    warnings.push("High non-alphanumeric noise detected. Extracted text may be garbled or corrupted.");
  }

  return {
    isReadable: adjustedConfidence >= 40 && charCount > 0,
    confidence: adjustedConfidence,
    charCount,
    warnings,
  };
}

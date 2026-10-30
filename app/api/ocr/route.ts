import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { validateImageIntegrity, formatOcrQualityReport } from "@/lib/ocr/image-quality";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType = "image/png", width, height, fileSizeBytes, explicitCloudConsent } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Image base64 payload is required." },
        { status: 400 }
      );
    }

    if (!explicitCloudConsent) {
      return NextResponse.json(
        {
          error: "Cloud OCR requires explicit user consent.",
          notice: "By default, use local in-browser OCR for privacy. Enable Cloud OCR toggle only if you explicitly choose to send screenshots to Google Gemini API.",
        },
        { status: 403 }
      );
    }

    // Strip data URL prefix if present (e.g. data:image/png;base64,...)
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    // 1. Assess image integrity, corruption, truncation, and bounds
    const validation = validateImageIntegrity({
      base64Data: cleanBase64,
      mimeType,
      width,
      height,
      fileSizeBytes: fileSizeBytes || Math.round(cleanBase64.length * 0.75),
    });

    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: validation.error,
          extractedText: "",
          ocrReport: formatOcrQualityReport({
            extractedText: "",
            qualityScore: 0,
            rawWarnings: [validation.error || "Image validation error", ...validation.warnings],
          }),
        },
        { status: 400 }
      );
    }

    let extractedText = "";
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY is not configured on the server. Please use local in-browser OCR which works offline.",
          extractedText: "",
          ocrReport: formatOcrQualityReport({
            extractedText: "",
            qualityScore: validation.qualityScore,
            rawWarnings: [...validation.warnings, "Cloud OCR unavailable: GEMINI_API_KEY unset. Local browser OCR should be used."],
          }),
        },
        { status: 200 }
      );
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          },
          "Extract all readable text, SMS body, sender headers, and URLs from this screenshot exactly as they appear. Do not summarize or add markdown formatting. If the image is blurry, corrupted, or unreadable, explain what is wrong.",
        ],
      });

      extractedText = response.text?.trim() || "";
    } catch (err: unknown) {
      console.warn("Gemini OCR error:", err);
      const errMsg = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        {
          error: `Gemini Vision OCR failed: ${errMsg}`,
          extractedText: "",
          ocrReport: formatOcrQualityReport({
            extractedText: "",
            qualityScore: validation.qualityScore,
            rawWarnings: [...validation.warnings, `Cloud OCR error: ${errMsg}`],
          }),
        },
        { status: 200 }
      );
    }

    const ocrReport = formatOcrQualityReport({
      extractedText,
      qualityScore: validation.qualityScore,
      rawWarnings: validation.warnings,
    });

    return NextResponse.json({
      extractedText,
      ocrReport,
    });
  } catch (error: unknown) {
    console.error("API /api/ocr error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "OCR processing failed.", details: message },
      { status: 500 }
    );
  }
}

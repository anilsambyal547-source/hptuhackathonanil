import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { assessImageQuality, formatOcrQualityReport } from "@/lib/ocr/image-quality";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType = "image/png", width, height, fileSizeBytes } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Image base64 payload is required." },
        { status: 400 }
      );
    }

    // Strip data URL prefix if present (e.g. data:image/png;base64,...)
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    // 1. Assess image dimensions and degradation
    const quality = assessImageQuality({
      base64Data: cleanBase64,
      mimeType,
      width,
      height,
      fileSizeBytes: fileSizeBytes || Math.round(cleanBase64.length * 0.75),
    });

    let extractedText = "";
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
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
      }
    }

    const ocrReport = formatOcrQualityReport({
      extractedText,
      qualityScore: quality.qualityScore,
      rawWarnings: quality.warnings,
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


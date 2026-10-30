import { NextRequest, NextResponse } from "next/server";
import { analyzeScamMessage } from "@/lib/engine/pipeline";
import { OcrQualityReport } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, inputType = "text", ocrQuality } = body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid request: text string is required." },
        { status: 400 }
      );
    }

    const result = await analyzeScamMessage({
      text,
      inputType,
      ocrQuality: ocrQuality as OcrQualityReport | undefined,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("API /api/analyze error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal analysis error occurred.", details: message },
      { status: 500 }
    );
  }
}


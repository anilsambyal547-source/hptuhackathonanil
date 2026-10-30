import { NextRequest, NextResponse } from "next/server";
import { runScamDetectionPipeline } from "@/lib/engine/pipeline";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let rawText = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      rawText = body.rawEmail || body.text || body.content || body.payload || "";
    } else {
      rawText = await req.text();
    }

    if (!rawText.trim()) {
      return NextResponse.json(
        { error: "Empty email payload provided. Submit RFC-822 formatted text or JSON { rawEmail }." },
        { status: 400 }
      );
    }

    const result = await runScamDetectionPipeline({
      inputText: rawText,
      inputType: "email_eml",
      skipAi: false,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("Inbound mail parsing failed:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Inbound mail processing failure: ${msg}` },
      { status: 500 }
    );
  }
}


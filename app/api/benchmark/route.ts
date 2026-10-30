import { NextResponse } from "next/server";
import { runBenchmarkEvaluation } from "@/lib/engine/benchmark-runner";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await runBenchmarkEvaluation();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("API /api/benchmark error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to run benchmark suite", details: message },
      { status: 500 }
    );
  }
}


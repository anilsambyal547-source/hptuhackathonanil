import { GoogleGenAI } from "@google/genai";
import { AiAnalysisResult, RiskLevel } from "../types";

export async function analyzeWithGemini(
  text: string,
  heuristicSummary: string
): Promise<AiAnalysisResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Graceful offline fallback: semantic heuristics
    return generateLocalSemanticAssessment(text);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a cybersecurity scam and fraud detection expert. Analyze the following suspicious message.
Examine psychological coercion tactics, manufactured urgency, social engineering, credential harvesting, or fake authority.

Message to analyze:
"""
${text}
"""

Contextual heuristic signals already found:
${heuristicSummary}

Respond strictly in valid JSON format matching this schema:
{
  "riskScore": number (0 to 100),
  "riskLevel": "low" | "suspicious" | "high",
  "reasoning": "Clear concise explanation of why this message is or isn't a scam",
  "manipulationTactics": ["List of detected psychological or social engineering tactics"],
  "plainLanguageExplanation": "Simple, accessible explanation for everyday citizens",
  "confidenceScore": number (0.0 to 1.0),
  "safeNextSteps": ["Actionable protective steps for the recipient"]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const outputText = response.text?.trim() || "";
    const parsed = JSON.parse(outputText);

    return {
      riskScore: Math.min(100, Math.max(0, Number(parsed.riskScore) || 50)),
      riskLevel: (["low", "suspicious", "high"].includes(parsed.riskLevel)
        ? parsed.riskLevel
        : "suspicious") as RiskLevel,
      reasoning: parsed.reasoning || "Contextual semantic analysis completed.",
      manipulationTactics: Array.isArray(parsed.manipulationTactics) ? parsed.manipulationTactics : [],
      plainLanguageExplanation: parsed.plainLanguageExplanation || parsed.reasoning || "Analysis complete.",
      confidenceScore: Math.min(1.0, Math.max(0.0, Number(parsed.confidenceScore) || 0.8)),
      safeNextSteps: Array.isArray(parsed.safeNextSteps) ? parsed.safeNextSteps : [],
    };
  } catch (error) {
    console.warn("Gemini API call failed, falling back to local semantic evaluator:", error);
    return generateLocalSemanticAssessment(text);
  }
}

// Resilient local semantic evaluation when API key is unset or offline
export function generateLocalSemanticAssessment(text: string): AiAnalysisResult {
  const lower = text.toLowerCase();
  const tactics: string[] = [];
  let score = 15;

  if (/\b(urgent|immediately|within \d+|suspended|blocked)\b/i.test(lower)) {
    tactics.push("Manufactured Urgency (Time pressure forcing panic)");
    score += 25;
  }
  if (/\b(police|cbi|arrest|fir|customs|warrant|narcotics)\b/i.test(lower)) {
    tactics.push("Authority Intimidation (Impersonating law enforcement)");
    score += 35;
  }
  if (/\b(otp|cvv|pin|password|kyc|pan|aadhaar)\b/i.test(lower)) {
    tactics.push("Credential Harvesting (Deceptive solicitation of sensitive authentication keys)");
    score += 30;
  }
  if (/\b(won|lottery|prize|refund|cashback|bonus|earn)\b/i.test(lower)) {
    tactics.push("Financial Greed / Reward Exploitation");
    score += 25;
  }
  if (/\b(click|link|update|verify|download|apk)\b/i.test(lower)) {
    tactics.push("Call-To-Action Coercion");
    score += 15;
  }

  const finalScore = Math.min(100, score);
  const riskLevel: RiskLevel = finalScore >= 70 ? "high" : finalScore >= 35 ? "suspicious" : "low";

  return {
    riskScore: finalScore,
    riskLevel,
    reasoning: tactics.length > 0
      ? `Identified ${tactics.length} psychological coercion vectors: ${tactics.join("; ")}.`
      : "No strong psychological pressure or credential solicitation vectors observed in message context.",
    manipulationTactics: tactics,
    plainLanguageExplanation:
      riskLevel === "high"
        ? "This message exhibits strong characteristics of a social engineering attack designed to pressure or deceive you into surrendering credentials or funds."
        : riskLevel === "suspicious"
        ? "This message contains ambiguous or urgent wording that warrants caution. Verify directly with the sender before taking any action."
        : "This message does not exhibit obvious phishing or coercion indicators.",
    confidenceScore: 0.85,
    safeNextSteps:
      riskLevel === "high"
        ? [
            "Do not click any embedded links or download attachments.",
            "Never share OTPs, passwords, or PINs with anyone.",
            "Verify the status independently through official mobile banking or courier apps.",
            "Report fraudulent messages to the National Cyber Crime Portal (1930 / cybercrime.gov.in).",
          ]
        : [
            "Verify any requests independently through official channels.",
            "Never share security credentials.",
          ],
  };
}


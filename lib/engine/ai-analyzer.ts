import { GoogleGenAI } from "@google/genai";
import { AiAnalysisResult, RiskLevel } from "../types";

export async function analyzeWithGemini(
  text: string,
  heuristicSummary: string
): Promise<AiAnalysisResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // When API key is not configured, AI analysis is unavailable
    return null;
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
    console.warn("Gemini API call failed or unavailable:", error);
    return null;
  }
}

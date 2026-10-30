import { BENCHMARK_DATASET } from "../data/benchmark-dataset";
import { BenchmarkResultItem, BenchmarkSummaryMetrics, RiskLevel } from "../types";
import { analyzeScamMessage } from "./pipeline";

export async function runBenchmarkEvaluation(): Promise<{
  items: BenchmarkResultItem[];
  metrics: BenchmarkSummaryMetrics;
}> {
  const items: BenchmarkResultItem[] = [];

  // Matrix: [Actual][Predicted]
  const matrix = {
    high: { high: 0, suspicious: 0, low: 0 },
    suspicious: { high: 0, suspicious: 0, low: 0 },
    low: { high: 0, suspicious: 0, low: 0 },
  };

  let totalLatency = 0;

  for (const sample of BENCHMARK_DATASET) {
    const itemStart = Date.now();
    const result = await analyzeScamMessage({
      text: sample.text,
      inputType: "text",
      skipAi: true,
    });
    const itemLatency = Date.now() - itemStart;
    totalLatency += itemLatency;

    const actual = sample.groundTruth;
    const predicted = result.overallRisk;

    matrix[actual][predicted]++;

    const isCorrect = actual === predicted;

    items.push({
      id: sample.id,
      title: sample.title,
      category: sample.category,
      groundTruth: actual,
      predictedRisk: predicted,
      riskScore: result.riskScore,
      confidencePercent: result.uncertainty.confidencePercent,
      isCorrect,
      latencyMs: itemLatency,
      triggerCount: result.evidenceSpans.length,
    });
  }

  const total = items.length;
  const correct = items.filter((i) => i.isCorrect).length;
  const accuracy = Math.round((correct / total) * 1000) / 10;

  // Calculate Precision, Recall, and F1 for each class
  const calculateClassMetrics = (tier: RiskLevel) => {
    const truePos = matrix[tier][tier];
    const falsePos =
      (tier === "high"
        ? matrix.suspicious.high + matrix.low.high
        : tier === "suspicious"
        ? matrix.high.suspicious + matrix.low.suspicious
        : matrix.high.low + matrix.suspicious.low);

    const falseNeg =
      (tier === "high"
        ? matrix.high.suspicious + matrix.high.low
        : tier === "suspicious"
        ? matrix.suspicious.high + matrix.suspicious.low
        : matrix.low.high + matrix.low.suspicious);

    const precision = truePos + falsePos > 0 ? (truePos / (truePos + falsePos)) * 100 : 100;
    const recall = truePos + falseNeg > 0 ? (truePos / (truePos + falseNeg)) * 100 : 100;
    const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    return {
      precision: Math.round(precision * 10) / 10,
      recall: Math.round(recall * 10) / 10,
      f1: Math.round(f1 * 10) / 10,
    };
  };

  const highM = calculateClassMetrics("high");
  const suspM = calculateClassMetrics("suspicious");
  const lowM = calculateClassMetrics("low");

  const macroAvgPrecision = Math.round(((highM.precision + suspM.precision + lowM.precision) / 3) * 10) / 10;
  const macroAvgRecall = Math.round(((highM.recall + suspM.recall + lowM.recall) / 3) * 10) / 10;
  const macroAvgF1 = Math.round(((highM.f1 + suspM.f1 + lowM.f1) / 3) * 10) / 10;

  const metrics: BenchmarkSummaryMetrics = {
    totalSamples: total,
    correctPredictions: correct,
    accuracy,
    precision: {
      high: highM.precision,
      suspicious: suspM.precision,
      low: lowM.precision,
      macroAvg: macroAvgPrecision,
    },
    recall: {
      high: highM.recall,
      suspicious: suspM.recall,
      low: lowM.recall,
      macroAvg: macroAvgRecall,
    },
    f1Score: {
      high: highM.f1,
      suspicious: suspM.f1,
      low: lowM.f1,
      macroAvg: macroAvgF1,
    },
    confusionMatrix: {
      actualHigh_predHigh: matrix.high.high,
      actualHigh_predSuspicious: matrix.high.suspicious,
      actualHigh_predLow: matrix.high.low,
      actualSuspicious_predHigh: matrix.suspicious.high,
      actualSuspicious_predSuspicious: matrix.suspicious.suspicious,
      actualSuspicious_predLow: matrix.suspicious.low,
      actualLow_predHigh: matrix.low.high,
      actualLow_predSuspicious: matrix.low.suspicious,
      actualLow_predLow: matrix.low.low,
    },
    averageLatencyMs: Math.round(totalLatency / total),
  };

  return {
    items,
    metrics,
  };
}


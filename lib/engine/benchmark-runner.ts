import { BENCHMARK_DATASET } from "../data/benchmark-dataset";
import {
  BenchmarkResultItem,
  BenchmarkSummaryMetrics,
  BenchmarkMisclassifiedItem,
  SplitMetrics,
  RiskLevel,
} from "../types";
import { runScamDetectionPipeline } from "./pipeline";

interface ConfusionMatrixInternal {
  high: { high: number; suspicious: number; low: number };
  suspicious: { high: number; suspicious: number; low: number };
  low: { high: number; suspicious: number; low: number };
}

function createEmptyMatrix(): ConfusionMatrixInternal {
  return {
    high: { high: 0, suspicious: 0, low: 0 },
    suspicious: { high: 0, suspicious: 0, low: 0 },
    low: { high: 0, suspicious: 0, low: 0 },
  };
}

function calculateClassMetrics(matrix: ConfusionMatrixInternal, tier: RiskLevel) {
  const truePos = matrix[tier][tier];
  const falsePos =
    tier === "high"
      ? matrix.suspicious.high + matrix.low.high
      : tier === "suspicious"
      ? matrix.high.suspicious + matrix.low.suspicious
      : matrix.high.low + matrix.suspicious.low;

  const falseNeg =
    tier === "high"
      ? matrix.high.suspicious + matrix.high.low
      : tier === "suspicious"
      ? matrix.suspicious.high + matrix.suspicious.low
      : matrix.low.high + matrix.low.suspicious;

  const precision = truePos + falsePos > 0 ? (truePos / (truePos + falsePos)) * 100 : 100;
  const recall = truePos + falseNeg > 0 ? (truePos / (truePos + falseNeg)) * 100 : 100;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return {
    precision: Math.round(precision * 10) / 10,
    recall: Math.round(recall * 10) / 10,
    f1: Math.round(f1 * 10) / 10,
  };
}

function buildSplitMetrics(items: BenchmarkResultItem[], matrix: ConfusionMatrixInternal): SplitMetrics {
  const total = items.length;
  const correct = items.filter((i) => i.isCorrect).length;
  const accuracy = total > 0 ? Math.round((correct / total) * 1000) / 10 : 0;

  const highM = calculateClassMetrics(matrix, "high");
  const suspM = calculateClassMetrics(matrix, "suspicious");
  const lowM = calculateClassMetrics(matrix, "low");

  const macroAvgPrecision = Math.round(((highM.precision + suspM.precision + lowM.precision) / 3) * 10) / 10;
  const macroAvgRecall = Math.round(((highM.recall + suspM.recall + lowM.recall) / 3) * 10) / 10;
  const macroAvgF1 = Math.round(((highM.f1 + suspM.f1 + lowM.f1) / 3) * 10) / 10;

  return {
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
  };
}

export async function runBenchmarkEvaluation(): Promise<{
  items: BenchmarkResultItem[];
  metrics: BenchmarkSummaryMetrics;
}> {
  const items: BenchmarkResultItem[] = [];
  const misclassifiedSamples: BenchmarkMisclassifiedItem[] = [];

  const overallMatrix = createEmptyMatrix();
  const devMatrix = createEmptyMatrix();
  const holdoutMatrix = createEmptyMatrix();

  const devItems: BenchmarkResultItem[] = [];
  const holdoutItems: BenchmarkResultItem[] = [];

  const batchStart = performance.now();

  for (const sample of BENCHMARK_DATASET) {
    const itemStart = performance.now();
    const result = await runScamDetectionPipeline({
      inputText: sample.text,
      inputType: "text",
      skipAi: true,
    });
    const itemLatency = Number((performance.now() - itemStart).toFixed(2));

    const actual = sample.groundTruth;
    const predicted = result.overallRisk;
    const isCorrect = actual === predicted;

    overallMatrix[actual][predicted]++;
    if (sample.split === "dev") {
      devMatrix[actual][predicted]++;
    } else {
      holdoutMatrix[actual][predicted]++;
    }

    const rulesFired = result.heuristicsHits.map((h) => `${h.id} (${h.title})`);

    const resultItem: BenchmarkResultItem = {
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
      split: sample.split,
      rulesFired,
    };

    items.push(resultItem);
    if (sample.split === "dev") {
      devItems.push(resultItem);
    } else {
      holdoutItems.push(resultItem);
    }

    if (!isCorrect) {
      misclassifiedSamples.push({
        id: sample.id,
        title: sample.title,
        text: sample.text,
        groundTruth: actual,
        predictedRisk: predicted,
        riskScore: result.riskScore,
        rulesFired,
        split: sample.split,
      });
    }
  }

  const batchDuration = performance.now() - batchStart;
  const averageLatencyMs = Number((batchDuration / items.length).toFixed(2));

  const total = items.length;
  const correct = items.filter((i) => i.isCorrect).length;
  const accuracy = Math.round((correct / total) * 1000) / 10;

  const highM = calculateClassMetrics(overallMatrix, "high");
  const suspM = calculateClassMetrics(overallMatrix, "suspicious");
  const lowM = calculateClassMetrics(overallMatrix, "low");

  const macroAvgPrecision = Math.round(((highM.precision + suspM.precision + lowM.precision) / 3) * 10) / 10;
  const macroAvgRecall = Math.round(((highM.recall + suspM.recall + lowM.recall) / 3) * 10) / 10;
  const macroAvgF1 = Math.round(((highM.f1 + suspM.f1 + lowM.f1) / 3) * 10) / 10;

  const devMetrics = buildSplitMetrics(devItems, devMatrix);
  const holdoutMetrics = buildSplitMetrics(holdoutItems, holdoutMatrix);

  const metrics: BenchmarkSummaryMetrics = {
    totalSamples: total,
    scamSamples: items.filter((i) => i.groundTruth !== "low").length,
    legitimateSamples: items.filter((i) => i.groundTruth === "low").length,
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
      actualHigh_predHigh: overallMatrix.high.high,
      actualHigh_predSuspicious: overallMatrix.high.suspicious,
      actualHigh_predLow: overallMatrix.high.low,
      actualSuspicious_predHigh: overallMatrix.suspicious.high,
      actualSuspicious_predSuspicious: overallMatrix.suspicious.suspicious,
      actualSuspicious_predLow: overallMatrix.suspicious.low,
      actualLow_predHigh: overallMatrix.low.high,
      actualLow_predSuspicious: overallMatrix.low.suspicious,
      actualLow_predLow: overallMatrix.low.low,
    },
    averageLatencyMs,
    devMetrics,
    holdoutMetrics,
    misclassifiedSamples,
    sampleSizeNote: `Small curated benchmark subset: ${total} total samples (${devItems.length} dev / ${holdoutItems.length} holdout). Metrics reflect local deterministic execution on this curated set.`,
  };

  return {
    items,
    metrics,
  };
}

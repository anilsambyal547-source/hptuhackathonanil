import { BENCHMARK_DATASET } from "../lib/data/benchmark-dataset";
import { runBenchmarkEvaluation } from "../lib/engine/benchmark-runner";

async function run() {
  const dev = BENCHMARK_DATASET.filter((s) => s.split === "dev");
  const holdout = BENCHMARK_DATASET.filter((s) => s.split === "holdout");

  console.log("=== DATASET BREAKDOWN ===");
  console.log(`Dev Total: ${dev.length} (Synthetic: ${dev.filter(s => s.isSynthetic).length}, Real: ${dev.filter(s => !s.isSynthetic).length})`);
  console.log("Dev Ground Truth:", {
    high: dev.filter(s => s.groundTruth === "high").length,
    suspicious: dev.filter(s => s.groundTruth === "suspicious").length,
    low: dev.filter(s => s.groundTruth === "low").length,
  });

  console.log(`Holdout Total: ${holdout.length} (Synthetic: ${holdout.filter(s => s.isSynthetic).length}, Real: ${holdout.filter(s => !s.isSynthetic).length})`);
  console.log("Holdout Ground Truth:", {
    high: holdout.filter(s => s.groundTruth === "high").length,
    suspicious: holdout.filter(s => s.groundTruth === "suspicious").length,
    low: holdout.filter(s => s.groundTruth === "low").length,
  });

  console.log("\n=== RUNNING BENCHMARK EVALUATION ===");
  const { metrics } = await runBenchmarkEvaluation();
  console.log("Confusion Matrix (Overall):", JSON.stringify(metrics.confusionMatrix, null, 2));
  console.log("Dev Split Metrics:", JSON.stringify(metrics.devMetrics, null, 2));
  console.log("Holdout Split Metrics:", JSON.stringify(metrics.holdoutMetrics, null, 2));
}

run().catch(console.error);

import { runBenchmarkEvaluation } from "../lib/engine/benchmark-runner";

async function main() {
  const { metrics } = await runBenchmarkEvaluation();
  console.log("Overall Accuracy:", metrics.accuracy + "%");
  console.log("Dev Accuracy:", metrics.devMetrics.accuracy + "% (" + metrics.devMetrics.correctPredictions + "/" + metrics.devMetrics.totalSamples + ")");
  console.log("Holdout Accuracy:", metrics.holdoutMetrics.accuracy + "% (" + metrics.holdoutMetrics.correctPredictions + "/" + metrics.holdoutMetrics.totalSamples + ")");
  console.log("Misclassified count:", metrics.misclassifiedSamples.length);
  if (metrics.misclassifiedSamples.length > 0) {
    console.log("Misclassified:", metrics.misclassifiedSamples);
  }
}

main();

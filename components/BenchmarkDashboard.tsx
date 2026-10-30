"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Play,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Award,
  AlertTriangle,
  Info,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BenchmarkResultItem, BenchmarkSummaryMetrics } from "@/lib/types";

export const BenchmarkDashboard: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    items: BenchmarkResultItem[];
    metrics: BenchmarkSummaryMetrics;
  } | null>(null);
  const [filterSplit, setFilterSplit] = useState<"all" | "dev" | "holdout">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "correct" | "incorrect">("all");

  const runBenchmark = async () => {
    setIsRunning(true);
    try {
      const res = await fetch("/api/benchmark");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Benchmark execution failed:", err);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    runBenchmark();
  }, []);

  const metrics = results?.metrics;
  const items = results?.items || [];

  const filteredItems = items.filter((item) => {
    const matchesSplit = filterSplit === "all" || item.split === filterSplit;
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "correct" && item.isCorrect) ||
      (filterStatus === "incorrect" && !item.isCorrect);
    return matchesSplit && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(items.map((i) => i.category)));

  // Format data for category performance chart
  const categoryChartData = categories.map((cat) => {
    const catItems = items.filter((i) => i.category === cat);
    const correctCount = catItems.filter((i) => i.isCorrect).length;
    const totalCount = catItems.length;
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    return {
      name: cat.replace(/_/g, " "),
      accuracy,
      total: totalCount,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Evaluation & Benchmark Suite
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Independent evaluation across curated smishing, extortion, phishing, and legitimate baselines.
          </p>
        </div>

        <button
          onClick={runBenchmark}
          disabled={isRunning}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all flex items-center gap-2 disabled:opacity-50 shadow-md shadow-cyan-500/20"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Evaluating Dataset...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Re-run Benchmark</span>
            </>
          )}
        </button>
      </div>

      {/* Sample Size Transparency Note */}
      {metrics && (
        <div className="flex items-start gap-2.5 p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200">Evaluation Scope Note: </span>
            {metrics.sampleSizeNote}
          </div>
        </div>
      )}

      {/* Primary KPI Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Accuracy */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Overall Accuracy</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {metrics.accuracy}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {metrics.correctPredictions} / {metrics.totalSamples} correct predictions
            </div>
          </div>

          {/* Scam Recall */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Scam Recall (High)</span>
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
              {metrics.recall.high}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              F1: {metrics.f1Score.high}% • Prec: {metrics.precision.high}%
            </div>
          </div>

          {/* Legit Precision */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Legit Precision (Low)</span>
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">
              {metrics.precision.low}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Low false alarm rate on authentic bank/courier alerts
            </div>
          </div>

          {/* Execution Latency */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Avg Engine Latency</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
              {metrics.averageLatencyMs}ms
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              High-throughput local deterministic execution
            </div>
          </div>
        </div>
      )}

      {/* Dev vs Holdout Split Performance */}
      {metrics && metrics.devMetrics && metrics.holdoutMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dev Set */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-slate-300">
                  Dev Set (Tuning Subset)
                </span>
                <p className="text-[11px] text-slate-500">
                  {metrics.devMetrics.totalSamples} samples used during engine calibration
                </p>
              </div>
              <span className="text-lg font-bold font-mono text-cyan-400">
                {metrics.devMetrics.accuracy}% Acc
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">High Recall</span>
                <strong className="text-slate-200 font-mono">{metrics.devMetrics.recall.high}%</strong>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Low Precision</span>
                <strong className="text-slate-200 font-mono">{metrics.devMetrics.precision.low}%</strong>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Macro F1</span>
                <strong className="text-slate-200 font-mono">{metrics.devMetrics.f1Score.macroAvg}%</strong>
              </div>
            </div>
          </div>

          {/* Holdout Set */}
          <div className="bg-slate-900/60 border border-cyan-900/40 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-cyan-300">
                  Holdout Set (Untuned Test)
                </span>
                <p className="text-[11px] text-slate-500">
                  {metrics.holdoutMetrics.totalSamples} samples strictly held out; zero rule tuning
                </p>
              </div>
              <span className="text-lg font-bold font-mono text-emerald-400">
                {metrics.holdoutMetrics.accuracy}% Acc
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">High Recall</span>
                <strong className="text-slate-200 font-mono">{metrics.holdoutMetrics.recall.high}%</strong>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Low Precision</span>
                <strong className="text-slate-200 font-mono">{metrics.holdoutMetrics.precision.low}%</strong>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Macro F1</span>
                <strong className="text-slate-200 font-mono">{metrics.holdoutMetrics.f1Score.macroAvg}%</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Misclassified Samples Section */}
      {metrics && metrics.misclassifiedSamples && metrics.misclassifiedSamples.length > 0 && (
        <div className="bg-slate-900/60 border border-amber-900/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Misclassified Samples Audit ({metrics.misclassifiedSamples.length} instances)
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Examining borderline thresholds and rule gaps
            </span>
          </div>

          <div className="space-y-3">
            {metrics.misclassifiedSamples.map((sample) => (
              <div
                key={sample.id}
                className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-200">{sample.id}</span>
                    <span className="text-slate-400">({sample.title})</span>
                    <span
                      className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border ${
                        sample.split === "holdout"
                          ? "bg-purple-950/60 text-purple-300 border-purple-800/50"
                          : "bg-slate-800 text-slate-300 border-slate-700"
                      }`}
                    >
                      {sample.split}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-500">Actual:</span>
                    <span
                      className={`font-bold uppercase ${
                        sample.groundTruth === "high"
                          ? "text-rose-400"
                          : sample.groundTruth === "suspicious"
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {sample.groundTruth}
                    </span>
                    <span className="text-slate-600">→</span>
                    <span className="text-slate-500">Predicted:</span>
                    <span
                      className={`font-bold uppercase ${
                        sample.predictedRisk === "high"
                          ? "text-rose-400"
                          : sample.predictedRisk === "suspicious"
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {sample.predictedRisk}
                    </span>
                    <span className="text-slate-400">(Score: {sample.riskScore})</span>
                  </div>
                </div>

                <p className="text-slate-300 font-mono text-[11px] bg-slate-900/80 p-2 rounded border border-slate-800/60">
                  &ldquo;{sample.text}&rdquo;
                </p>

                <div className="text-[11px] text-slate-400">
                  <span className="text-slate-500">Rules Fired: </span>
                  {sample.rulesFired.length > 0 ? sample.rulesFired.join("; ") : "None (Pass-through)"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confusion Matrix & Category Breakdown */}
      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 3x3 Confusion Matrix */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white tracking-wide">
                3x3 Multi-Class Confusion Matrix
              </h3>
              <span className="text-xs text-slate-500">Rows: Actual • Cols: Predicted</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="p-2 text-left font-medium">Actual \ Predicted</th>
                    <th className="p-2 font-medium text-rose-400">Pred High</th>
                    <th className="p-2 font-medium text-amber-400">Pred Suspicious</th>
                    <th className="p-2 font-medium text-emerald-400">Pred Low</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 font-mono text-xs">
                  <tr>
                    <td className="p-3 text-left font-semibold text-rose-300">
                      Actual: High
                    </td>
                    <td className="p-3 bg-emerald-950/40 text-emerald-300 font-bold border border-emerald-800/40">
                      {metrics.confusionMatrix.actualHigh_predHigh} (TP)
                    </td>
                    <td className="p-3 bg-slate-950 text-slate-300">
                      {metrics.confusionMatrix.actualHigh_predSuspicious}
                    </td>
                    <td className="p-3 bg-rose-950/40 text-rose-400 border border-rose-800/40">
                      {metrics.confusionMatrix.actualHigh_predLow} (FN)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-left font-semibold text-amber-300">
                      Actual: Suspicious
                    </td>
                    <td className="p-3 bg-slate-950 text-slate-300">
                      {metrics.confusionMatrix.actualSuspicious_predHigh}
                    </td>
                    <td className="p-3 bg-emerald-950/40 text-emerald-300 font-bold border border-emerald-800/40">
                      {metrics.confusionMatrix.actualSuspicious_predSuspicious} (Match)
                    </td>
                    <td className="p-3 bg-slate-950 text-slate-300">
                      {metrics.confusionMatrix.actualSuspicious_predLow}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-left font-semibold text-emerald-300">
                      Actual: Low
                    </td>
                    <td className="p-3 bg-rose-950/40 text-rose-400 border border-rose-800/40">
                      {metrics.confusionMatrix.actualLow_predHigh} (FP)
                    </td>
                    <td className="p-3 bg-slate-950 text-slate-300">
                      {metrics.confusionMatrix.actualLow_predSuspicious}
                    </td>
                    <td className="p-3 bg-emerald-950/40 text-emerald-300 font-bold border border-emerald-800/40">
                      {metrics.confusionMatrix.actualLow_predLow} (TN)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
              Diagonal green cells represent correct matches. Off-diagonal cells indicate false alarms or boundary differences.
            </p>
          </div>

          {/* Category Accuracy Recharts */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-white tracking-wide mb-4">
              Accuracy by Attack Vector & Category (%)
            </h3>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#cbd5e1"
                    fontSize={11}
                    width={110}
                    tick={{ fill: "#94a3b8" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
                    {categoryChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.accuracy >= 90 ? "#10b981" : entry.accuracy >= 75 ? "#38bdf8" : "#f59e0b"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Sample Explorer */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Curated Benchmark Sample Explorer ({filteredItems.length} samples)
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {/* Split filter */}
            <select
              value={filterSplit}
              onChange={(e) => setFilterSplit(e.target.value as "all" | "dev" | "holdout")}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Splits</option>
              <option value="dev">Dev Only (40)</option>
              <option value="holdout">Holdout Only (35)</option>
            </select>

            {/* Category filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c.replace(/_/g, " ")}
                </option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as "all" | "correct" | "incorrect")}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Outcomes</option>
              <option value="correct">Correct Only</option>
              <option value="incorrect">Incorrect Only</option>
            </select>
          </div>
        </div>

        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                item.isCorrect
                  ? "bg-slate-950/70 border-slate-800/70 hover:border-slate-700"
                  : "bg-rose-950/20 border-rose-800/50"
              }`}
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">{item.title}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">
                    {item.category.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`text-[9px] uppercase font-mono px-1 rounded ${
                      item.split === "holdout"
                        ? "bg-purple-950 text-purple-300 border border-purple-800/40"
                        : "bg-slate-900 text-slate-400 border border-slate-800"
                    }`}
                  >
                    {item.split}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] flex items-center gap-2">
                  <span>Triggers identified: {item.triggerCount}</span>
                  <span>•</span>
                  <span>Latency: {item.latencyMs}ms</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase">Ground Truth</div>
                  <span
                    className={`font-mono font-bold uppercase text-[11px] ${
                      item.groundTruth === "high"
                        ? "text-rose-400"
                        : item.groundTruth === "suspicious"
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {item.groundTruth}
                  </span>
                </div>

                <div className="text-slate-600 font-bold">→</div>

                <div className="text-left">
                  <div className="text-[10px] text-slate-500 uppercase">Predicted</div>
                  <span
                    className={`font-mono font-bold uppercase text-[11px] ${
                      item.predictedRisk === "high"
                        ? "text-rose-400"
                        : item.predictedRisk === "suspicious"
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {item.predictedRisk}
                  </span>
                </div>

                <div className="pl-2 border-l border-slate-800">
                  {item.isCorrect ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Pass</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-400 font-medium">
                      <XCircle className="w-4 h-4" />
                      <span>Fail</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

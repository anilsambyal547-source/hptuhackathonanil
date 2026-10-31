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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#e2e6dc] rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#3d5926]" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#181a15] tracking-tight">
              Evaluation & Benchmark Suite
            </h2>
          </div>
          <p className="text-xs text-[#636c5c] mt-1">
            Independent evaluation across curated smishing, extortion, phishing, and legitimate baselines.
          </p>
        </div>

        <button
          onClick={runBenchmark}
          disabled={isRunning}
          className="px-5 py-2.5 rounded-2xl bg-[#bef264] hover:bg-[#aee750] text-[#162704] font-bold text-xs border border-[#a8df4a]/70 transition-all flex items-center gap-2 disabled:opacity-50 shadow-2xs"
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
        <div className="flex items-start gap-2.5 p-4 bg-[#f8faf6] border border-[#dce3d5] rounded-2xl text-xs text-[#525a4c] shadow-2xs">
          <Info className="w-4 h-4 text-[#3d5926] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#181a15]">Evaluation Scope Note: </span>
            {metrics.sampleSizeNote}
          </div>
        </div>
      )}

      {/* Primary KPI Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Accuracy */}
          <div className="bg-white border border-[#e2e6dc] rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between text-[#636c5c] text-xs mb-2">
              <span className="font-medium">Overall Accuracy</span>
              <Award className="w-4 h-4 text-[#3d5926]" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#181a15]">
              {metrics.accuracy}%
            </div>
            <div className="text-[11px] text-[#717a69] mt-1">
              {metrics.correctPredictions} / {metrics.totalSamples} correct predictions
            </div>
          </div>

          {/* Scam Recall */}
          <div className="bg-white border border-[#e2e6dc] rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between text-[#636c5c] text-xs mb-2">
              <span className="font-medium">Scam Recall (High)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-rose-700">
              {metrics.recall.high}%
            </div>
            <div className="text-[11px] text-[#717a69] mt-1">
              F1: {metrics.f1Score.high}% • Prec: {metrics.precision.high}%
            </div>
          </div>

          {/* Legit Precision */}
          <div className="bg-white border border-[#e2e6dc] rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between text-[#636c5c] text-xs mb-2">
              <span className="font-medium">Legit Precision (Low)</span>
              <Layers className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#3d5926]">
              {metrics.precision.low}%
            </div>
            <div className="text-[11px] text-[#717a69] mt-1">
              Low false alarm rate on authentic bank/courier alerts
            </div>
          </div>

          {/* Execution Latency */}
          <div className="bg-white border border-[#e2e6dc] rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between text-[#636c5c] text-xs mb-2">
              <span className="font-medium">Avg Engine Latency</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-amber-800">
              {metrics.averageLatencyMs}ms
            </div>
            <div className="text-[11px] text-[#717a69] mt-1">
              High-throughput local deterministic execution
            </div>
          </div>
        </div>
      )}

      {/* Dev vs Holdout Split Performance */}
      {metrics && metrics.devMetrics && metrics.holdoutMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dev Set */}
          <div className="bg-white border border-[#e2e6dc] rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-[#e2e6dc] pb-3 mb-3">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#181a15]">
                  Dev Set (Tuning Subset)
                </span>
                <p className="text-[11px] text-[#717a69]">
                  {metrics.devMetrics.totalSamples} samples used during initial rule tuning
                </p>
              </div>
              <span className="text-lg font-serif font-bold text-[#3d5926]">
                {metrics.devMetrics.accuracy}% Acc
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-[#f7f9f5] rounded-xl border border-[#e2e6dc]">
                <span className="text-[10px] text-[#717a69] uppercase block font-medium">High Recall</span>
                <strong className="text-rose-700 font-mono">{metrics.devMetrics.recall.high}%</strong>
              </div>
              <div className="p-2.5 bg-[#f7f9f5] rounded-xl border border-[#e2e6dc]">
                <span className="text-[10px] text-[#717a69] uppercase block font-medium">Low Precision</span>
                <strong className="text-[#3d5926] font-mono">{metrics.devMetrics.precision.low}%</strong>
              </div>
              <div className="p-2.5 bg-[#f7f9f5] rounded-xl border border-[#e2e6dc]">
                <span className="text-[10px] text-[#717a69] uppercase block font-medium">Macro F1</span>
                <strong className="text-[#181a15] font-mono">{metrics.devMetrics.f1Score.macroAvg}%</strong>
              </div>
            </div>
          </div>

          {/* Holdout Set */}
          <div className="bg-white border border-[#e2e6dc] rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-[#e2e6dc] pb-3 mb-3">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#3d5926]">
                  Holdout Set (Untuned Test)
                </span>
                <p className="text-[11px] text-[#717a69]">
                  {metrics.holdoutMetrics.totalSamples} samples strictly held out; zero rule tuning
                </p>
              </div>
              <span className="text-lg font-serif font-bold text-[#3d5926]">
                {metrics.holdoutMetrics.accuracy}% Acc
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-[#f7f9f5] rounded-xl border border-[#e2e6dc]">
                <span className="text-[10px] text-[#717a69] uppercase block font-medium">High Recall</span>
                <strong className="text-rose-700 font-mono">{metrics.holdoutMetrics.recall.high}%</strong>
              </div>
              <div className="p-2.5 bg-[#f7f9f5] rounded-xl border border-[#e2e6dc]">
                <span className="text-[10px] text-[#717a69] uppercase block font-medium">Low Precision</span>
                <strong className="text-[#3d5926] font-mono">{metrics.holdoutMetrics.precision.low}%</strong>
              </div>
              <div className="p-2.5 bg-[#f7f9f5] rounded-xl border border-[#e2e6dc]">
                <span className="text-[10px] text-[#717a69] uppercase block font-medium">Macro F1</span>
                <strong className="text-[#181a15] font-mono">{metrics.holdoutMetrics.f1Score.macroAvg}%</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Misclassified Samples Section */}
      {metrics && metrics.misclassifiedSamples && metrics.misclassifiedSamples.length > 0 && (
        <div className="bg-white border border-[#e2e6dc] rounded-3xl p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between border-b border-[#e2e6dc] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="font-serif text-sm font-bold text-[#181a15] tracking-wide">
                Misclassified Samples Audit ({metrics.misclassifiedSamples.length} instances)
              </h3>
            </div>
            <span className="text-xs text-[#717a69]">
              Examining borderline thresholds and rule gaps
            </span>
          </div>

          <div className="space-y-3">
            {metrics.misclassifiedSamples.map((sample) => (
              <div
                key={sample.id}
                className="p-3.5 bg-[#f7f9f5] border border-[#e2e6dc] rounded-2xl text-xs space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#181a15]">{sample.id}</span>
                    <span className="text-[#636c5c]">({sample.title})</span>
                    <span
                      className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border ${
                        sample.split === "holdout"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-white text-[#636c5c] border-[#e2e6dc]"
                      }`}
                    >
                      {sample.split}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-[#717a69]">Actual:</span>
                    <span
                      className={`font-bold uppercase ${
                        sample.groundTruth === "high"
                          ? "text-rose-700"
                          : sample.groundTruth === "suspicious"
                          ? "text-amber-700"
                          : "text-[#3d5926]"
                      }`}
                    >
                      {sample.groundTruth}
                    </span>
                    <span className="text-[#a5ada0]">→</span>
                    <span className="text-[#717a69]">Predicted:</span>
                    <span
                      className={`font-bold uppercase ${
                        sample.predictedRisk === "high"
                          ? "text-rose-700"
                          : sample.predictedRisk === "suspicious"
                          ? "text-amber-700"
                          : "text-[#3d5926]"
                      }`}
                    >
                      {sample.predictedRisk}
                    </span>
                    <span className="text-[#717a69]">(Score: {sample.riskScore})</span>
                  </div>
                </div>

                <p className="text-[#181a15] font-mono text-[11px] bg-white p-2 rounded-xl border border-[#e2e6dc]">
                  &ldquo;{sample.text}&rdquo;
                </p>

                <div className="text-[11px] text-[#636c5c]">
                  <span className="text-[#717a69]">Rules Fired: </span>
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
          <div className="bg-white border border-[#e2e6dc] rounded-3xl p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-sm font-bold text-[#181a15] tracking-wide">
                3x3 Multi-Class Confusion Matrix
              </h3>
              <span className="text-xs text-[#717a69]">Rows: Actual • Cols: Predicted</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#e2e6dc] text-[#636c5c]">
                    <th className="p-2 text-left font-medium">Actual \ Predicted</th>
                    <th className="p-2 font-medium text-rose-700">Pred High</th>
                    <th className="p-2 font-medium text-amber-700">Pred Suspicious</th>
                    <th className="p-2 font-medium text-[#3d5926]">Pred Low</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e6dc]/60 font-mono text-xs">
                  <tr>
                    <td className="p-3 text-left font-semibold text-rose-700">
                      Actual: High
                    </td>
                    <td className="p-3 bg-[#eef5e6] text-[#3d5926] font-bold border border-[#d5e0cb]">
                      {metrics.confusionMatrix.actualHigh_predHigh} (TP)
                    </td>
                    <td className="p-3 bg-[#f7f9f5] text-[#181a15]">
                      {metrics.confusionMatrix.actualHigh_predSuspicious}
                    </td>
                    <td className="p-3 bg-rose-50 text-rose-700 border border-rose-200">
                      {metrics.confusionMatrix.actualHigh_predLow} (FN)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-left font-semibold text-amber-700">
                      Actual: Suspicious
                    </td>
                    <td className="p-3 bg-[#f7f9f5] text-[#181a15]">
                      {metrics.confusionMatrix.actualSuspicious_predHigh}
                    </td>
                    <td className="p-3 bg-[#eef5e6] text-[#3d5926] font-bold border border-[#d5e0cb]">
                      {metrics.confusionMatrix.actualSuspicious_predSuspicious} (Match)
                    </td>
                    <td className="p-3 bg-[#f7f9f5] text-[#181a15]">
                      {metrics.confusionMatrix.actualSuspicious_predLow}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-left font-semibold text-[#3d5926]">
                      Actual: Low
                    </td>
                    <td className="p-3 bg-rose-50 text-rose-700 border border-rose-200">
                      {metrics.confusionMatrix.actualLow_predHigh} (FP)
                    </td>
                    <td className="p-3 bg-[#f7f9f5] text-[#181a15]">
                      {metrics.confusionMatrix.actualLow_predSuspicious}
                    </td>
                    <td className="p-3 bg-[#eef5e6] text-[#3d5926] font-bold border border-[#d5e0cb]">
                      {metrics.confusionMatrix.actualLow_predLow} (TN)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-[#717a69] mt-4 leading-relaxed">
              Diagonal green cells represent correct matches. Off-diagonal cells indicate false alarms or boundary differences.
            </p>
          </div>

          {/* Category Accuracy Recharts */}
          <div className="bg-white border border-[#e2e6dc] rounded-3xl p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
            <h3 className="font-serif text-sm font-bold text-[#181a15] tracking-wide mb-4">
              Accuracy by Attack Vector & Category (%)
            </h3>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" domain={[0, 100]} stroke="#717a69" fontSize={11} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#181a15"
                    fontSize={11}
                    width={110}
                    tick={{ fill: "#636c5c" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e2e6dc",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "#181a15",
                      boxShadow: "0 4px 20px -2px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
                    {categoryChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.accuracy >= 90 ? "#7db432" : entry.accuracy >= 75 ? "#3b82f6" : "#f59e0b"}
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
      <div className="bg-white border border-[#e2e6dc] rounded-3xl p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e2e6dc] pb-4 mb-4">
          <h3 className="font-serif text-sm font-bold text-[#181a15] tracking-wide">
            Curated Benchmark Sample Explorer ({filteredItems.length} samples)
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {/* Split filter */}
            <select
              value={filterSplit}
              onChange={(e) => setFilterSplit(e.target.value as "all" | "dev" | "holdout")}
              className="bg-[#f7f9f5] border border-[#e2e6dc] rounded-xl px-2.5 py-1 text-xs text-[#181a15] focus:outline-none focus:border-[#8ec251]"
            >
              <option value="all">All Splits</option>
              <option value="dev">Dev Only (40)</option>
              <option value="holdout">Holdout Only (35)</option>
            </select>

            {/* Category filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[#f7f9f5] border border-[#e2e6dc] rounded-xl px-2.5 py-1 text-xs text-[#181a15] focus:outline-none focus:border-[#8ec251]"
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
              className="bg-[#f7f9f5] border border-[#e2e6dc] rounded-xl px-2.5 py-1 text-xs text-[#181a15] focus:outline-none focus:border-[#8ec251]"
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
              className={`p-3.5 rounded-2xl border transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                item.isCorrect
                  ? "bg-[#f7f9f5] border-[#e2e6dc] hover:border-[#8ec251]"
                  : "bg-rose-50/50 border-rose-200"
              }`}
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#181a15]">{item.title}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-white text-[#636c5c] rounded border border-[#e2e6dc]">
                    {item.category.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`text-[9px] uppercase font-mono px-1 rounded ${
                      item.split === "holdout"
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "bg-[#eef5e6] text-[#3d5926] border border-[#d5e0cb]"
                    }`}
                  >
                    {item.split}
                  </span>
                </div>
                <div className="text-[#636c5c] text-[11px] flex items-center gap-2">
                  <span>Triggers identified: {item.triggerCount}</span>
                  <span>•</span>
                  <span>Latency: {item.latencyMs}ms</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-[#717a69] uppercase font-mono">Ground Truth</div>
                  <span
                    className={`font-mono font-bold uppercase text-[11px] ${
                      item.groundTruth === "high"
                        ? "text-rose-700"
                        : item.groundTruth === "suspicious"
                        ? "text-amber-700"
                        : "text-[#3d5926]"
                    }`}
                  >
                    {item.groundTruth}
                  </span>
                </div>

                <div className="text-[#a5ada0] font-bold">→</div>

                <div className="text-left">
                  <div className="text-[10px] text-[#717a69] uppercase font-mono">Predicted</div>
                  <span
                    className={`font-mono font-bold uppercase text-[11px] ${
                      item.predictedRisk === "high"
                        ? "text-rose-700"
                        : item.predictedRisk === "suspicious"
                        ? "text-amber-700"
                        : "text-[#3d5926]"
                    }`}
                  >
                    {item.predictedRisk}
                  </span>
                </div>

                <div className="pl-2 border-l border-[#e2e6dc]">
                  {item.isCorrect ? (
                    <span className="flex items-center gap-1 text-[#3d5926] font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#5c8a27]" />
                      <span>Pass</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-700 font-medium">
                      <XCircle className="w-4 h-4 text-rose-600" />
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

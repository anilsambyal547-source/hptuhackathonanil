"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Play,
  RefreshCw,
  CheckCircle2,
  XCircle,
  BarChart3,
  Clock,
  Layers,
  Award,
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
    // Automatically trigger benchmark on first view
    runBenchmark();
  }, []);

  const metrics = results?.metrics;
  const items = results?.items || [];

  const filteredItems = items.filter((item) => {
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "correct" && item.isCorrect) ||
      (filterStatus === "incorrect" && !item.isCorrect);
    return matchesCategory && matchesStatus;
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
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Dataset Benchmarking & Model Evaluation Lab
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Empirical validation against a curated ground-truth dataset of 40+ smishing, digital arrest, courier extortion, and legitimate transactional communications.
          </p>
        </div>

        <button
          onClick={runBenchmark}
          disabled={isRunning}
          className="px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 shrink-0"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Evaluating Dataset...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Rerun Live Benchmark</span>
            </>
          )}
        </button>
      </div>

      {/* KPI Cards Grid */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Accuracy */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-md backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Overall Accuracy</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {metrics.accuracy}%
            </div>
            <span className="text-[11px] text-slate-500">
              {metrics.correctPredictions} / {metrics.totalSamples} correct
            </span>
          </div>

          {/* High Risk Recall */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-md backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>High-Risk Recall</span>
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-cyan-400">
              {metrics.recall.high}%
            </div>
            <span className="text-[11px] text-slate-500">Scam catch rate</span>
          </div>

          {/* Macro Precision */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-md backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Precision (Avg)</span>
              <BarChart3 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-blue-400">
              {metrics.precision.macroAvg}%
            </div>
            <span className="text-[11px] text-slate-500">False-positive control</span>
          </div>

          {/* Macro F1-Score */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-md backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Macro F1-Score</span>
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-purple-400">
              {metrics.f1Score.macroAvg}%
            </div>
            <span className="text-[11px] text-slate-500">Harmonic mean</span>
          </div>

          {/* Legitimate Recall */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-md backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Ham/Legit Recall</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {metrics.recall.low}%
            </div>
            <span className="text-[11px] text-slate-500">Real message pass-through</span>
          </div>

          {/* Average Latency */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-md backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Avg Latency</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-400">
              {metrics.averageLatencyMs}ms
            </div>
            <span className="text-[11px] text-slate-500">Per sample inference</span>
          </div>
        </div>
      )}

      {/* Visual Charts: Confusion Matrix & Category Breakdown */}
      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Confusion Matrix Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-white tracking-wide mb-4">
              3-Class Confusion Matrix (Ground Truth vs Predicted)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs font-mono">
                <thead>
                  <tr>
                    <th className="p-2 text-left text-slate-500 font-normal">
                      Actual \ Pred
                    </th>
                    <th className="p-2 text-rose-400 font-semibold bg-slate-950/40 rounded-t">
                      Pred: High
                    </th>
                    <th className="p-2 text-amber-400 font-semibold bg-slate-950/40 rounded-t">
                      Pred: Suspicious
                    </th>
                    <th className="p-2 text-emerald-400 font-semibold bg-slate-950/40 rounded-t">
                      Pred: Low
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
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
                      {metrics.confusionMatrix.actualSuspicious_predSuspicious} (TP)
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
              Diagonal green cells represent correct matches. Off-diagonal cells indicate false positives or borderline boundary classifications.
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

      {/* Interactive Sample Inspector */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Curated Benchmark Sample Explorer ({filteredItems.length} samples)
          </h3>

          <div className="flex flex-wrap items-center gap-2">
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


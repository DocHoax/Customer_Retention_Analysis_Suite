import React, { useState } from 'react';
import { Customer, ModelMetrics, LogisticRegressionWeights, DecisionTreeRules } from '../types';
import { Sparkles, Cpu, Award, RefreshCw, BarChart2, ShieldAlert, Binary } from 'lucide-react';

interface ModelTrainerProps {
  customers: Customer[];
  logisticRegression: {
    weights: LogisticRegressionWeights;
    metrics: ModelMetrics;
    predictions: Customer[];
  };
  decisionTree: {
    root: DecisionTreeRules;
    metrics: ModelMetrics;
    predictions: Customer[];
  };
  isLoading: boolean;
  onRetrain: () => void;
}

export default function ModelTrainer({
  customers,
  logisticRegression,
  decisionTree,
  isLoading,
  onRetrain,
}: ModelTrainerProps) {
  const [selectedCustId, setSelectedCustId] = useState<string>(customers[0]?.id || '');

  const activeCustomer = customers.find(c => c.id === selectedCustId) || customers[0];

  // Find individual predictions
  const lrPred = logisticRegression.predictions.find(p => p.id === selectedCustId);
  const dtPred = decisionTree.predictions.find(p => p.id === selectedCustId);

  // Render vertical layout for decision tree
  const renderTreeNode = (node: DecisionTreeRules, level: number = 0): React.ReactNode => {
    if (!node) return null;

    const isLeaf = node.feature === null;

    if (isLeaf) {
      return (
        <div className="bg-slate-50 border border-slate-250 p-3 rounded-lg text-center space-y-1 w-full max-w-sm shrink-0 shadow-sm">
          <p className="text-[10px] uppercase font-mono text-slate-400">Leaf Node (depth {level})</p>
          <p className="text-xs font-semibold text-slate-700">{node.samples} Samples</p>
          <div className="flex justify-center font-mono text-[10px] text-slate-500 gap-2">
            <span>Gini: {node.gini.toFixed(3)}</span>
          </div>
          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold mt-1 shadow-sm ${node.prediction === 1 ? 'bg-red-500/15 text-red-700 border border-red-200' : 'bg-emerald-500/15 text-emerald-700 border border-emerald-250'}`}>
            Predict: {node.prediction === 1 ? 'Churn (1)' : 'Retain (0)'}
          </span>
        </div>
      );
    }

    const featureLabels: Record<string, string> = {
      id: 'ID',
      name: 'Name',
      purchaseFrequency: 'Purchase Frequency',
      spendingBehavior: 'Spending Behavior',
      loginActivity: 'Login Activity',
      complaintsCount: 'Complaints Count',
      tenureMonths: 'Tenure Months',
      hasDiscountApplied: 'Discount Applied',
      churnStatus: 'Churn Status',
    };

    const label = featureLabels[node.feature!] || String(node.feature);

    return (
      <div className="flex flex-col items-center space-y-3 w-full">
        {/* Decision Split Node */}
        <div className="bg-white border-2 border-indigo-100 p-3.5 rounded-xl text-center shadow-md relative w-full max-w-md">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
            Split node
          </div>
          <p className="text-xs font-extrabold text-slate-805 mt-1">{label} &lt; {node.threshold?.toFixed(1)}</p>
          <p className="text-[10px] font-mono text-slate-500 mt-1">
            Gini: {node.gini.toFixed(3)} | N: {node.samples}
          </p>
        </div>

        {/* Tree branches Left (True) & Right (False) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pt-2">
          <div className="flex flex-col items-center space-y-2 border-t border-slate-100 pt-3 relative">
            <span className="absolute -top-2 px-1.5 bg-slate-50 text-[10px] font-mono font-bold text-emerald-600 border border-emerald-100 rounded">TRUE</span>
            {node.left && renderTreeNode(node.left, level + 1)}
          </div>
          <div className="flex flex-col items-center space-y-2 border-t border-slate-100 pt-3 relative">
            <span className="absolute -top-2 px-1.5 bg-slate-50 text-[10px] font-mono font-bold text-rose-600 border border-rose-100 rounded">FALSE</span>
            {node.right && renderTreeNode(node.right, level + 1)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Retrain Controls / Metrics Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <h3 className="font-display font-bold text-slate-800 text-lg flex items-center gap-1.5">
            <Cpu className="w-5 h-5 text-indigo-600" /> Model Performance comparison
          </h3>
          <p className="text-xs text-slate-600">Interact and review mathematical evaluation metrics against both mathematical systems.</p>
        </div>
        <button
          onClick={onRetrain}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-indigo-700 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Recalculate Coefficients
        </button>
      </div>

      {/* Side-by-Side Model Stats & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Model 1: Logistic Regression */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <h4 className="font-display font-bold text-slate-900 text-sm md:text-base">M1: Multivariate Logistic Regression</h4>
            </div>
            <span className="font-mono text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Continuous Sigmoid Classifier</span>
          </div>

          {/* LR Metrics cards */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
              <p className="text-xs text-slate-500 font-medium">Accuracy</p>
              <p className="font-mono text-base font-bold text-blue-600">{(logisticRegression.metrics.accuracy * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
              <p className="text-xs text-slate-500 font-medium font-sans">Precision</p>
              <p className="font-mono text-base font-bold text-blue-600">{(logisticRegression.metrics.precision * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
              <p className="text-xs text-slate-500 font-medium">Recall</p>
              <p className="font-mono text-base font-bold text-blue-600">{(logisticRegression.metrics.recall * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
              <p className="text-xs text-slate-500 font-medium">F1 Score</p>
              <p className="font-mono text-base font-bold text-blue-600">{(logisticRegression.metrics.f1Score * 100).toFixed(0)}%</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Mathematical Activation Formula</p>
              <div className="bg-slate-950 text-emerald-400 p-3 rounded-lg font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
                <span className="text-slate-500">// Sigmoid activation function Z</span>
                <br />
                <span className="text-slate-100">Z</span> = {logisticRegression.weights.intercept.toFixed(4)}
                <br />
                {logisticRegression.weights.weights.purchaseFrequency >= 0 ? ' + ' : ' - '}
                {Math.abs(logisticRegression.weights.weights.purchaseFrequency).toFixed(4)} * <span className="text-blue-400">purchaseFrequency</span>
                <br />
                {logisticRegression.weights.weights.spendingBehavior >= 0 ? ' + ' : ' - '}
                {Math.abs(logisticRegression.weights.weights.spendingBehavior).toFixed(4)} * <span className="text-blue-400">spendingBehavior</span>
                <br />
                {logisticRegression.weights.weights.loginActivity >= 0 ? ' + ' : ' - '}
                {Math.abs(logisticRegression.weights.weights.loginActivity).toFixed(4)} * <span className="text-blue-400">loginActivity</span>
                <br />
                {logisticRegression.weights.weights.complaintsCount >= 0 ? ' + ' : ' - '}
                {Math.abs(logisticRegression.weights.weights.complaintsCount).toFixed(4)} * <span className="text-blue-400">complaintsCount</span>
                <br />
                <span className="text-slate-100">P(Churn)</span> = 1 / (1 + e<sup>-Z</sup>)
              </div>
            </div>

            {/* Confusion Matrix */}
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Calculated Confusion Matrix</p>
              <div className="grid grid-cols-3 gap-1 font-mono text-[10px] text-center">
                <div className="p-2 border border-slate-100 font-semibold bg-slate-50 text-slate-500 flex items-center justify-center">N = {customers.length}</div>
                <div className="p-2 border border-slate-100 font-semibold bg-slate-50 text-slate-400">PREDICT RETAIN (0)</div>
                <div className="p-2 border border-slate-100 font-semibold bg-slate-50 text-slate-400">PREDICT CHURN (1)</div>

                <div className="p-2 border border-slate-100 font-semibold bg-slate-50 text-slate-400 flex items-center justify-center">ACTUAL RETAIN (0)</div>
                <div className="p-3 border border-slate-150 bg-[#f0fdf4] text-emerald-700">
                  <span className="block font-bold text-base">{logisticRegression.metrics.confusionMatrix.trueNegative}</span>
                  True negative
                </div>
                <div className="p-3 border border-slate-150 bg-[#fff1f2] text-rose-700">
                  <span className="block font-bold text-base">{logisticRegression.metrics.confusionMatrix.falsePositive}</span>
                  False positive
                </div>

                <div className="p-2 border border-slate-100 font-semibold bg-slate-50 text-slate-400 flex items-center justify-center">ACTUAL CHURN (1)</div>
                <div className="p-3 border border-slate-150 bg-[#fff5f5] text-amber-700">
                  <span className="block font-bold text-base">{logisticRegression.metrics.confusionMatrix.falseNegative}</span>
                  False negative
                </div>
                <div className="p-3 border border-slate-150 bg-[#fef2f2] text-red-600 font-semibold">
                  <span className="block font-bold text-base">{logisticRegression.metrics.confusionMatrix.truePositive}</span>
                  True positive
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Model 2: Decision Tree */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <h4 className="font-display font-bold text-slate-900 text-sm md:text-base">M2: Binary Decision Tree (ID3 Recursive Split)</h4>
            </div>
            <span className="font-mono text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Discrete Node Recursive Classifier</span>
          </div>

          {/* DT Stats cards */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
              <p className="text-xs text-slate-500 font-medium">Accuracy</p>
              <p className="font-mono text-base font-bold text-indigo-600">{(decisionTree.metrics.accuracy * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
              <p className="text-xs text-slate-500 font-medium">Precision</p>
              <p className="font-mono text-base font-bold text-indigo-600">{(decisionTree.metrics.precision * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
              <p className="text-xs text-slate-500 font-medium">Recall</p>
              <p className="font-mono text-base font-bold text-indigo-600">{(decisionTree.metrics.recall * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
              <p className="text-xs text-slate-500 font-medium">F1 Score</p>
              <p className="font-mono text-base font-bold text-indigo-600">{(decisionTree.metrics.f1Score * 100).toFixed(0)}%</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Gini Splits Tree Architecture</p>
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-lg flex flex-col items-center overflow-x-auto min-h-[160px] justify-center text-xs">
                {renderTreeNode(decisionTree.root, 0)}
              </div>
            </div>

            {/* Confusion Matrix */}
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Calculated Confusion Matrix</p>
              <div className="grid grid-cols-3 gap-1 font-mono text-[10px] text-center">
                <div className="p-2 border border-slate-100 font-semibold bg-slate-50 text-slate-505 flex items-center justify-center">N = {customers.length}</div>
                <div className="p-2 border border-slate-100 font-semibold bg-slate-50 text-slate-400">PREDICT RETAIN (0)</div>
                <div className="p-2 border border-slate-100 font-semibold bg-slate-50 text-slate-400">PREDICT CHURN (1)</div>

                <div className="p-2 border border-slate-100 font-semibold bg-slate-50 text-slate-400 flex items-center justify-center">ACTUAL RETAIN (0)</div>
                <div className="p-3 border border-slate-150 bg-[#f0fdf4] text-emerald-700">
                  <span className="block font-bold text-base">{decisionTree.metrics.confusionMatrix.trueNegative}</span>
                  True negative
                </div>
                <div className="p-3 border border-slate-150 bg-[#fff1f2] text-rose-700">
                  <span className="block font-bold text-base">{decisionTree.metrics.confusionMatrix.falsePositive}</span>
                  False positive
                </div>

                <div className="p-2 border border-slate-100 font-semibold bg-slate-50 text-slate-400 flex items-center justify-center">ACTUAL CHURN (1)</div>
                <div className="p-3 border border-slate-150 bg-[#fff5f5] text-amber-700">
                  <span className="block font-bold text-base">{decisionTree.metrics.confusionMatrix.falseNegative}</span>
                  False negative
                </div>
                <div className="p-3 border border-slate-150 bg-[#fef2f2] text-red-600 font-semibold">
                  <span className="block font-bold text-base">{decisionTree.metrics.confusionMatrix.truePositive}</span>
                  True positive
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Inference testing Contest */}
      {activeCustomer && (
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">Live Computational Contest</span>
              <h4 className="font-display font-bold text-slate-800 mt-1">Single Customer Pathway Inference Testing</h4>
              <p className="text-xs text-slate-500">Select any customer from the cohort and watch both ML classification lines resolve the predictions in real time.</p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 font-medium">Test Subject:</label>
              <select
                value={selectedCustId}
                onChange={(e) => setSelectedCustId(e.target.value)}
                className="border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white cursor-pointer font-semibold text-slate-700"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    [{c.id}] {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Subject features */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Test Subject Specifications</p>
                <p className="text-base font-bold text-slate-800">{activeCustomer.name}</p>
                <p className="text-xs text-slate-400 font-mono">Database key: {activeCustomer.id}</p>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                  <span className="text-slate-500">Monthly purchases:</span>
                  <span className="font-semibold text-slate-800">{activeCustomer.purchaseFrequency}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                  <span className="text-slate-500">Days active:</span>
                  <span className="font-semibold text-slate-800">{activeCustomer.loginActivity} days / 30</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                  <span className="text-slate-500">Investment context:</span>
                  <span className="font-semibold text-slate-800">${activeCustomer.spendingBehavior}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                  <span className="text-slate-500">Support Complaints:</span>
                  <span className="font-semibold text-slate-800">{activeCustomer.complaintsCount} submitted</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subject Class:</span>
                  <span className={`font-semibold ${activeCustomer.churnStatus === 1 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {activeCustomer.churnStatus === 1 ? 'Actual Churned' : 'Actual Active'}
                  </span>
                </div>
              </div>
            </div>

            {/* M1 resolve */}
            <div className="border border-slate-150 p-4 rounded-xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">M1</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">Logistic Response</p>
                  <p className="text-[10px] text-slate-400 font-mono">Probability vector evaluation</p>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50/50 p-3 rounded border border-slate-100">
                <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                  Regression math applied:
                  <br />
                  <span className="text-slate-705">
                    z = {logisticRegression.weights.intercept.toFixed(2)}
                    {logisticRegression.weights.weights.purchaseFrequency >= 0 ? ' + ' : ' - '}
                    {Math.abs(logisticRegression.weights.weights.purchaseFrequency * activeCustomer.purchaseFrequency).toFixed(2)}
                    {logisticRegression.weights.weights.spendingBehavior >= 0 ? ' + ' : ' - '}
                    {Math.abs(logisticRegression.weights.weights.spendingBehavior * activeCustomer.spendingBehavior).toFixed(2)}
                    {logisticRegression.weights.weights.loginActivity >= 0 ? ' + ' : ' - '}
                    {Math.abs(logisticRegression.weights.weights.loginActivity * activeCustomer.loginActivity).toFixed(2)}
                    {logisticRegression.weights.weights.complaintsCount >= 0 ? ' + ' : ' - '}
                    {Math.abs(logisticRegression.weights.weights.complaintsCount * activeCustomer.complaintsCount).toFixed(2)}
                  </span>
                </p>

                <div className="flex items-center justify-between border-t border-slate-200 pt-2.5">
                  <span className="text-xs text-slate-500">Calculated P(Churn):</span>
                  <span className="font-mono text-xs font-bold text-blue-600">
                    {lrPred?.predictedProbability !== undefined ? `${(lrPred.predictedProbability * 100).toFixed(1)}%` : '0%'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Prediction Decision:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${lrPred?.predictedChurn === 1 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {lrPred?.predictedChurn === 1 ? 'Churn (1)' : 'Retained (0)'}
                  </span>
                </div>
              </div>
            </div>

            {/* M2 resolve */}
            <div className="border border-slate-150 p-4 rounded-xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-505 flex items-center justify-center text-indigo-700 bg-indigo-50 text-[10px] font-bold">M2</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">Decision Tree Pathway</p>
                  <p className="text-[10px] text-slate-400 font-mono">Gini criteria routing</p>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50/50 p-3 rounded border border-slate-100">
                <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                  Rule evaluation:
                  <br />
                  <span className="text-slate-700">
                    - Root split: loginActivity &lt; {decisionTree.root.threshold?.toFixed(1)}
                    <br />
                    - Traversed branch: <span className="font-bold text-slate-800">{activeCustomer.loginActivity < (decisionTree.root.threshold ?? 0) ? 'TRUE' : 'FALSE'}</span>
                  </span>
                </p>

                <div className="flex items-center justify-between border-t border-slate-200 pt-2.5">
                  <span className="text-xs text-slate-500">Calculated Probability:</span>
                  <span className="font-mono text-xs font-bold text-indigo-600">
                    {dtPred?.predictedProbability !== undefined ? `${(dtPred.predictedProbability * 100).toFixed(0)}%` : '0%'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Prediction Decision:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${dtPred?.predictedChurn === 1 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {dtPred?.predictedChurn === 1 ? 'Churn (1)' : 'Retained (0)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Customer, ModelMetrics, LogisticRegressionWeights, DecisionTreeRules } from './types';
import ProposalOverview from './components/ProposalOverview.tsx';
import DataSimulator from './components/DataSimulator.tsx';
import ExploratoryCharts from './components/ExploratoryCharts.tsx';
import ModelTrainer from './components/ModelTrainer.tsx';
import AIConsultant from './components/AIConsultant.tsx';
import { Network, Database, LineChart, Cpu, Sparkles, BookOpen, GraduationCap, FlameKindling, Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'proposal' | 'simulator' | 'eda' | 'trainer' | 'ai'>('proposal');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelsLoading, setIsModelsLoading] = useState(false);

  // Model Results state
  const [logisticRegression, setLogisticRegression] = useState<{
    weights: LogisticRegressionWeights;
    metrics: ModelMetrics;
    predictions: Customer[];
  } | null>(null);

  const [decisionTree, setDecisionTree] = useState<{
    root: DecisionTreeRules;
    metrics: ModelMetrics;
    predictions: Customer[];
  } | null>(null);

  const [correlationMatrix, setCorrelationMatrix] = useState<{ x: string; y: string; val: number }[]>([]);
  const [reportText, setReportText] = useState('');

  // 1. Ingest initial customers list
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (e) {
      console.error('Failed to fetch initial customer records', e);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Trigger server-side computational ML model evaluations
  const runModelCalculations = async () => {
    setIsModelsLoading(true);
    try {
      const response = await fetch('/api/analyze-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setLogisticRegression(data.logisticRegression);
        setDecisionTree(data.decisionTree);
        setCorrelationMatrix(data.correlationMatrix);
      }
    } catch (e) {
      console.error('Failed to run backend models calculations', e);
    } finally {
      setIsModelsLoading(false);
    }
  };

  // Triggered on first boot
  useEffect(() => {
    const initData = async () => {
      await fetchCustomers();
      await runModelCalculations();
    };
    initData();
  }, []);

  // 3. Simulated parameters callback
  const handleSimulateDataset = async (params: {
    count: number;
    complaintUrgency: number;
    retentionDiscountRatio: number;
    avgTenure: number;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/customers/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      if (data.success) {
        setCustomers(data.customers);
        // Automatically re-compute models against newly simulated variables instantly
        await runModelCalculations();
      }
    } catch (e) {
      console.error('Dynamic simulation failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Connect with server-side Gemini Consultant API
  const handleGenerateAIReport = async (systemPersona: string): Promise<string> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gemini/consultant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ systemPersona }),
      });
      const data = await response.json();
      if (data.success) {
        setReportText(data.report);
        return data.report;
      } else {
        throw new Error(data.error || 'Gemini response returned failure status.');
      }
    } catch (e: any) {
      console.error('Gemini call failed', e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#ededed] flex flex-col font-sans select-none overflow-x-hidden">
      
      {/* Universal Institutional Header */}
      <header className="bg-[#0a0a0b]/80 border-b border-[#262626] py-3 sm:py-4 px-4 sm:px-6 sticky top-0 z-30 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          
          {/* Logo & Lab branding */}
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md relative overflow-hidden">
              <GraduationCap className="w-5.5 h-5.5 relative z-10" />
              <div className="absolute right-0 bottom-0 w-6 h-6 bg-white/10 rounded-full blur-sm" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest bg-blue-950 text-blue-400 border border-blue-900 font-bold px-1.5 py-0.5 rounded font-mono">
                  LASUSTECH CS LAB
                </span>
                <span className="text-[10px] text-[#a1a1a1] font-mono">r-220303010074</span>
              </div>
              <h2 className="font-display font-bold text-white tracking-tight text-sm md:text-base break-words">
                BSc Customer Retention Analytics Suite
              </h2>
            </div>
          </div>

          {/* Quick Stats overview badge bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono w-full lg:w-auto justify-start lg:justify-end">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#161618] border border-[#262626] rounded-lg">
              <Database className="w-3.5 h-3.5 text-[#a1a1a1]" />
              <span className="text-[#a1a1a1]">Dataset Size:</span>
              <span className="font-bold text-white">{customers.length} profiles</span>
            </div>

            {isModelsLoading || isLoading ? (
              <span className="inline-flex items-center gap-1 bg-amber-950/45 text-amber-400 font-semibold px-2.5 py-1.5 border border-amber-800/40 rounded-lg text-[11px] uppercase tracking-wider animate-pulse">
                <FlameKindling className="w-3.5 h-3.5 animate-bounce" /> Processing calculations...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-emerald-950/45 text-emerald-400 font-semibold px-2.5 py-1.5 border border-emerald-800/40 rounded-lg text-[11px] uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1" /> Models Optimized
              </span>
            )}
          </div>

        </div>
      </header>

      {/* Primary Navigation Tabs row */}
      <section className="bg-[#161618] text-[#a1a1a1] border-b border-[#262626] py-1 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto flex overflow-x-auto gap-1 scrollbar-none whitespace-nowrap">
          <button
            onClick={() => setActiveTab('proposal')}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 text-[11px] sm:text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${activeTab === 'proposal' ? 'text-white border-blue-500 bg-white/5 font-semibold' : 'border-transparent hover:text-slate-200 hover:bg-white/5'}`}
          >
            <BookOpen className="w-4 h-4" />
            1. Thesis Overview
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 text-[11px] sm:text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${activeTab === 'simulator' ? 'text-white border-blue-500 bg-white/5 font-semibold' : 'border-transparent hover:text-slate-200 hover:bg-white/5'}`}
          >
            <Database className="w-4 h-4" />
            2. Customer Simulator
          </button>
          <button
            onClick={() => setActiveTab('eda')}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 text-[11px] sm:text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${activeTab === 'eda' ? 'text-white border-blue-500 bg-white/5 font-semibold' : 'border-transparent hover:text-slate-200 hover:bg-white/5'}`}
          >
            <LineChart className="w-4 h-4" />
            3. Behavior EDA Charts
          </button>
          <button
            onClick={() => setActiveTab('trainer')}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 text-[11px] sm:text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${activeTab === 'trainer' ? 'text-white border-blue-500 bg-white/5 font-semibold' : 'border-transparent hover:text-slate-200 hover:bg-white/5'}`}
          >
            <Cpu className="w-4 h-4" />
            4. ML Trainer & Contour
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 text-[11px] sm:text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${activeTab === 'ai' ? 'text-white border-blue-500 bg-white/5 font-semibold' : 'border-transparent hover:text-slate-200 hover:bg-white/5'}`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            5. AI Advisory Report
          </button>
        </div>
      </section>

      {/* Main active Tab Canvas area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-5 md:px-6 py-6 sm:py-8">
        {isLoading && !customers.length && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-[#262626] border-t-blue-500 rounded-full animate-spin" />
            <p className="text-sm font-mono text-[#a1a1a1]">Synchronizing relational customer vectors from server...</p>
          </div>
        )}

        {/* Tab 1: Proposal Metadata Context */}
        {activeTab === 'proposal' && <ProposalOverview />}

        {/* Tab 2: Simulation controls */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <div className="bg-blue-950/15 border border-blue-500/20 p-4 rounded-xl flex gap-3 text-xs leading-relaxed text-blue-200">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
              <div>
                <span className="font-semibold block mb-0.5 text-blue-300">Objective I Implementation:</span>
                This panel enables the collection and simulated preprocessing of datasets. Move the range controls to customize the operational cohort variables and trigger the real-time ingestion parser.
              </div>
            </div>
            <DataSimulator 
              customers={customers} 
              onSimulate={handleSimulateDataset} 
              isLoading={isLoading} 
            />
          </div>
        )}

        {/* Tab 3: Exploratory charts (EDA) */}
        {activeTab === 'eda' && (
          <div className="space-y-6">
            <div className="bg-indigo-950/15 border border-indigo-500/20 p-4 rounded-xl flex gap-3 text-xs leading-relaxed text-[#ededed]">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
              <div>
                <span className="font-semibold block mb-0.5 text-indigo-300">Objective II & V Implementation:</span>
                This panel maps the linear correlations and Pearson coefficients of independent variables (purchase frequency, complaints, spend, login activity) against the actual churn output.
              </div>
            </div>
            <ExploratoryCharts 
              customers={customers} 
              correlationMatrix={correlationMatrix} 
            />
          </div>
        )}

        {/* Tab 4: Logistic Regression and Tree models */}
        {activeTab === 'trainer' && (
          <div className="space-y-6">
            <div className="bg-purple-950/15 border border-purple-500/20 p-4 rounded-xl flex gap-3 text-xs leading-relaxed text-purple-200">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-purple-400" />
              <div>
                <span className="font-semibold block mb-0.5 text-purple-300">Objective III & IV Implementation:</span>
                This computational workspace trains a multivariate Logistic Regression and a depth-3 Decision Tree classification models. You can test inference pathways of individual customer index slots.
              </div>
            </div>
            {logisticRegression && decisionTree ? (
              <ModelTrainer
                customers={customers}
                logisticRegression={logisticRegression}
                decisionTree={decisionTree}
                isLoading={isModelsLoading}
                onRetrain={runModelCalculations}
              />
            ) : (
              <div className="text-center py-24 text-[#a1a1a1] font-mono italic text-xs">Waiting for model calculations to complete...</div>
            )}
          </div>
        )}

        {/* Tab 5: AI Consultant */}
        {activeTab === 'ai' && (
          <AIConsultant 
            onGenerateReport={handleGenerateAIReport}
            reportText={reportText}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Academic Footer */}
      <footer className="bg-[#161618] border-t border-[#262626] py-6 px-4 sm:px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs font-mono text-[#a1a1a1]">
          <div>
            <p className="font-sans font-semibold text-[#ededed]">Lagos State University of Science and Technology (LASUSTECH)</p>
            <p>Department of Computer Science — BSc Project Proposal Interface © 2026</p>
          </div>
          <div>
            <p>Candidate: Adeyemo Idris Ayinde (220303010074)</p>
            <p>Supervisor: Dr. Ebole A.F</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

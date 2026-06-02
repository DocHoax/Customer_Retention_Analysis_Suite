import React, { useState } from 'react';
import { RefreshCw, Play, Filter, AlertTriangle, CheckCircle, Search, Sliders } from 'lucide-react';
import { Customer } from '../types';

interface DataSimulatorProps {
  customers: Customer[];
  onSimulate: (params: {
    count: number;
    complaintUrgency: number;
    retentionDiscountRatio: number;
    avgTenure: number;
  }) => Promise<void>;
  isLoading: boolean;
}

export default function DataSimulator({ customers, onSimulate, isLoading }: DataSimulatorProps) {
  const [count, setCount] = useState<number>(45);
  const [urgency, setUrgency] = useState<number>(1.2);
  const [discountRatio, setDiscountRatio] = useState<number>(0.4);
  const [tenure, setTenure] = useState<number>(14);

  const [searchTerm, setSearchTerm] = useState('');
  const [churnFilter, setChurnFilter] = useState<'all' | 'retained' | 'churned'>('all');

  const handleSimulateSubmit = () => {
    onSimulate({
      count,
      complaintUrgency: urgency,
      retentionDiscountRatio: discountRatio,
      avgTenure: tenure,
    });
  };

  // Filter & Search logic
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      churnFilter === 'all' || 
      (churnFilter === 'retained' && c.churnStatus === 0) || 
      (churnFilter === 'churned' && c.churnStatus === 1);
    return matchesSearch && matchesFilter;
  });

  const totalChurned = customers.filter(c => c.churnStatus === 1).length;
  const churnPercentage = customers.length > 0 ? ((totalChurned / customers.length) * 100).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      {/* Simulation Controller (4 columns in large screen) */}
      <div className="lg:col-span-4 bg-[#161618] rounded-xl p-6 border border-[#262626] space-y-6">
        <div className="flex items-center gap-2 border-b border-[#262626] pb-3">
          <Sliders className="w-5 h-5 text-blue-500" />
          <h3 className="font-display text-lg font-bold text-white">Simulation Variables</h3>
        </div>

        <p className="text-xs text-[#a1a1a1] leading-relaxed">
          The thesis assumes customer datasets are either real or simulated. Modify the coefficients below to inject realistic behavioral patterns and analyze machine learning outcomes.
        </p>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#ededed]">Sample Population Size</label>
              <span className="font-mono text-blue-400 font-bold bg-blue-950/40 border border-blue-900/30 px-1.5 py-0.5 rounded text-[11px]">{count} profiles</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="150" 
              value={count} 
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full h-1.5 bg-[#0a0a0b] rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-[#a1a1a1] font-mono">
              <span>20</span>
              <span>150 max</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#ededed]">Complaint Churn Severity</label>
              <span className="font-mono text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-900/30 px-1.5 py-0.5 rounded text-[11px]">{urgency.toFixed(1)}x</span>
            </div>
            <input 
              type="range" 
              min="0.2" 
              max="3.0" 
              step="0.1"
              value={urgency} 
              onChange={(e) => setUrgency(Number(e.target.value))}
              className="w-full h-1.5 bg-[#0a0a0b] rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-[#a1a1a1] font-mono">
              <span>0.2 (low influence)</span>
              <span>3.0 (hostile impact)</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#ededed]">Retention Reward coverage</label>
              <span className="font-mono text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-900/30 px-1.5 py-0.5 rounded text-[11px]">{Math.floor(discountRatio * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1.0" 
              step="0.1"
              value={discountRatio} 
              onChange={(e) => setDiscountRatio(Number(e.target.value))}
              className="w-full h-1.5 bg-[#0a0a0b] rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-[#a1a1a1] font-mono">
              <span>0% (no discount)</span>
              <span>100% total coverage</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#ededed]">Average Tenure Expected</label>
              <span className="font-mono text-purple-400 font-bold bg-purple-950/40 border border-purple-900/30 px-1.5 py-0.5 rounded text-[11px]">{tenure} months</span>
            </div>
            <input 
              type="range" 
              min="2" 
              max="36" 
              value={tenure} 
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full h-1.5 bg-[#0a0a0b] rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-[#a1a1a1] font-mono">
              <span>2 months</span>
              <span>36 months</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSimulateSubmit}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Simulating...' : 'Run New Model Simulation'}
        </button>

        <div className="pt-4 border-t border-[#262626] bg-[#0a0a0b] p-3 rounded-lg flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#161618] border border-[#262626] flex items-center justify-center text-white font-mono text-xs shrink-0 font-bold">
            {customers.length}
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#a1a1a1] font-mono">Current Cohort</p>
            <p className="text-xs font-semibold text-white">
              Active density: <span className="text-rose-400 font-bold">{churnPercentage}%</span> churn risk
            </p>
          </div>
        </div>
      </div>

      {/* Database Explorer Grid (8 columns) */}
      <div className="lg:col-span-8 bg-[#161618] rounded-xl border border-[#262626] flex flex-col overflow-hidden">
        {/* Top filter bar */}
        <div className="p-4 bg-[#0a0a0b] border-b border-[#262626] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-white text-base">Preprocessing Data Ingestion Log</h3>
            <span className="text-xs text-[#a1a1a1] font-mono">({filteredCustomers.length} visible)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-[#a1a1a1] absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search by name/id..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-[#262626] rounded-lg text-xs w-44 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-[#0a0a0b] text-[#ededed]"
              />
            </div>

            <select
              value={churnFilter}
              onChange={(e) => setChurnFilter(e.target.value as any)}
              className="border border-[#262626] rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-[#0a0a0b] text-[#ededed] cursor-pointer"
            >
              <option value="all">All statuses</option>
              <option value="retained">Retained (0)</option>
              <option value="churned">Churned (1)</option>
            </select>
          </div>
        </div>

        {/* Database table view */}
        <div className="flex-1 overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0a0a0b] text-[#a1a1a1] uppercase tracking-wider font-mono text-[10px] border-b border-[#262626]">
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4 text-center">Pur. Freq</th>
                <th className="py-3 px-4 text-center">Spend ($)</th>
                <th className="py-3 px-4 text-center">Logins (30d)</th>
                <th className="py-3 px-4 text-center">Complaints</th>
                <th className="py-3 px-4 text-center">Tenure (mo)</th>
                <th className="py-3 px-4 text-center">Offer</th>
                <th className="py-3 px-4 text-center">Target Class</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-[#a1a1a1] italic">No matching records. Adjust search query or filters.</td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#0a0a0b]/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#a1a1a1]">{c.id}</td>
                    <td className="py-3 px-4 font-semibold text-white">{c.name}</td>
                    <td className="py-3 px-4 text-center font-mono">{c.purchaseFrequency}</td>
                    <td className="py-3 px-4 text-center font-mono font-semibold text-[#ededed]">${c.spendingBehavior}</td>
                    <td className="py-3 px-4 text-center font-mono">{c.loginActivity}d</td>
                    <td className="py-3 px-4 text-center font-mono">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${c.complaintsCount > 2 ? 'bg-red-950/40 text-red-400 border border-red-900/40' : c.complaintsCount > 0 ? 'bg-amber-950/40 text-amber-400 border border-amber-900/40' : 'text-[#a1a1a1]'}`}>
                        {c.complaintsCount}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{c.tenureMonths}m</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${c.hasDiscountApplied ? 'bg-emerald-500' : 'bg-[#262626]'}`} title={c.hasDiscountApplied ? "Discount Applied" : "Standard Price"} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      {c.churnStatus === 1 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950/40 text-rose-400 border border-rose-900/30 font-mono">
                          <AlertTriangle className="w-2.5 h-2.5" /> Churned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 font-mono">
                          <CheckCircle className="w-2.5 h-2.5" /> Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

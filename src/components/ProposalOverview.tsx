import React from 'react';
import { BookOpen, Award, User, Clock, CheckCircle, HelpCircle } from 'lucide-react';

export default function ProposalOverview() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Card */}
      <div className="bg-radial from-slate-900 to-slate-950 text-white rounded-2xl p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest font-mono">
              B.Sc. Computer Science Proposal
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Award className="w-5 h-5 text-amber-500" />
              <p className="font-mono text-xs text-slate-400 font-bold uppercase tracking-wider">
                Lagos State University of Science and Technology (LASUSTECH)
              </p>
            </div>
          </div>
          <span className="font-mono text-xs text-slate-500">Session: 2025/2026</span>
        </div>

        <div className="my-8 space-y-3">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-blue-200 leading-tight">
            LEVERAGING DATA ANALYSIS TO IMPROVE CUSTOMER RETENTION AND PRODUCT DECISIONS
          </h1>
          <p className="text-slate-400 max-w-3xl text-sm md:text-base leading-relaxed">
            Applying quantitative research, exploratory data analysis (EDA), and machine learning (Logistic Regression and Decision Trees) to construct a predictive framework for proactive churn prevention.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center border border-slate-700">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Researcher</p>
              <p className="text-sm font-semibold text-slate-200">Adeyemo Idris Ayinde</p>
              <p className="text-[11px] font-mono text-slate-400">ID: 220303010074</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center border border-slate-700">
              <BookOpen className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Supervisor</p>
              <p className="text-sm font-semibold text-slate-200">Dr. Ebole A.F</p>
              <p className="text-[11px] text-slate-400">Department of Computer Science</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center border border-slate-700">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Framework Scope</p>
              <p className="text-sm font-semibold text-slate-200">Analytical Demonstration</p>
              <p className="text-[11px] text-slate-400">Interpretable Local AI Models</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Overview & Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161618] rounded-xl p-6 border border-[#262626] space-y-4">
          <div className="w-12 h-12 rounded-xl bg-orange-950/35 flex items-center justify-center text-orange-400 border border-orange-900/30">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-white">The Problem Statement</h3>
          <p className="text-xs text-[#a1a1a1] leading-relaxed">
            High customer churn persists despite data availability due to a critical gap: organizations fail to translate raw interaction logs into actionable decisions. Many rely on intuition or reactive, delayed intervention strategies applied only <em>after</em> a subscriber has already disengaged.
          </p>
        </div>

        <div className="bg-[#161618] rounded-xl p-6 border border-[#262626] space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-950/35 flex items-center justify-center text-blue-400 border border-blue-900/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-white">Core Objectives</h3>
          <ul className="text-xs text-[#a1a1a1] space-y-2">
            <li className="flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span>Simulate and ingest behavioral datasets based on customer parameters.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span>Perform Exploratory Data Analysis & correlation analysis of customer attributes.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span>Train and compare Logistic Regression and Decision Tree models interactively.</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#161618] rounded-xl p-6 border border-[#262626] space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/35 flex items-center justify-center text-emerald-400 border border-emerald-900/30">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-white">Variables Considered</h3>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#ededed]">
            <div className="bg-[#0a0a0b] p-2 rounded border border-[#262626]">
              <p className="font-semibold text-white">Purchase Frequency</p>
              <p className="text-[10px] text-[#a1a1a1]">Orders in last month</p>
            </div>
            <div className="bg-[#0a0a0b] p-2 rounded border border-[#262626]">
              <p className="font-semibold text-white">Login Activity</p>
              <p className="text-[10px] text-[#a1a1a1]">Days active out of 30</p>
            </div>
            <div className="bg-[#0a0a0b] p-2 rounded border border-[#262626]">
              <p className="font-semibold text-white">Complaints Count</p>
              <p className="text-[10px] text-[#a1a1a1]">Support tickets submitted</p>
            </div>
            <div className="bg-[#0a0a0b] p-2 rounded border border-[#262626]">
              <p className="font-semibold text-white">Spending Behavior</p>
              <p className="text-[10px] text-[#a1a1a1]">Monthly spend value ($)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

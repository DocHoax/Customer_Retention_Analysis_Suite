import React, { useState } from 'react';
import { Sparkles, Brain, Award, FileText, CheckCircle2, UserCheck, RefreshCw, Send, Lock } from 'lucide-react';

interface AIConsultantProps {
  onGenerateReport: (persona: string) => Promise<string>;
  reportText: string;
  isLoading: boolean;
}

const CONSULTANT_PERSONAS = [
  {
    id: 'saas-expert',
    name: 'SaaS Product & Retention Strategist',
    icon: Brain,
    description: 'Focuses on actionable user interface improvements, product feedback loops, and customer lifetime value.',
    instruction: 'You are an elite, space-grotesk scientific analytics and SaaS product optimization consultant.',
  },
  {
    id: 'academic-reviewer',
    name: 'B.Sc. Dissertation Defense Reviewer',
    icon: Award,
    description: 'Provides a rigorous evaluation of the predictive coefficients and evaluates the theoretical consistency of the models.',
    instruction: 'You are a Senior Academic Reviewer for B.Sc. Computer Science Dissertations at LASUSTECH, focusing strictly on model interpretation and mathematical proof validation.',
  },
  {
    id: 'support-advisor',
    name: 'Customer Support Experience Specialist',
    icon: UserCheck,
    description: 'Focuses on minimizing customer complaints, ticket handling, and optimizing account health indicators.',
    instruction: 'You are a veteran Customer Success and Onboarding Director specializing in SLA remediation and ticket resolution.',
  },
];

export default function AIConsultant({ onGenerateReport, reportText, isLoading }: AIConsultantProps) {
  const [selectedPersonaId, setSelectedPersonaId] = useState('saas-expert');
  const [errorMessage, setErrorMessage] = useState('');

  const activePersona = CONSULTANT_PERSONAS.find(p => p.id === selectedPersonaId) || CONSULTANT_PERSONAS[0];

  const handleGenerateClick = async () => {
    try {
      setErrorMessage('');
      await onGenerateReport(activePersona.instruction);
    } catch (err: any) {
      setErrorMessage(err.message || 'Connecting to Gemini failed. Please set up GEMINI_API_KEY.');
    }
  };

  // Safe manual markdown-to-JSX renderer to ensure pristine presentation without breaking
  const renderFormattedReport = (text: string) => {
    if (!text) {
      return (
        <div className="text-center py-12 text-slate-400 italic font-mono text-xs">
          Press "Generate Analytical Dissertation Insights" below to query the Gemini-3.5-flash consultant against the active cohort metrics.
        </div>
      );
    }

    const lines = text.split('\n');
    return (
      <div className="space-y-4 font-sans text-slate-700 leading-relaxed text-sm">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          
          if (!trimmed) return <div key={idx} className="h-2" />;

          // Headers (### or ##)
          if (trimmed.startsWith('###')) {
            return (
              <h5 key={idx} className="font-display font-bold text-slate-800 text-sm mt-4 uppercase tracking-wider border-l-2 border-indigo-500 pl-2">
                {trimmed.replace(/^###\s*/, '')}
              </h5>
            );
          }
          if (trimmed.startsWith('##') || trimmed.startsWith('#')) {
            return (
              <h4 key={idx} className="font-display font-extrabold text-slate-900 text-base mt-6 border-b border-slate-100 pb-1 flex items-center gap-1.5">
                <FileText className="w-4.5 h-4.5 text-indigo-600" />
                {trimmed.replace(/^##?\s*/, '')}
              </h4>
            );
          }

          // Bullet points
          if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
            const content = trimmed.replace(/^[\*\-]\s*/, '');
            // Simple bold parser
            const parts = content.split('**');
            return (
              <li key={idx} className="list-none pl-6 relative text-slate-600 mt-1.5 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-505 border border-indigo-400 shrink-0 mt-2" />
                <span>
                  {parts.map((part, pIdx) => (
                    pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-slate-800">{part}</strong> : part
                  ))}
                </span>
              </li>
            );
          }

          // Bold parsing for normal paragraph
          const parts = trimmed.split('**');
          if (parts.length > 1) {
            return (
              <p key={idx}>
                {parts.map((part, pIdx) => (
                  pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-slate-800">{part}</strong> : part
                ))}
              </p>
            );
          }

          return <p key={idx}>{trimmed}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      {/* Persona Selection Panel (5 columns) */}
      <div className="lg:col-span-4 bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between">
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-display text-lg font-bold text-slate-900 font-display">Gemini Consultant</h3>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Query the server-side Gemini 3.5 model. The model automatically ingests your active cohort size, correlation outputs, and regression coefficients to construct customized advice.
          </p>

          <div className="space-y-3">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Select Active Advisory System</p>
            {CONSULTANT_PERSONAS.map(p => {
              const IconComp = p.icon;
              const isSelected = p.id === selectedPersonaId;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPersonaId(p.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex gap-3 text-xs cursor-pointer ${isSelected ? 'bg-indigo-50/75 border-indigo-200 shadow-sm' : 'bg-white border-slate-150 hover:bg-slate-50'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <p className={`font-semibold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>{p.name}</p>
                    <p className="text-[10px] text-slate-500 leading-tight">{p.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-100">
          <button
            onClick={handleGenerateClick}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {isLoading ? 'Synthesizing...' : 'Generate Dissertation Report'}
          </button>

          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-md text-[11px] font-mono leading-relaxed">
              <span className="font-bold uppercase tracking-wider block mb-0.5">Configuration Note:</span>
              {errorMessage}
            </div>
          )}
        </div>
      </div>

      {/* Report Showcase Panel (8 columns) */}
      <div className="lg:col-span-8 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col overflow-hidden min-h-[450px]">
        {/* Header indicator */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-ping" />
            <h4 className="font-display font-extrabold text-slate-900 text-sm">Consultation Output Matrix</h4>
          </div>
          <span className="font-mono text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            {activePersona.name} activated
          </span>
        </div>

        {/* Content canvas */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[600px] bg-slate-50/20">
          {renderFormattedReport(reportText)}
        </div>
      </div>
    </div>
  );
}

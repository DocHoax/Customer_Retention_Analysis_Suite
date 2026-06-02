import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, ScatterChart, Scatter, Cell, Label } from 'recharts';
import { Customer } from '../types';

interface ExploratoryChartsProps {
  customers: Customer[];
  correlationMatrix: { x: string; y: string; val: number }[];
}

export default function ExploratoryCharts({ customers, correlationMatrix }: ExploratoryChartsProps) {
  // 1. Prepare scatter plot data: Spending vs Logins
  const scatterData = customers.map(c => ({
    name: c.name,
    logins: c.loginActivity,
    spending: c.spendingBehavior,
    churn: c.churnStatus,
    id: c.id,
  }));

  // 2. Prepare bar chart data: Churn percentage vs Complaint Count
  const maxComplaints = Math.max(...customers.map(c => c.complaintsCount), 0);
  const complaintGroups: Record<number, { total: number; churned: number }> = {};
  for (let i = 0; i <= Math.min(maxComplaints, 6); i++) {
    complaintGroups[i] = { total: 0, churned: 0 };
  }

  customers.forEach(c => {
    const key = Math.min(c.complaintsCount, 6);
    if (complaintGroups[key] === undefined) {
      complaintGroups[key] = { total: 0, churned: 0 };
    }
    complaintGroups[key].total++;
    if (c.churnStatus === 1) {
      complaintGroups[key].churned++;
    }
  });

  const complaintDistributionData = Object.entries(complaintGroups).map(([count, stats]) => {
    const rate = stats.total > 0 ? Number(((stats.churned / stats.total) * 100).toFixed(0)) : 0;
    return {
      complaints: `${count} ticket${Number(count) === 1 ? '' : 's'}`,
      'Churn Rate (%)': rate,
      'Total Customers': stats.total,
    };
  }).filter(item => item['Total Customers'] > 0);

  // 3. Prepare login activity histogram or area chart
  const loginActivityCohort: Record<string, { Retained: number; Churned: number }> = {
    '0-5 days': { Retained: 0, Churned: 0 },
    '6-12 days': { Retained: 0, Churned: 0 },
    '13-20 days': { Retained: 0, Churned: 0 },
    '21-30 days': { Retained: 0, Churned: 0 },
  };

  customers.forEach(c => {
    if (c.loginActivity <= 5) {
      if (c.churnStatus === 1) loginActivityCohort['0-5 days'].Churned++;
      else loginActivityCohort['0-5 days'].Retained++;
    } else if (c.loginActivity <= 12) {
      if (c.churnStatus === 1) loginActivityCohort['6-12 days'].Churned++;
      else loginActivityCohort['6-12 days'].Retained++;
    } else if (c.loginActivity <= 20) {
      if (c.churnStatus === 1) loginActivityCohort['13-20 days'].Churned++;
      else loginActivityCohort['13-20 days'].Retained++;
    } else {
      if (c.churnStatus === 1) loginActivityCohort['21-30 days'].Churned++;
      else loginActivityCohort['21-30 days'].Retained++;
    }
  });

  const loginCohortData = Object.entries(loginActivityCohort).map(([range, stats]) => ({
    range,
    Retained: stats.Retained,
    Churned: stats.Churned,
  }));

  // Unique labels on heat map
  const uniqueX = Array.from(new Set(correlationMatrix.map(m => m.x)));
  const uniqueY = Array.from(new Set(correlationMatrix.map(m => m.y)));

  // Color mapper for correlation values [-1, 1]
  const getHeatColor = (val: number) => {
    if (val > 0.4) return 'bg-rose-500 text-white';
    if (val > 0.1) return 'bg-rose-200 text-slate-800';
    if (val > -0.1) return 'bg-slate-50 text-slate-400';
    if (val > -0.4) return 'bg-blue-200 text-slate-800';
    return 'bg-blue-500 text-white';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Scatter Chart: Spending vs Login Activity */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">
              Exploratory Cluster Analysis
            </span>
            <h3 className="font-display font-bold text-slate-800 mt-1">Spending vs Login Engagement</h3>
            <p className="text-xs text-slate-500">Visualize customers plotted by 30-day logins and total spend. Notice key segments form.</p>
          </div>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  type="number" 
                  dataKey="logins" 
                  name="Logins" 
                  unit="d" 
                  stroke="#64748b" 
                  fontSize={10}
                >
                  <Label value="Monthly Login Activity (Days)" offset={-10} position="insideBottom" style={{ fontSize: '10px', fill: '#64748b' }} />
                </XAxis>
                <YAxis 
                  type="number" 
                  dataKey="spending" 
                  name="Spending" 
                  unit="$" 
                  stroke="#64748b" 
                  fontSize={10}
                >
                  <Label value="Amount Invested ($)" angle={-90} position="insideLeft" style={{ fontSize: '10px', fill: '#64748b' }} />
                </YAxis>
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const statusIdx = data.churn;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-md border border-slate-700 min-w-36 font-mono">
                          <p className="font-sans font-semibold text-slate-300 border-b border-slate-700 pb-1 mb-1">{data.name}</p>
                          <p>ID: {data.id}</p>
                          <p>Logins: {data.logins}d/30</p>
                          <p>Spending: ${data.spending}</p>
                          <p className={`mt-1.5 font-sans font-bold py-0.5 px-1 rounded inline-block text-[10px] ${statusIdx === 1 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {statusIdx === 1 ? 'Actual Churned' : 'Actual Retained'}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={scatterData} fill="#3b82f6">
                  {scatterData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.churn === 1 ? '#f43f5e' : '#10b981'} 
                      stroke={entry.churn === 1 ? '#e11d48' : '#059669'}
                      strokeWidth={1}
                      fillOpacity={0.8}
                    />
                  ))}
                </Scatter>
                <Legend 
                  verticalAlign="top" 
                  height={32}
                  content={() => (
                    <div className="flex gap-4 justify-center text-xs pb-3 font-mono">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Retained Customers</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Churned Customers</span>
                    </div>
                  )}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Churn Rate vs Support Complaint Counts */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">
              Lethal Churn Indicator
            </span>
            <h3 className="font-display font-bold text-slate-800 mt-1">Churn Liability vs Help Tickets</h3>
            <p className="text-xs text-slate-500">This chart shows what fraction of accounts churn based on the volume of complaints issued.</p>
          </div>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complaintDistributionData} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="complaints" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} unit="%" />
                <Tooltip 
                  formatter={(value, name) => [value + (name === 'Churn Rate (%)' ? '%' : ''), name]}
                  contentStyle={{ fontSize: '12px', fontFamily: 'monospace' }} 
                />
                <Bar dataKey="Churn Rate (%)" fill="#6366f1" radius={[4, 4, 0, 0]}>
                  {complaintDistributionData.map((entry, index) => {
                    const rate = entry['Churn Rate (%)'];
                    const color = rate > 70 ? '#f43f5e' : rate > 40 ? '#f59e0b' : '#3b82f6';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
                <Legend 
                  verticalAlign="top" 
                  height={32}
                  content={() => (
                    <div className="flex gap-4 justify-center text-xs pb-3 font-mono">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500" /> Safe Churn</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> Moderately At-Risk</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500" /> Critically Vulnerable</span>
                    </div>
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Cohort Density and Pearson Correlation Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cohort Density Area Chart (7 columns) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">
              Interaction Cohorts
            </span>
            <h3 className="font-display font-bold text-slate-800 mt-1">Cohort Density: Days Logged In</h3>
            <p className="text-xs text-slate-500">Identify how actual retained and churned customers divide across the login frequency spectrum.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={loginCohortData} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                <defs>
                  <linearGradient id="colorRetained" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorChurned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="range" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Area type="monotone" dataKey="Retained" stroke="#10b981" fillOpacity={1} fill="url(#colorRetained)" strokeWidth={2} />
                <Area type="monotone" dataKey="Churned" stroke="#f43f5e" fillOpacity={1} fill="url(#colorChurned)" strokeWidth={2} />
                <Legend verticalAlign="top" height={32} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Matrix Heatmap: Pearson Coefficients (5 columns) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-4 flex flex-col">
          <div>
            <span className="text-[10px] font-mono uppercase bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">
              Pearson’s Coefficient Relationship
            </span>
            <h3 className="font-display font-bold text-slate-800 mt-1">Linear Association Heatmap</h3>
            <p className="text-xs text-slate-500">Grasp factors that align towards or against Churn liability. Negative denotes opposite drift; positive indicates same-drift liability.</p>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {/* The heat matrix table */}
            <div className="grid grid-cols-7 gap-1 font-mono text-[9px]">
              {/* Header spaces */}
              <div className="border border-transparent" />
              {uniqueX.map((ux, i) => (
                <div key={i} className="font-bold text-slate-500 text-center uppercase tracking-tighter truncate" title={ux}>
                  {ux}
                </div>
              ))}

              {/* Grid rows */}
              {uniqueY.map((uy, yIdx) => (
                <React.Fragment key={yIdx}>
                  <div className="font-bold text-slate-550 text-left self-center truncate uppercase tracking-tighter pr-1" title={uy}>
                    {uy}
                  </div>
                  {uniqueX.map((ux, xIdx) => {
                    const match = correlationMatrix.find(item => item.x === ux && item.y === uy);
                    const val = match ? match.val : 0;
                    return (
                      <div 
                        key={`${yIdx}-${xIdx}`} 
                        className={`h-8 flex items-center justify-center font-bold font-mono text-center rounded border border-white/50 transition-all shadow-sm ${getHeatColor(val)}`}
                        title={`${uy} vs ${ux}: correlation is ${val}`}
                      >
                        {val >= 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-4 pt-4 border-t border-slate-100">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500" /> Negative Correlation</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-slate-50 border border-slate-200" /> Neutral</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-500" /> Positive Correlation</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

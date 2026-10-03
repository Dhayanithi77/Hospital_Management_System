import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  Zap, 
  ArrowRight,
  BrainCircuit
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { workloadData } from '../data/mockData';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const pieData = [
  { name: 'Cardiology', value: 400 },
  { name: 'Neurology', value: 300 },
  { name: 'Emergency', value: 300 },
  { name: 'Pediatrics', value: 200 },
];

const COLORS = ['#32E6E6', '#0F172A', '#64748b', '#94a3b8'];

export default function AIInsights() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            AI Insights & Analytics
            <div className="bg-primary/20 p-1 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-primary" />
            </div>
          </h1>
          <p className="text-slate-500 mt-1">Predictive analysis and workload optimization recommendations.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-emerald-100">
          <Zap className="w-4 h-4 fill-emerald-500" />
          System Optimized
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-8">Workload Prediction (Next 7 Days)</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={workloadData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#32E6E6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#32E6E6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="hours" stroke="#32E6E6" strokeWidth={4} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Department Heatmap (Real-time)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['ER', 'ICU', 'OR', 'OPD', 'LAB', 'RAD', 'PHARM', 'ADMIN'].map((area, i) => (
                <div key={area} className="relative aspect-square rounded-2xl overflow-hidden group cursor-help">
                  <div className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center transition-all duration-500",
                    i % 3 === 0 ? "bg-rose-500/20" : i % 2 === 0 ? "bg-amber-500/20" : "bg-emerald-500/20"
                  )}>
                    <span className="text-lg font-bold text-slate-900">{area}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {i % 3 === 0 ? 'High' : i % 2 === 0 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-secondary text-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Recommendations
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <AlertCircle className="w-4 h-4" />
                  Staff Redistribution
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Emergency department is expected to reach 95% capacity in 2 hours. Suggest moving 2 nurses from Pediatrics.
                </p>
                <button className="text-xs font-bold text-white flex items-center gap-1 hover:gap-2 transition-all">
                  Apply Now <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="h-[1px] bg-slate-700/50"></div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <TrendingUp className="w-4 h-4" />
                  Efficiency Boost
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Neurology shifts are currently under-utilized. Consider merging night rotations to reduce overtime costs by 12%.
                </p>
                <button className="text-xs font-bold text-white flex items-center gap-1 hover:gap-2 transition-all">
                  View Plan <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Resource Allocation</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {pieData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

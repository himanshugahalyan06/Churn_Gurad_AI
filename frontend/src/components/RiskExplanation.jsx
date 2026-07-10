import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { ShieldAlert, ShieldCheck, Target } from 'lucide-react';

export default function RiskExplanation({ prediction, shapData }) {
  if (!prediction) {
    return null;
  }

  const isChurn = prediction.prediction === 1;
  const probability = (prediction.probability * 100).toFixed(1);
  const threshold = (prediction.threshold * 100).toFixed(1);
  
  const formatFeatureName = (name) => {
    let cleanName = name.replace('categorical__', '').replace('numerical__', '').replace('remainder__', '');
    if (cleanName.includes('_')) {
      const parts = cleanName.split('_');
      cleanName = `${parts[0]}: ${parts.slice(1).join(' ')}`;
    }
    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  };

  const chartData = shapData ? shapData.map((item) => ({
    name: formatFeatureName(item.Feature),
    value: parseFloat(item.SHAP),
    fill: item.SHAP > 0 ? '#ef4444' : '#10b981',
  })) : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className={`px-6 py-5 border-b flex items-center justify-between ${isChurn ? 'bg-red-50/50 border-red-100' : 'bg-emerald-50/50 border-emerald-100'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl shadow-sm border ${isChurn ? 'bg-white border-red-200 text-red-600' : 'bg-white border-emerald-200 text-emerald-600'}`}>
            {isChurn ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Risk Assessment</h2>
            <p className="text-xs text-slate-500 font-medium">Cost-Optimized Prediction</p>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm border
          ${isChurn ? 'bg-red-100 text-red-700 border-red-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}
        `}>
          {isChurn ? 'High Risk' : 'Low Risk'}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        
        <div className="flex items-center justify-center py-6 mb-6">
          <div className="text-center">
            <div className="text-6xl font-extrabold text-slate-900 tracking-tighter mb-2">
              {probability}<span className="text-3xl text-slate-400 font-medium">%</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">
              <Target className="w-3.5 h-3.5" />
              Threshold: {threshold}%
            </div>
          </div>
        </div>

        {shapData && (
          <div className="flex-grow flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Key Risk Drivers</h3>
            <p className="text-xs text-slate-500 mb-6">The primary factors pushing the prediction towards or away from churn.</p>
            
            <div className="flex-grow min-h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                >
                  <XAxis type="number" hide domain={['dataMin', 'dataMax']} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    width={140}
                    tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}}
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    formatter={(value) => [Math.abs(value).toFixed(3), value > 0 ? 'Increases Risk' : 'Decreases Risk']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  />
                  <ReferenceLine x={0} stroke="#cbd5e1" />
                  <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={20}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 flex justify-center gap-8 text-[11px] font-semibold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></span>
                <span className="text-slate-500">Decreases Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></span>
                <span className="text-slate-500">Increases Risk</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

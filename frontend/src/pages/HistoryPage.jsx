import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  History, Trash2, ShieldAlert, ShieldCheck, AlertCircle,
  Search, ArrowRight, Filter, X, ChevronDown
} from 'lucide-react';
import { useHistory } from '../context/HistoryContext';

function RiskBadge({ pct }) {
  if (pct >= 70) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
      <ShieldAlert className="w-3 h-3" /> High
    </span>
  );
  if (pct >= 40) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
      <AlertCircle className="w-3 h-3" /> Medium
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
      <ShieldCheck className="w-3 h-3" /> Low
    </span>
  );
}

function ProbabilityBar({ value }) {
  const pct = Math.round(value * 100);
  const color = pct >= 70 ? 'bg-red-500' : pct >= 40 ? 'bg-amber-400' : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-slate-700 w-9 text-right">{pct}%</span>
    </div>
  );
}

function ExpandedRow({ entry }) {
  const topFeatures = entry.shapData
    ? [...entry.shapData].sort((a, b) => Math.abs(b.SHAP) - Math.abs(a.SHAP)).slice(0, 5)
    : [];

  function fmtName(name) {
    let c = name.replace('categorical__', '').replace('numerical__', '').replace('remainder__', '');
    if (c.includes('_')) { const p = c.split('_'); c = `${p[0]}: ${p.slice(1).join(' ')}`; }
    return c.charAt(0).toUpperCase() + c.slice(1);
  }

  return (
    <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Input fields */}
      <div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Customer Profile</div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(entry.formData).map(([k, v]) => (
            <div key={k} className="text-xs">
              <span className="text-slate-400">{k.replace(/([A-Z])/g, ' $1').trim()}: </span>
              <span className="font-semibold text-slate-700">{String(v)}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Top SHAP drivers */}
      <div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Top Risk Drivers</div>
        {topFeatures.length > 0 ? (
          <div className="space-y-2">
            {topFeatures.map((f) => {
              const isPos = f.SHAP > 0;
              return (
                <div key={f.Feature} className="flex items-center gap-2">
                  <div className={`w-1 h-4 rounded-full flex-shrink-0 ${isPos ? 'bg-red-400' : 'bg-emerald-400'}`} />
                  <span className="text-xs text-slate-600 flex-1 truncate">{fmtName(f.Feature)}</span>
                  <span className={`text-xs font-bold ${isPos ? 'text-red-600' : 'text-emerald-600'}`}>
                    {isPos ? '+' : ''}{parseFloat(f.SHAP).toFixed(3)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-xs text-slate-400">No SHAP data available</div>
        )}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const { history, clearHistory } = useHistory();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'churn' | 'safe'
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    document.title = 'History — ChurnGuard AI';
  }, []);

  const filtered = history.filter((entry) => {
    const pct = Math.round(entry.prediction.probability * 100);
    const matchFilter =
      filter === 'all' ||
      (filter === 'churn' && pct >= 70) ||
      (filter === 'medium' && pct >= 40 && pct < 70) ||
      (filter === 'safe' && pct < 40);
    const matchSearch = search === '' || Object.values(entry.formData).some(
      (v) => String(v).toLowerCase().includes(search.toLowerCase())
    );
    return matchFilter && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-2">
            <History className="w-3 h-3" />
            Session History
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Prediction History</h1>
          <p className="text-sm text-slate-500 mt-1">All predictions made during this session</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        /* Empty state */
        <div className="card flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-5">
            <History className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">No predictions yet</h3>
          <p className="text-sm text-slate-400 max-w-xs mb-6">
            Your session history will appear here after you run predictions. History is stored in-memory and clears on page refresh.
          </p>
          <Link to="/predict" className="btn-primary text-sm">
            Run First Prediction
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by customer attribute…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input pl-9 pr-8"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              {[
                { key: 'all', label: 'All' },
                { key: 'churn', label: 'High Risk' },
                { key: 'medium', label: 'Medium' },
                { key: 'safe', label: 'Low Risk' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setFilter(opt.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    filter === opt.key
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div className="text-xs text-slate-400 mb-3">
            Showing {filtered.length} of {history.length} predictions
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contract</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tenure</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly $</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Probability</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Risk</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Outcome</th>
                    <th className="py-3 px-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400 text-sm">No results match your filters.</td>
                    </tr>
                  ) : (
                    filtered.map((entry, idx) => {
                      const pct = Math.round(entry.prediction.probability * 100);
                      const isExpanded = expanded === entry.id;
                      const dt = new Date(entry.timestamp);
                      return (
                        <React.Fragment key={entry.id}>
                          <tr
                            className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                            onClick={() => setExpanded(isExpanded ? null : entry.id)}
                          >
                            <td className="py-3.5 px-6 font-mono text-xs text-slate-400">{history.length - idx}</td>
                            <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                              <div className="text-xs">{dt.toLocaleDateString()}</div>
                              <div className="text-[10px] text-slate-400">{dt.toLocaleTimeString()}</div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 text-xs max-w-[100px] truncate">{entry.formData.Contract}</td>
                            <td className="py-3.5 px-4 text-slate-700 text-xs">{entry.formData.tenure} mo</td>
                            <td className="py-3.5 px-4 text-slate-700 text-xs">${entry.formData.MonthlyCharges}</td>
                            <td className="py-3.5 px-4"><ProbabilityBar value={entry.prediction.probability} /></td>
                            <td className="py-3.5 px-4"><RiskBadge pct={pct} /></td>
                            <td className="py-3.5 px-4">
                              <span className={`text-xs font-semibold ${entry.prediction.prediction === 1 ? 'text-red-600' : 'text-emerald-600'}`}>
                                {entry.prediction.prediction === 1 ? 'Churn' : 'Retained'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr>
                              <td colSpan={9} className="p-0">
                                <ExpandedRow entry={entry} />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

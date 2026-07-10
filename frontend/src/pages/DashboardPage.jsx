import React, { useEffect, useState, useCallback } from 'react';
import {
  Activity, Users, AlertTriangle, Clock, RefreshCw, Wifi, WifiOff,
  TrendingUp, BarChart3, Zap
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { getMetrics, getHealth } from '../lib/api';

/* ── Stat Card ─────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, gradFrom, gradTo, glowColor, borderColor, loading }) {
  return (
    <div
      className="card"
      style={{
        padding: 24,
        borderLeft: `3px solid ${borderColor}`,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 100, height: 100,
        background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
        filter: 'blur(20px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        boxShadow: `0 6px 20px ${glowColor}`,
      }}>
        <Icon style={{ width: 20, height: 20, color: 'white' }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
        {loading
          ? <div className="skeleton" style={{ height: 28, width: 80, marginBottom: 4 }} />
          : <div style={{ fontSize: 26, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.02em' }}>{value}</div>
        }
        {sub && <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ── Custom Tooltips ─────────────────────────────────────────────────── */
const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(15,12,35,0.95)',
      border: '1px solid rgba(139,92,246,0.3)',
      borderRadius: 12,
      padding: '10px 14px',
      fontSize: 13,
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>{payload[0]?.name || label}</div>
      <div style={{ color: '#94a3b8' }}>{payload[0]?.value} predictions</div>
      {payload[0]?.payload?.pct !== undefined && (
        <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>({payload[0].payload.pct}%)</div>
      )}
    </div>
  );
};

/* ── Main Page ─────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    document.title = 'Dashboard — ChurnGuard AI';
  }, []);

  const fetchAll = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      // Add a small synthetic delay when manual so the user actually sees the spinner
      const delay = isManual ? new Promise(res => setTimeout(res, 600)) : Promise.resolve();
      const [metricsRes, healthRes] = await Promise.allSettled([getMetrics(), getHealth(), delay]);
      if (metricsRes.status === 'fulfilled') setMetrics(metricsRes.value.data);
      setApiStatus(
        healthRes.status === 'fulfilled' && healthRes.value.data?.status === 'running' ? 'online' : 'offline'
      );
      setLastRefresh(new Date());
    } catch {
      setApiStatus('offline');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const iv = setInterval(fetchAll, 30000);
    return () => clearInterval(iv);
  }, [fetchAll]);

  const total     = metrics?.total_predictions ?? 0;
  const churn     = metrics?.predictions_distribution?.churn ?? 0;
  const nonChurn  = metrics?.predictions_distribution?.non_churn ?? 0;
  const latencyMs = metrics ? (metrics.average_latency_seconds * 1000).toFixed(1) : '—';
  const flaggedRate = total > 0 ? ((churn / total) * 100).toFixed(1) : '0.0';

  const pieData = [
    { name: 'Churn',    value: churn,    pct: total > 0 ? ((churn    / total) * 100).toFixed(1) : 0 },
    { name: 'No Churn', value: nonChurn, pct: total > 0 ? ((nonChurn / total) * 100).toFixed(1) : 0 },
  ];
  const PIE_COLORS = ['#f43f5e', '#10b981'];

  const barData = [
    { label: 'Churn',    count: churn,    fill: '#f43f5e' },
    { label: 'No Churn', count: nonChurn, fill: '#10b981' },
  ];

  const statusStyles = {
    online:   { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)',  color: '#6ee7b7',  dot: '#10b981'  },
    offline:  { bg: 'rgba(244,63,94,0.1)',   border: 'rgba(244,63,94,0.25)',   color: '#fda4af',  dot: '#f43f5e'  },
    checking: { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)',  color: '#fde68a',  dot: '#f59e0b'  },
  };
  const ss = statusStyles[apiStatus];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>

      {/* ── Page Header ── */}
      <div
        className="animate-fade-in-up"
        style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: 16,
          marginBottom: 32, opacity: 0, animationFillMode: 'forwards',
        }}
      >
        <div>
          <div className="badge badge-violet" style={{ marginBottom: 10 }}>
            <BarChart3 style={{ width: 12, height: 12 }} />
            Live Metrics
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.02em', margin: 0 }}>Monitoring Dashboard</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Real-time analytics from the ChurnGuard prediction pipeline</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {/* API badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 600,
            background: ss.bg, border: `1px solid ${ss.border}`, color: ss.color,
          }}>
            {apiStatus === 'online'   ? <><Wifi style={{ width: 13, height: 13 }} /><span style={{ width: 6, height: 6, borderRadius: '50%', background: ss.dot, boxShadow: `0 0 8px ${ss.dot}` }} />API Online</> : null}
            {apiStatus === 'offline'  ? <><WifiOff style={{ width: 13, height: 13 }} />API Offline</> : null}
            {apiStatus === 'checking' ? <><span style={{ width: 6, height: 6, borderRadius: '50%', background: ss.dot }} />Checking…</> : null}
          </div>

          {/* Refresh */}
          <button
            onClick={() => fetchAll(true)}
            disabled={refreshing}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 10,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
              opacity: refreshing ? 0.5 : 1,
            }}
          >
            <RefreshCw style={{ width: 13, height: 13 }} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {lastRefresh && (
        <p style={{ fontSize: 11, color: '#334155', marginBottom: 20 }}>
          Last updated: {lastRefresh.toLocaleTimeString()}
        </p>
      )}

      {/* Offline alert */}
      {apiStatus === 'offline' && !loading && (
        <div className="card" style={{
          padding: 20, marginBottom: 20,
          border: '1px solid rgba(244,63,94,0.3)',
          display: 'flex', alignItems: 'center', gap: 12, color: '#fda4af',
        }}>
          <AlertTriangle style={{ width: 18, height: 18, flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700 }}>Backend Offline</div>
            <div style={{ fontSize: 12, color: '#9f1239', marginTop: 2 }}>Cannot reach http://localhost:8000. Make sure the FastAPI server is running.</div>
          </div>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 24 }}>
        <StatCard icon={Users}         label="Total Predictions" loading={loading} value={loading ? '—' : total.toLocaleString()} sub="All time"                      gradFrom="#6366f1" gradTo="#818cf8" glowColor="rgba(99,102,241,0.25)"   borderColor="#6366f1" />
        <StatCard icon={AlertTriangle} label="Churn Rate"        loading={loading} value={loading ? '—' : `${flaggedRate}%`}       sub={`${churn} flagged customers`} gradFrom="#f43f5e" gradTo="#fb7185" glowColor="rgba(244,63,94,0.25)"   borderColor="#f43f5e" />
        <StatCard icon={Clock}         label="Avg Latency"       loading={loading} value={loading ? '—' : `${latencyMs}ms`}        sub="Per prediction"               gradFrom="#10b981" gradTo="#34d399" glowColor="rgba(16,185,129,0.25)"  borderColor="#10b981" />
        <StatCard icon={Zap}           label="Throughput"        loading={loading} value={loading ? '—' : metrics ? `${(1 / metrics.average_latency_seconds).toFixed(0)}/s` : '—'} sub="Max requests/sec" gradFrom="#8b5cf6" gradTo="#a78bfa" glowColor="rgba(139,92,246,0.25)" borderColor="#8b5cf6" />
      </div>

      {/* ── Charts ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 20, marginBottom: 20 }}>

        {/* Donut */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Prediction Distribution</h3>
              <p style={{ fontSize: 12, color: '#475569', marginTop: 3 }}>Churn vs No-Churn breakdown</p>
            </div>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'rgba(99,102,241,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Activity style={{ width: 16, height: 16, color: '#818cf8' }} />
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
              <div className="skeleton" style={{ width: 160, height: 160, borderRadius: '50%' }} />
            </div>
          ) : total === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, color: '#334155' }}>
              <BarChart3 style={{ width: 40, height: 40, marginBottom: 10, opacity: 0.3 }} />
              <div style={{ fontSize: 13, fontWeight: 600 }}>No predictions yet</div>
              <div style={{ fontSize: 11, marginTop: 4, color: '#1e293b' }}>Run a prediction to see data here</div>
            </div>
          ) : (
            <>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={4} dataKey="value" stroke="none">
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip content={<DarkTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 10 }}>
                {pieData.map((d, i) => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: PIE_COLORS[i], boxShadow: `0 0 8px ${PIE_COLORS[i]}` }} />
                    <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{d.name}</span>
                    <span style={{ color: '#475569', fontSize: 11 }}>({d.pct}%)</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bar chart */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Distribution Comparison</h3>
              <p style={{ fontSize: 12, color: '#475569', marginTop: 3 }}>Absolute count of each outcome</p>
            </div>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'rgba(139,92,246,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TrendingUp style={{ width: 16, height: 16, color: '#a78bfa' }} />
            </div>
          </div>

          {loading ? (
            <div className="skeleton" style={{ height: 200, borderRadius: 12 }} />
          ) : total === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, color: '#334155' }}>
              <BarChart3 style={{ width: 40, height: 40, marginBottom: 10, opacity: 0.3 }} />
              <div style={{ fontSize: 13, fontWeight: 600 }}>No data available</div>
            </div>
          ) : (
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={56}>
                    {barData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* ── Performance Table ── */}
      <div className="card" style={{ padding: 28 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity style={{ width: 16, height: 16, color: '#818cf8' }} />
          System Performance
        </h3>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 44 }} />)}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Metric', 'Value', 'Status'].map(h => (
                    <th key={h} style={{
                      textAlign: h === 'Metric' ? 'left' : 'right',
                      padding: '10px 8px', fontSize: 11,
                      fontWeight: 700, color: '#475569',
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Total Predictions',        value: total.toLocaleString(),                                 ok: true },
                  { label: 'Average Inference Latency', value: `${latencyMs}ms`,                                      ok: parseFloat(latencyMs) < 200 },
                  { label: 'Churn Flagged Rate',        value: `${flaggedRate}%`,                                     ok: parseFloat(flaggedRate) < 50 },
                  { label: 'Non-Churn Rate',            value: `${(100 - parseFloat(flaggedRate)).toFixed(1)}%`,      ok: true },
                  { label: 'API Status',                value: apiStatus.charAt(0).toUpperCase() + apiStatus.slice(1), ok: apiStatus === 'online' },
                ].map(row => (
                  <tr key={row.label} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 8px', fontWeight: 600, color: '#94a3b8' }}>{row.label}</td>
                    <td style={{ padding: '14px 8px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: '#e2e8f0' }}>{row.value}</td>
                    <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700,
                        background: row.ok ? 'rgba(16,185,129,0.1)'  : 'rgba(245,158,11,0.1)',
                        border:     `1px solid ${row.ok ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
                        color:      row.ok ? '#6ee7b7' : '#fde68a',
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: row.ok ? '#10b981' : '#f59e0b', boxShadow: row.ok ? '0 0 6px #10b981' : '0 0 6px #f59e0b' }} />
                        {row.ok ? 'Normal' : 'Check'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

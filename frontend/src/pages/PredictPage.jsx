import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Wifi, CreditCard, ChevronRight, ChevronLeft,
  Zap, ShieldAlert, ShieldCheck, Target, BarChart3,
  AlertCircle, ArrowRight, RotateCcw
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import { predict, explain } from '../lib/api';
import { useHistory } from '../context/HistoryContext';

/* ── Field Definitions ────────────────────────────────────────────── */
const STEPS = [
  {
    id: 'personal',
    title: 'Personal Info',
    subtitle: 'Basic customer demographics and account status',
    icon: User,
    fields: [
      { name: 'gender', label: 'Gender', type: 'select', options: ['Female', 'Male'] },
      { name: 'SeniorCitizen', label: 'Senior Citizen', type: 'select', options: [0, 1], display: { 0: 'No', 1: 'Yes' } },
      { name: 'Partner', label: 'Partner', type: 'select', options: ['Yes', 'No'] },
      { name: 'Dependents', label: 'Dependents', type: 'select', options: ['Yes', 'No'] },
      { name: 'tenure', label: 'Tenure (months)', type: 'number', min: 0, max: 72 },
    ],
  },
  {
    id: 'services',
    title: 'Services',
    subtitle: 'Phone and internet service subscriptions',
    icon: Wifi,
    fields: [
      { name: 'PhoneService', label: 'Phone Service', type: 'select', options: ['Yes', 'No'] },
      { name: 'MultipleLines', label: 'Multiple Lines', type: 'select', options: ['Yes', 'No', 'No phone service'] },
      { name: 'InternetService', label: 'Internet Service', type: 'select', options: ['DSL', 'Fiber optic', 'No'] },
      { name: 'OnlineSecurity', label: 'Online Security', type: 'select', options: ['Yes', 'No', 'No internet service'] },
      { name: 'OnlineBackup', label: 'Online Backup', type: 'select', options: ['Yes', 'No', 'No internet service'] },
      { name: 'DeviceProtection', label: 'Device Protection', type: 'select', options: ['Yes', 'No', 'No internet service'] },
      { name: 'TechSupport', label: 'Tech Support', type: 'select', options: ['Yes', 'No', 'No internet service'] },
      { name: 'StreamingTV', label: 'Streaming TV', type: 'select', options: ['Yes', 'No', 'No internet service'] },
      { name: 'StreamingMovies', label: 'Streaming Movies', type: 'select', options: ['Yes', 'No', 'No internet service'] },
    ],
  },
  {
    id: 'billing',
    title: 'Billing',
    subtitle: 'Contract terms and payment details',
    icon: CreditCard,
    fields: [
      { name: 'Contract', label: 'Contract Type', type: 'select', options: ['Month-to-month', 'One year', 'Two year'] },
      { name: 'PaperlessBilling', label: 'Paperless Billing', type: 'select', options: ['Yes', 'No'] },
      {
        name: 'PaymentMethod', label: 'Payment Method', type: 'select',
        options: ['Electronic check', 'Mailed check', 'Bank transfer (automatic)', 'Credit card (automatic)'],
      },
      { name: 'MonthlyCharges', label: 'Monthly Charges ($)', type: 'number', step: 0.01, min: 0 },
      { name: 'TotalCharges', label: 'Total Charges ($)', type: 'number', step: 0.01, min: 0 },
    ],
  },
];

const DEFAULT_STATE = {
  gender: 'Female', SeniorCitizen: 0, Partner: 'No', Dependents: 'No',
  tenure: 1, PhoneService: 'Yes', MultipleLines: 'No',
  InternetService: 'Fiber optic', OnlineSecurity: 'No', OnlineBackup: 'Yes',
  DeviceProtection: 'No', TechSupport: 'No', StreamingTV: 'No', StreamingMovies: 'No',
  Contract: 'Month-to-month', PaperlessBilling: 'Yes',
  PaymentMethod: 'Electronic check', MonthlyCharges: 29.85, TotalCharges: 29.85,
};

/* ── SHAP label formatter ─────────────────────────────────────────── */
function formatFeature(name) {
  let clean = name.replace('categorical__', '').replace('numerical__', '').replace('remainder__', '');
  if (clean.includes('_')) {
    const parts = clean.split('_');
    clean = `${parts[0]}: ${parts.slice(1).join(' ')}`;
  }
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

/* ── Circular gauge ───────────────────────────────────────────────── */
function ProbabilityGauge({ probability }) {
  const pct = Math.round(probability * 100);
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const strokeDash = (pct / 100) * circ;
  const color = pct >= 70 ? '#f43f5e' : pct >= 40 ? '#f59e0b' : '#10b981';
  const glowColor = pct >= 70 ? 'rgba(244,63,94,0.3)' : pct >= 40 ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)';
  const bgColor = pct >= 70 ? 'rgba(244,63,94,0.08)' : pct >= 40 ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)';
  const borderColor = pct >= 70 ? 'rgba(244,63,94,0.2)' : pct >= 40 ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: bgColor, borderRadius: 16, padding: '24px 32px', border: `1px solid ${borderColor}` }}>
      <div style={{ position: 'relative', width: 144, height: 144 }}>
        <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
          <circle
            cx="60" cy="60" r={radius} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={`${strokeDash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 8px ${glowColor})` }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 38, fontWeight: 900, color: '#f1f5f9', lineHeight: 1 }}>{pct}</span>
          <span style={{ fontSize: 16, fontWeight: 700, color }}> %</span>
        </div>
      </div>
      <div style={{ marginTop: 12, fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Churn Probability</div>
    </div>
  );
}

/* ── Risk badge ────────────────────────────────────────────────────── */
function RiskBadge({ pct }) {
  if (pct >= 70) return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 16px', borderRadius:9999, background:'rgba(244,63,94,0.12)', border:'1px solid rgba(244,63,94,0.3)', color:'#fda4af', fontSize:13, fontWeight:700 }}>
      <ShieldAlert style={{ width:15, height:15 }} /> High Risk
    </span>
  );
  if (pct >= 40) return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 16px', borderRadius:9999, background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.3)', color:'#fde68a', fontSize:13, fontWeight:700 }}>
      <AlertCircle style={{ width:15, height:15 }} /> Medium Risk
    </span>
  );
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 16px', borderRadius:9999, background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)', color:'#6ee7b7', fontSize:13, fontWeight:700 }}>
      <ShieldCheck style={{ width:15, height:15 }} /> Low Risk
    </span>
  );
}

/* ── Main Page ────────────────────────────────────────────────────── */
export default function PredictPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(DEFAULT_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [shapData, setShapData] = useState(null);
  const { addEntry } = useHistory();

  useEffect(() => {
    document.title = 'Predict — ChurnGuard AI';
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let v = value;
    if (type === 'number') v = parseFloat(value);
    else if (name === 'SeniorCitizen') v = parseInt(value, 10);
    setFormData((prev) => ({ ...prev, [name]: v }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const [predRes, expRes] = await Promise.all([
        predict(formData),
        explain(formData),
      ]);
      setPrediction(predRes.data);
      setShapData(expRes.data);
      addEntry(formData, predRes.data, expRes.data);
    } catch (err) {
      setError('Could not reach the prediction API. Make sure the backend is running on http://localhost:8000.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPrediction(null);
    setShapData(null);
    setError(null);
    setStep(0);
    setFormData(DEFAULT_STATE);
  };

  const currentStep = STEPS[step];
  const isLastStep = step === STEPS.length - 1;
  const pct = prediction ? Math.round(prediction.probability * 100) : 0;

  const chartData = shapData
    ? shapData.map((item) => ({
        name: formatFeature(item.Feature),
        value: parseFloat(item.SHAP),
        fill: item.SHAP > 0 ? '#ef4444' : '#10b981',
      }))
    : [];

  if (prediction) {
    return (
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }} className="animate-fade-in">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="badge badge-violet" style={{ marginBottom: 10 }}>
              <Target style={{ width: 12, height: 12 }} /> Risk Assessment
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.02em', margin: 0 }}>Churn Risk Report</h1>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Cost-optimized prediction result with SHAP explanations</p>
          </div>
          <button onClick={reset} className="btn-secondary" style={{ fontSize: 13, padding: '9px 20px' }}>
            <RotateCcw style={{ width: 14, height: 14 }} />
            New Prediction
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 20 }}>
          {/* Gauge card */}
          <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <ProbabilityGauge probability={prediction.probability} />
            <RiskBadge pct={pct} />
            {prediction.threshold && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b', background: 'rgba(255,255,255,0.04)', padding: '6px 14px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.08)' }}>
                <Target style={{ width: 13, height: 13, color: '#818cf8' }} />
                Threshold: {(prediction.threshold * 100).toFixed(1)}%
              </div>
            )}
            <div style={{ width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, textAlign: 'center', background: prediction.prediction === 1 ? 'rgba(244,63,94,0.08)' : 'rgba(16,185,129,0.08)', border: `1px solid ${prediction.prediction === 1 ? 'rgba(244,63,94,0.25)' : 'rgba(16,185,129,0.25)'}`, color: prediction.prediction === 1 ? '#fda4af' : '#6ee7b7' }}>
              {prediction.prediction === 1
                ? '⚠️ Customer likely to churn — recommend intervention'
                : '✓ Customer unlikely to churn — retention looks stable'}
            </div>
          </div>

          {/* SHAP chart */}
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Key Risk Drivers</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fda4af' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e', boxShadow: '0 0 6px #f43f5e' }} />Increases Risk</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6ee7b7' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />Decreases Risk</span>
              </div>
            </div>
            <p style={{ fontSize: 12, color: '#475569', marginBottom: 16 }}>SHAP values showing feature contribution to prediction</p>
            {chartData.length > 0 ? (
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 40, left: 10, bottom: 0 }}>
                    <XAxis type="number" hide domain={['dataMin', 'dataMax']} />
                    <YAxis
                      dataKey="name" type="category" axisLine={false} tickLine={false}
                      width={150} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                    />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      formatter={(v) => [Math.abs(v).toFixed(4), v > 0 ? 'Increases Risk' : 'Decreases Risk']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    />
                    <ReferenceLine x={0} stroke="#cbd5e1" strokeWidth={1} />
                    <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={18}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No SHAP data available</div>
            )}
          </div>
        </div>

        {/* Input summary */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <User style={{ width: 15, height: 15, color: '#818cf8' }} /> Input Summary
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
            {Object.entries(formData).map(([k, v]) => (
              <div key={k} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{String(v)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <Link to="/history" className="btn-secondary">
            <BarChart3 className="w-4 h-4" /> View History
          </Link>
          <Link to="/dashboard" className="btn-primary">
            View Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px' }}>
      {/* Page Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: 32, opacity: 0, animationFillMode: 'forwards' }}>
        <div className="badge badge-violet" style={{ marginBottom: 14 }}>
          <Zap style={{ width: 12, height: 12 }} />
          Cost-Sensitive Prediction
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.02em', margin: 0 }}>Churn Risk Prediction</h1>
        <p style={{ color: '#64748b', marginTop: 8, fontSize: 14 }}>Fill in the customer profile across three sections to get an AI-powered churn risk score.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <React.Fragment key={s.id}>
              <div
                className={`flex items-center gap-2 cursor-pointer transition-all ${done ? 'opacity-100' : active ? 'opacity-100' : 'opacity-40'}`}
                onClick={() => done && setStep(i)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  done ? 'bg-indigo-600 text-white' : active ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 'bg-slate-200 text-slate-500'
                }`}>
                  {done ? '✓' : i + 1}
                </div>
                <span className={`hidden sm:block text-sm font-semibold ${active ? 'text-indigo-700' : 'text-slate-500'}`}>{s.title}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full transition-all ${done ? 'bg-indigo-600' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step card */}
      <div className="card animate-fade-in" style={{ overflow: 'hidden' }}>
        {/* Step header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '20px 24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ width: 42, height: 42, borderRadius: 13, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(139,92,246,0.4)', flexShrink: 0 }}>
            <currentStep.icon style={{ width: 19, height: 19, color: 'white' }} />
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{currentStep.title}</h2>
            <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{currentStep.subtitle}</p>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: '#475569' }}>Step {step + 1} of {STEPS.length}</span>
        </div>

        {/* Fields */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {currentStep.fields.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <label className="form-label">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="form-input cursor-pointer"
                  >
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {field.display ? field.display[opt] : opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    min={field.min ?? 0}
                    max={field.max}
                    step={field.step ?? 1}
                    className="form-input"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ margin: '0 24px 16px', padding: '12px 16px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 12, color: '#fda4af', fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <AlertCircle style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }} />
            {error}
          </div>
        )}

        {/* Navigation */}
        <div style={{ padding: '20px 24px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 8 }}>
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn-secondary px-5 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {isLastStep ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary px-7 py-2.5 text-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing…
                </>
              ) : (
                <>
                  Generate Risk Assessment
                  <Zap className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="btn-primary px-7 py-2.5 text-sm"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

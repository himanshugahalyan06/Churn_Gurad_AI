import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert, BrainCircuit, BarChart3, Target, ArrowRight,
  TrendingDown, Zap, Lock, CheckCircle, ChevronRight
} from 'lucide-react';

const features = [
  {
    icon: BrainCircuit,
    title: 'Cost-Sensitive ML',
    description: 'Trained to minimize real business losses — treating false negatives differently from false positives.',
    gradFrom: '#6366f1', gradTo: '#818cf8',
    glow: 'rgba(99,102,241,0.25)',
  },
  {
    icon: BarChart3,
    title: 'SHAP Explainability',
    description: 'Every prediction comes with a detailed breakdown of which attributes contributed most to churn risk.',
    gradFrom: '#8b5cf6', gradTo: '#a78bfa',
    glow: 'rgba(139,92,246,0.25)',
  },
  {
    icon: Target,
    title: 'Optimized Threshold',
    description: 'Dynamic threshold tuning ensures the right balance between catching at-risk customers and avoiding over-intervention.',
    gradFrom: '#06b6d4', gradTo: '#67e8f9',
    glow: 'rgba(6,182,212,0.2)',
  },
  {
    icon: Zap,
    title: 'Real-Time Inference',
    description: 'Sub-50ms predictions via a production-grade FastAPI backend, ready for any CRM or customer platform.',
    gradFrom: '#f59e0b', gradTo: '#fde68a',
    glow: 'rgba(245,158,11,0.2)',
  },
  {
    icon: Lock,
    title: 'Fully Explainable',
    description: 'Interpretable models and feature importance reports so your retention team knows exactly why to intervene.',
    gradFrom: '#10b981', gradTo: '#6ee7b7',
    glow: 'rgba(16,185,129,0.2)',
  },
  {
    icon: TrendingDown,
    title: 'Revenue Protection',
    description: 'Identify high-value customers at risk weeks before churn event, maximizing retention ROI.',
    gradFrom: '#f43f5e', gradTo: '#fda4af',
    glow: 'rgba(244,63,94,0.2)',
  },
];

const stats = [
  { value: '94%', label: 'AUC-ROC Score', sub: 'Production model', color: '#a78bfa' },
  { value: '<50ms', label: 'Avg Latency', sub: 'Per prediction', color: '#67e8f9' },
  { value: '3×', label: 'Cost Reduction', sub: 'vs. baseline model', color: '#6ee7b7' },
  { value: '19', label: 'Feature Signals', sub: 'Customer attributes', color: '#fde68a' },
];

const steps = [
  { num: '01', title: 'Enter Customer Data', desc: 'Fill in the customer profile — demographics, services, billing info — via our guided form.' },
  { num: '02', title: 'Get Risk Score', desc: 'Our cost-sensitive model scores churn probability in milliseconds, with a calibrated threshold.' },
  { num: '03', title: 'Understand Why', desc: 'View SHAP-driven explanations showing which features drove the prediction up or down.' },
  { num: '04', title: 'Take Action', desc: "Use the insight to target retention campaigns where they'll have maximum impact." },
];

function StatCard({ value, label, sub, delay, color }) {
  return (
    <div
      className="card p-6 text-center animate-fade-in-up"
      style={{ animationDelay: delay, opacity: 0, animationFillMode: 'forwards', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 0%, ${color}15 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ fontSize: 36, fontWeight: 900, color, lineHeight: 1, marginBottom: 6 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{label}</div>
      <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{sub}</div>
    </div>
  );
}

export default function HomePage() {
  useEffect(() => {
    document.title = 'ChurnGuard AI — Cost-Sensitive Customer Churn Prediction';
  }, []);

  return (
    <div style={{ overflowX: 'hidden' }}>

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: `linear-gradient(135deg, rgba(6,4,15,0.85) 0%, rgba(13,9,32,0.85) 40%, rgba(8,15,36,0.9) 100%), url('/telecom_bg.png') center/cover no-repeat`,
      }}>
        {/* Orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        {/* Dot grid */}
        <div className="dot-grid absolute inset-0 pointer-events-none" style={{ opacity: 0.6 }} />
        <div className="noise-overlay" />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px', width: '100%', position: 'relative' }}>
          <div style={{ maxWidth: 680 }}>

            {/* Badge */}
            <div
              className="animate-fade-in-up badge badge-violet"
              style={{ marginBottom: 28, opacity: 0, animationFillMode: 'forwards' }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#8b5cf6',
                boxShadow: '0 0 8px #8b5cf6',
                display: 'inline-block',
                animation: 'pulse-ring 2s infinite',
              }} />
              ML-Powered Retention Intelligence
            </div>

            {/* Headline */}
            <h1
              className="animate-fade-in-up delay-100"
              style={{
                fontSize: 'clamp(42px, 7vw, 80px)',
                fontWeight: 900,
                lineHeight: 1.04,
                letterSpacing: '-0.03em',
                marginBottom: 22,
                opacity: 0,
                animationFillMode: 'forwards',
                color: '#f1f5f9',
              }}
            >
              Stop Churn{' '}
              <span className="gradient-text">Before</span>
              {' '}It Happens
            </h1>

            {/* Subheadline */}
            <p
              className="animate-fade-in-up delay-200"
              style={{
                fontSize: 18, lineHeight: 1.7,
                color: '#94a3b8',
                marginBottom: 36,
                maxWidth: 560,
                opacity: 0,
                animationFillMode: 'forwards',
              }}
            >
              ChurnGuard AI is a cost-sensitive churn prediction system that identifies at-risk customers with SHAP explainability — so your retention team knows <em style={{ color: '#c4b5fd' }}>who</em> to save and <em style={{ color: '#67e8f9' }}>why</em>.
            </p>

            {/* CTAs */}
            <div
              className="animate-fade-in-up delay-300"
              style={{ display: 'flex', flexWrap: 'wrap', gap: 14, opacity: 0, animationFillMode: 'forwards' }}
            >
              <Link to="/predict" className="btn-primary" style={{ fontSize: 15, padding: '14px 32px' }}>
                Try a Prediction
                <ArrowRight style={{ width: 16, height: 16 }} />
              </Link>
              <Link to="/dashboard" className="btn-secondary" style={{ fontSize: 15, padding: '14px 32px' }}>
                View Dashboard
                <BarChart3 style={{ width: 16, height: 16 }} />
              </Link>
            </div>

            {/* Tags */}
            <div
              className="animate-fade-in-up delay-400"
              style={{
                display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 36,
                opacity: 0, animationFillMode: 'forwards',
              }}
            >
              {['Cost-Optimized Threshold', 'SHAP Explainability', 'FastAPI Backend', 'React + Vite'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 12, fontWeight: 600,
                    color: '#94a3b8',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '6px 14px', borderRadius: 9999,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <CheckCircle style={{ width: 12, height: 12, color: '#6ee7b7' }} />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Hero floating card */}
          <div
            className="animate-fade-in delay-500 animate-float hidden xl:flex"
            style={{ position: 'absolute', right: 40, top: 0, bottom: 0, alignItems: 'center', opacity: 0, animationFillMode: 'forwards' }}
          >
            <div className="card" style={{ padding: 24, width: 290, boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f43f5e, #dc2626)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 16px rgba(244,63,94,0.5)',
                }}>
                  <ShieldAlert style={{ width: 16, height: 16, color: 'white' }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>High Churn Risk</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Customer #2847</div>
                </div>
                <span style={{
                  marginLeft: 'auto', fontSize: 12, fontWeight: 800,
                  padding: '3px 9px', borderRadius: 20,
                  color: '#fda4af', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.25)',
                }}>84.2%</span>
              </div>

              <div style={{ height: 6, borderRadius: 9999, background: 'rgba(255,255,255,0.06)', marginBottom: 16, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: '84%',
                  background: 'linear-gradient(90deg, #fbbf24, #f97316, #ef4444)',
                  borderRadius: 9999,
                }} />
              </div>

              <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Top Risk Drivers</div>
              {[
                { label: 'Month-to-month Contract', val: 0.38, pos: true },
                { label: 'No Online Security', val: 0.22, pos: true },
                { label: 'High Monthly Charges', val: 0.18, pos: true },
                { label: 'Long Tenure', val: 0.14, pos: false },
              ].map((d) => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', width: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.label}</div>
                  <div style={{ flex: 1, height: 5, borderRadius: 9999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${d.val * 100}%`, background: d.pos ? '#f43f5e' : '#10b981', borderRadius: 9999 }} />
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: d.pos ? '#fda4af' : '#6ee7b7', minWidth: 36 }}>
                    {d.pos ? '+' : '-'}{d.val.toFixed(2)}
                  </div>
                </div>
              ))}
              <div style={{
                marginTop: 14, paddingTop: 12,
                borderTop: '1px solid rgba(255,255,255,0.07)',
                fontSize: 10, color: '#475569',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <Zap style={{ width: 11, height: 11, color: '#8b5cf6' }} />
                Generated in 32ms · Cost-optimized threshold
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ──────────────────────────────────────────────────── */}
      <section style={{
        padding: '60px 0',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {stats.map((s, i) => (
              <StatCard key={s.label} {...s} delay={`${i * 0.1}s`} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ───────────────────────────────────────────────── */}
      <section style={{ padding: '96px 0', background: 'transparent' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="badge badge-violet" style={{ marginBottom: 16 }}>
              <BrainCircuit style={{ width: 13, height: 13 }} />
              Intelligent by Design
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 14, color: '#f1f5f9' }}>
              Why ChurnGuard?
            </h2>
            <p style={{ color: '#64748b', maxWidth: 480, margin: '0 auto', fontSize: 15 }}>
              Built to go beyond prediction accuracy — designed to drive real retention outcomes.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <div
                key={f.title}
                className="card animate-fade-in-up"
                style={{
                  padding: 28,
                  animationDelay: `${i * 0.08}s`,
                  opacity: 0,
                  animationFillMode: 'forwards',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                }}
              >
                {/* Glow blob */}
                <div style={{
                  position: 'absolute', top: -30, right: -30,
                  width: 120, height: 120,
                  background: `radial-gradient(circle, ${f.glow}, transparent 70%)`,
                  filter: 'blur(20px)',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: `linear-gradient(135deg, ${f.gradFrom}, ${f.gradTo})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16,
                  boxShadow: `0 6px 20px ${f.glow}`,
                }}>
                  <f.icon style={{ width: 20, height: 20, color: 'white' }} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────────────── */}
      <section style={{
        padding: '96px 0',
        background: 'rgba(255,255,255,0.015)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="badge badge-cyan" style={{ marginBottom: 16 }}>
              <Zap style={{ width: 13, height: 13 }} />
              Simple Workflow
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 14, color: '#f1f5f9' }}>
              How It Works
            </h2>
            <p style={{ color: '#64748b', maxWidth: 440, margin: '0 auto', fontSize: 15 }}>
              From customer data to actionable insight in four simple steps.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{ position: 'relative' }}>
                <div className="card" style={{ padding: 28, height: '100%' }}>
                  <div style={{
                    fontSize: 48, fontWeight: 900,
                    background: 'linear-gradient(135deg,#a78bfa,#67e8f9)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    opacity: 0.18,
                    lineHeight: 1,
                    marginBottom: 12,
                  }}>{s.num}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div style={{
                    position: 'absolute', right: -12, top: '50%',
                    transform: 'translateY(-50%)', zIndex: 10,
                    display: 'none',
                  }} className="hidden lg:flex">
                    <ChevronRight style={{ width: 22, height: 22, color: '#334155' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─────────────────────────────────────────────── */}
      <section style={{
        padding: '100px 0',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e1b4b 100%)',
        borderTop: '1px solid rgba(139,92,246,0.2)',
      }}>
        <div className="dot-grid absolute inset-0 pointer-events-none" style={{ opacity: 0.8 }} />
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.25), transparent)',
          top: -250, right: -100, filter: 'blur(80px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.15), transparent)',
          bottom: -150, left: -80, filter: 'blur(70px)', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#f1f5f9', marginBottom: 16, letterSpacing: '-0.02em' }}>
            Ready to protect your revenue?
          </h2>
          <p style={{ fontSize: 15, color: '#a5b4fc', marginBottom: 36, maxWidth: 460, margin: '0 auto 36px' }}>
            Run a free prediction now. No sign-up required — just enter customer data and get instant AI-powered churn risk analysis.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <Link
              to="/predict"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', fontWeight: 700, borderRadius: 12,
                fontSize: 15, textDecoration: 'none', transition: 'all 0.2s',
                background: 'white', color: '#4338ca',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              }}
            >
              Start Predicting
              <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
            <Link
              to="/dashboard"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', fontWeight: 700, borderRadius: 12,
                fontSize: 15, textDecoration: 'none', transition: 'all 0.2s',
                color: '#e0e7ff',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              View Metrics
              <BarChart3 style={{ width: 16, height: 16 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────── */}
      <footer style={{
        background: '#050510',
        padding: '36px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between',
          gap: 16, fontSize: 13,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 12px rgba(139,92,246,0.4)',
            }}>
              <ShieldAlert style={{ width: 14, height: 14, color: 'white' }} />
            </div>
            <span style={{ fontWeight: 700, color: '#f1f5f9' }}>ChurnGuard AI</span>
            <span style={{ color: '#334155' }}>·</span>
            <span style={{ color: '#475569' }}>Cost-Sensitive Churn Intelligence</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {[{ to: '/predict', label: 'Predict' }, { to: '/dashboard', label: 'Dashboard' }, { to: '/history', label: 'History' }].map(({ to, label }) => (
              <Link key={to} to={to} style={{ color: '#475569', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }}
                onMouseEnter={e => e.target.style.color = '#c4b5fd'}
                onMouseLeave={e => e.target.style.color = '#475569'}
              >{label}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

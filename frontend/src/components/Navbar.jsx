import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, BrainCircuit, History, Menu, X } from 'lucide-react';
import { getHealth } from '../lib/api';

const navItems = [
  { to: '/', label: 'Home', icon: ShieldAlert, exact: true },
  { to: '/predict', label: 'Predict', icon: BrainCircuit },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/history', label: 'History', icon: History },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const check = async () => {
      try { await getHealth(); setApiStatus('online'); }
      catch { setApiStatus('offline'); }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    online:   { dot: '#10b981', text: 'Live',     bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)',  color: '#6ee7b7'  },
    offline:  { dot: '#f43f5e', text: 'Offline',  bg: 'rgba(244,63,94,0.1)',   border: 'rgba(244,63,94,0.25)',   color: '#fda4af'  },
    checking: { dot: '#f59e0b', text: 'Checking', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)',  color: '#fde68a'  },
  };
  const status = statusConfig[apiStatus];

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 50,
          transition: 'all 0.3s ease',
          background: scrolled
            ? 'rgba(10, 10, 26, 0.92)'
            : 'rgba(10, 10, 26, 0.7)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: scrolled
            ? '1px solid rgba(139,92,246,0.2)'
            : '1px solid rgba(255,255,255,0.06)',
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div
                style={{
                  width: 36, height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(139,92,246,0.5)',
                }}
                className="animate-glow"
              >
                <ShieldAlert style={{ width: 18, height: 18, color: 'white' }} />
              </div>
              <span style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
                ChurnGuard
                <span style={{ background: 'linear-gradient(90deg,#a78bfa,#67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginLeft: 4 }}>AI</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden md:flex">
              {navItems.map(({ to, label, icon: Icon, exact }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={exact}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '8px 16px',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    background: isActive ? 'rgba(139,92,246,0.15)' : 'transparent',
                    color: isActive ? '#c4b5fd' : '#94a3b8',
                    border: isActive ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
                  })}
                >
                  <Icon style={{ width: 15, height: 15 }} />
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* API Status */}
              <span
                className="hidden sm:flex"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '5px 12px',
                  borderRadius: 9999,
                  background: status.bg,
                  border: `1px solid ${status.border}`,
                  color: status.color,
                }}
              >
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: status.dot,
                  boxShadow: apiStatus === 'online' ? `0 0 6px ${status.dot}` : 'none',
                  animation: apiStatus === 'checking' ? 'pulse 1.5s infinite' : 'none',
                }} />
                API {status.text}
              </span>

              {/* Mobile toggle */}
              <button
                onClick={() => setOpen(!open)}
                style={{
                  padding: 8,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  alignItems: 'center',
                }}
                className="flex md:hidden"
                aria-label="Toggle menu"
              >
                {open ? <X style={{ width: 18, height: 18 }} /> : <Menu style={{ width: 18, height: 18 }} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div style={{
            background: 'rgba(10,10,26,0.98)',
            backdropFilter: 'blur(24px)',
            borderTop: '1px solid rgba(139,92,246,0.15)',
            padding: '12px 16px 16px',
          }}
          className="md:hidden"
          >
            {navItems.map(({ to, label, icon: Icon, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                  marginBottom: 4,
                  background: isActive ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
                  color: isActive ? '#c4b5fd' : '#94a3b8',
                  border: isActive ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.06)',
                })}
              >
                <Icon style={{ width: 16, height: 16 }} />
                {label}
              </NavLink>
            ))}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', marginTop: 4,
              borderRadius: 10, fontSize: 12, fontWeight: 600,
              background: status.bg, border: `1px solid ${status.border}`, color: status.color,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: status.dot }} />
              API {status.text}
            </div>
          </div>
        )}
      </nav>
      {/* Spacer */}
      <div style={{ height: 64 }} />
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { LeadForgeLogo } from '@/components/ui/logo';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');

  useEffect(() => {
    if (isAuthenticated && user) {
      const isAdmin = user.is_superadmin || user.role === 'admin' || user.email === 'leadforge@gmail.com';
      router.push(isAdmin ? '/dashboard/admin' : '/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Redirecting to dashboard…</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    
    if (role === 'admin') {
      if (email !== 'leadforge@gmail.com' || password !== 'forge123') {
        setError('Invalid admin credentials.');
        return;
      }
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      const isAdmin = res.user?.is_superadmin || res.user?.role === 'admin' || res.user?.email === 'leadforge@gmail.com';
      if (isAdmin) {
        toast('Welcome Administrator! Opening Admin Dashboard...', 'success');
        router.push('/dashboard/admin');
      } else {
        toast('Welcome back to LeadForge!', 'success');
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      toast(err instanceof Error ? err.message : 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  function fillAdminCredentials() {
    setEmail('leadforge@gmail.com');
    setPassword('forge123');
    toast('Admin credentials filled: leadforge@gmail.com', 'info');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Background orbs */}
      <div className="orb orb-violet" style={{ width: 600, height: 600, top: -200, left: '50%', transform: 'translateX(-50%)' }} />
      <div className="orb orb-blue" style={{ width: 400, height: 400, bottom: -100, right: -100 }} />
      <div className="dot-grid absolute inset-0 opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(99,102,241,0.1))',
                border: '1px solid rgba(139,92,246,0.4)',
                boxShadow: '0 0 30px rgba(124,58,237,0.25)',
              }}
            >
              <LeadForgeLogo size={36} />
            </div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', color: 'var(--text-primary)' }}>
              Welcome back
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Sign in to your <span style={{ color: '#a78bfa' }}>LeadForge</span> account
            </p>
          </Link>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl p-8 animate-fade-up delay-100"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div className="flex p-1 rounded-xl mb-6" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'user' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
              style={role === 'user' ? { background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' } : {}}
              onClick={() => setRole('user')}
            >
              User
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'admin' ? 'text-purple-200 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
              style={role === 'admin' ? { background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(139,92,246,0.3)' } : {}}
              onClick={() => setRole('admin')}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="p-3.5 rounded-xl text-sm flex items-center gap-2.5 animate-slide-down"
                style={{
                  background: 'rgba(220,38,38,0.1)',
                  border: '1px solid rgba(220,38,38,0.25)',
                  color: '#fca5a5',
                }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Input
                label={role === 'admin' ? "Admin Email" : "Email address"}
                type="email"
                placeholder={role === 'admin' ? "admin@leadforge.com" : "you@company.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label={role === 'admin' ? "Admin Password" : "Password"}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-end">
              <a href="#" className="text-xs transition-colors" style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#a78bfa')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
                Forgot password?
              </a>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              {loading ? 'Signing in…' : (role === 'admin' ? 'Access Admin Dashboard' : 'Sign In to LeadForge')}
            </Button>
          </form>

          {/* Quick Admin Access Helper */}
          {role === 'admin' && (
            <div className="mt-4 p-3 rounded-xl flex items-center justify-between" style={{ background: 'rgba(124,58,237,0.08)', border: '1px dashed rgba(139,92,246,0.3)' }}>
              <div className="text-xs">
                <span className="font-semibold text-purple-300">Admin Account:</span>
                <span className="text-zinc-400 block">leadforge@gmail.com</span>
              </div>
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="text-xs px-2.5 py-1 rounded-lg font-medium transition-all"
                style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(99,102,241,0.3))',
                  color: '#e9d5ff',
                  border: '1px solid rgba(167,139,250,0.4)',
                }}
              >
                Fill Admin
              </button>
            </div>
          )}

          <div className="mt-6 pt-5 text-center" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-semibold transition-colors"
                style={{ color: '#a78bfa', fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#c4b5fd')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#a78bfa')}
              >
                Create one free →
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
          By signing in, you agree to our{' '}
          <a href="#" style={{ color: 'var(--text-secondary)' }}>Terms</a>
          {' '}and{' '}
          <a href="#" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}


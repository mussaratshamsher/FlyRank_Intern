'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { LeadForgeLogo } from '@/components/ui/logo';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

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
    setLoading(true);

    if (firstName.trim().length < 3) {
      setError('First name must be at least 3 characters');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      await register(email, password, firstName || undefined, lastName || undefined);
      toast('Account created! Welcome to LeadForge 🎉', 'success');
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      toast(err instanceof Error ? err.message : 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Background */}
      <div className="orb orb-violet" style={{ width: 500, height: 500, top: -150, right: -100 }} />
      <div className="orb orb-blue" style={{ width: 400, height: 400, bottom: -80, left: -80 }} />
      <div className="orb orb-indigo" style={{ width: 300, height: 300, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
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
          </Link>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', color: 'var(--text-primary)' }}>
            Create your account
          </h1>
          <p className="text-sm mt-1.5" style={{ color: 'var(--text-muted)' }}>
            Start capturing leads with <span style={{ color: '#a78bfa' }}>LeadForge AI</span> — free forever
          </p>
        </div>

        {/* Perks row */}
        <div className="flex items-center justify-center gap-6 mb-6 animate-fade-up delay-75">
          {['No credit card', '5-min setup', 'Free tier'].map((perk) => (
            <div key={perk} className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" style={{ color: '#a78bfa' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{perk}</span>
            </div>
          ))}
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
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First name"
                placeholder="Alex"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                label="Last name"
                placeholder="Johnson"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <Input
              label="Work email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              helperText="Minimum 8 characters"
            />

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              {loading ? 'Creating account…' : 'Create Free Account →'}
            </Button>
          </form>

          <div className="mt-6 pt-5 text-center" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold transition-colors"
                style={{ color: '#a78bfa', fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#c4b5fd')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#a78bfa')}
              >
                Sign in →
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
          By creating an account, you agree to our{' '}
          <a href="#" style={{ color: 'var(--text-secondary)' }}>Terms of Service</a>
          {' '}and{' '}
          <a href="#" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}


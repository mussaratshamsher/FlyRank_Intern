'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { listOrganizations, listProjects, getLeadStats } from '@/lib/api';
import type { Organization, Project, LeadStats } from '@/types';
import { toast } from '@/components/ui/toast';

function StatCard({
  title,
  value,
  icon,
  badge,
  badgeLabel,
  href,
  delay,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  badge?: string;
  badgeLabel?: string;
  href: string;
  delay: number;
}) {
  return (
    <div
      className={`rounded-xl p-6 card-glow-hover transition-all duration-300 animate-fade-up delay-${delay}`}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
            {title}
          </p>
          <p className="text-4xl font-bold gradient-text" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
            {value}
          </p>
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(99,102,241,0.1))',
            border: '1px solid rgba(139,92,246,0.25)',
          }}
        >
          <span style={{ color: '#a78bfa' }}>{icon}</span>
        </div>
      </div>
      {badge && badgeLabel && (
        <div className="mb-4">
          <Badge variant="violet" size="sm">{badge} {badgeLabel}</Badge>
        </div>
      )}
      <Link href={href}>
        <button
          className="text-xs font-medium transition-colors flex items-center gap-1"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-space-grotesk), sans-serif' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#a78bfa')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          View all
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </Link>
    </div>
  );
}

function QuickActionCard({ title, desc, icon, href, delay }: { title: string; desc: string; icon: React.ReactNode; href: string; delay: number }) {
  return (
    <Link href={href}>
      <div
        className={`rounded-xl p-5 glass-hover card-glow-hover cursor-pointer transition-all duration-300 animate-fade-up delay-${delay} flex items-center gap-4`}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
        }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.18), rgba(99,102,241,0.1))',
            border: '1px solid rgba(139,92,246,0.22)',
          }}
        >
          <span style={{ color: '#a78bfa' }}>{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-space-grotesk), sans-serif' }}>{title}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
        </div>
        <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const orgsData = await listOrganizations();
        setOrgs(orgsData);
        if (orgsData.length > 0) {
          const projectsData = await listProjects(orgsData[0].id);
          setProjects(projectsData);
          if (projectsData.length > 0) {
            try {
              const statsData = await getLeadStats(projectsData[0].id);
              setStats(statsData);
            } catch { /* ignore stats error */ }
          }
        }
      } catch (err) {
        toast(err instanceof Error ? err.message : 'Failed to load dashboard', 'error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <div className="skeleton h-8 w-56 mb-2" />
            <div className="skeleton h-4 w-80" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-36 rounded-xl" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="animate-fade-up">
          <div className="flex items-center gap-2 mb-2">
            <span className="status-live" />
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-space-grotesk), sans-serif' }}>Live Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', color: 'var(--text-primary)' }}>
            Good to see you, <span className="gradient-text">{user?.first_name || 'there'}</span> 👋
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Here&apos;s what&apos;s happening across your LeadForge widgets.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Organizations"
            value={orgs.length}
            href="/dashboard/organizations"
            delay={100}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75" />
              </svg>
            }
          />
          <StatCard
            title="Projects"
            value={projects.length}
            href="/dashboard/projects"
            delay={200}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.3-4.245.464-6.378.464-3.134 0-6.291-.164-9.378-.464C2.487 20.536 1.7 19.593 1.7 18.5v-4.25" />
              </svg>
            }
          />
          <StatCard
            title="Total Leads"
            value={stats?.total || 0}
            badge={`${stats?.qualified || 0}`}
            badgeLabel="qualified"
            href="/dashboard/leads"
            delay={300}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            }
          />
        </div>

        {/* Conversion Rate Banner */}
        {stats && stats.total > 0 && (
          <div
            className="rounded-xl p-4 flex items-center gap-4 animate-fade-up delay-400"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(99,102,241,0.08))',
              border: '1px solid rgba(139,92,246,0.25)',
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(99,102,241,0.15))',
                border: '1px solid rgba(139,92,246,0.3)',
              }}
            >
              <svg className="w-5 h-5" style={{ color: '#a78bfa' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                {stats.conversion_rate.toFixed(1)}% Conversion Rate
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {stats.qualified} qualified out of {stats.total} total leads captured
              </p>
            </div>
            <Badge variant="violet">Live</Badge>
          </div>
        )}

        {/* Empty state */}
        {projects.length === 0 && (
          <div
            className="rounded-2xl p-10 text-center animate-fade-up delay-400"
            style={{
              background: 'var(--bg-card)',
              border: '1px dashed rgba(139,92,246,0.3)',
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(99,102,241,0.08))',
                border: '1px solid rgba(139,92,246,0.25)',
              }}
            >
              <svg className="w-8 h-8" style={{ color: '#7c3aed' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
              No projects yet
            </h3>
            <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Create your first organization and project to start capturing leads with AI-powered widgets.
            </p>
            <Link href="/dashboard/organizations">
              <Button size="lg">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Organization
              </Button>
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        <div className="animate-fade-up delay-500">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'Manage Organizations', desc: 'Create and manage your org structure', href: '/dashboard/organizations', delay: 100, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21" /></svg> },
              { title: 'View Conversations', desc: 'Browse AI conversation logs', href: '/dashboard/conversations', delay: 150, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 013 21V12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg> },
              { title: 'Configure Widget', desc: 'Customize your embed code', href: '/dashboard/widget', delay: 200, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg> },
              { title: 'Review Leads', desc: 'See captured and qualified leads', href: '/dashboard/leads', delay: 250, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg> },
            ].map((action) => (
              <QuickActionCard key={action.href} {...action} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


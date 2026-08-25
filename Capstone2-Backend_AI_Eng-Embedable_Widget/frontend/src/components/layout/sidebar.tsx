'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LeadForgeLogo } from '@/components/ui/logo';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface SidebarProps {
  items: NavItem[];
  orgName?: string;
  onClose?: () => void;
}

export function Sidebar({ items, orgName, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <aside
      className="w-64 h-screen flex flex-col fixed inset-y-0 left-0 z-40"
      style={{
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-default)',
      }}
    >
      {/* Logo */}
      <div className="p-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <Link href="/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
          <div className="group-hover:scale-105 transition-transform duration-200">
            <LeadForgeLogo size={34} />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', color: 'var(--text-primary)' }}>
              Lead<span style={{ background: 'linear-gradient(135deg, #c4b5fd, #818cf8)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Forge</span>
            </h1>
            {orgName
              ? <p className="text-xs truncate max-w-[148px]" style={{ color: 'var(--text-muted)' }}>{orgName}</p>
              : <p className="text-xs" style={{ color: 'var(--text-muted)' }}>AI Lead Platform</p>
            }
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${isActive ? 'is-active' : ''}`}
              style={{
                color: isActive ? '#c4b5fd' : 'var(--text-secondary)',
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(139,92,246,0.08)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <span style={{ color: isActive ? '#a78bfa' : 'var(--text-muted)', flexShrink: 0 }}>
                {item.icon}
              </span>
              {item.label}
              {isActive && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: '#a78bfa', boxShadow: '0 0 6px rgba(124,58,237,0.6)' }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid var(--border-subtle)' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(99,102,241,0.2))',
              border: '1px solid rgba(139,92,246,0.3)',
              color: '#c4b5fd',
              fontFamily: 'var(--font-space-grotesk), sans-serif',
            }}
          >
            LF
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
              LeadForge
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>AI Widget Platform</p>
          </div>
          <div className="status-dot-violet flex-shrink-0" />
        </div>
        {/* Logout Button */}
        <button
          onClick={async () => {
            await logout();
            router.push('/');
          }}
          className="mt-4 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
          style={{
            color: 'var(--text-secondary)',
            background: 'rgba(139,92,246,0.08)',
            fontFamily: 'var(--font-space-grotesk), sans-serif',
          }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 11-4 0v-1m0-8V7a2 2 0 114 0v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

interface MobileNavProps {
  items: NavItem[];
  onClose: () => void;
}

export function MobileNav({ items, onClose }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <div
      className="fixed inset-0 z-50"
      style={{ background: 'rgba(6,6,26,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-64 h-full"
        style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-default)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
            Navigation
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(139,92,246,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${isActive ? 'is-active' : ''}`}
                style={{
                  color: isActive ? '#c4b5fd' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-space-grotesk), sans-serif',
                }}
              >
                <span style={{ color: isActive ? '#a78bfa' : 'var(--text-muted)' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}


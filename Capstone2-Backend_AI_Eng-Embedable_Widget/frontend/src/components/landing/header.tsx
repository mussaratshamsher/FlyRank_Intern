"use client"
import Link from 'next/link';
import { LeadForgeLogo } from '@/components/ui/logo';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }
  if (pathname?.startsWith('/register')) {
    return null;
  }
  if (pathname?.startsWith('/login')) {
    return null;
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled || mobileMenuOpen ? 'rgba(6,6,26,0.95)' : 'transparent',
        backdropFilter: scrolled || mobileMenuOpen ? 'blur(20px)' : 'none',
        borderBottom: scrolled || mobileMenuOpen ? '1px solid rgba(139,92,246,0.15)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="logo-glow animate-float" style={{ animationDelay: '0s', animationDuration: '4s' }}>
            <LeadForgeLogo size={36} />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', color: 'var(--text-primary)' }}>
              Lead<span className="gradient-text">Forge</span>
            </span>
            <div className="text-xs" style={{ color: 'var(--text-muted)', lineHeight: 1 }}>AI Lead Platform</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'How it Works', 'Pricing'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <button
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-space-grotesk), sans-serif' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(139,92,246,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
            >
              Sign In
            </button>
          </Link>
          <Link href="/register">
            <button className="btn-brand px-5 py-2.5 text-sm rounded-xl font-semibold">
              Get Started Free
            </button>
          </Link>
        </div>
        
        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[rgba(139,92,246,0.15)] bg-[rgba(6,6,26,0.95)]">
          <div className="px-4 pt-2 pb-6 space-y-4 shadow-xl">
            <nav className="flex flex-col space-y-4 pt-4">
              {['Features', 'How it Works', 'Pricing'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium px-2 py-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3 pt-4 border-t border-[rgba(255,255,255,0.05)]">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <button
                  className="w-full px-4 py-2 text-sm font-medium rounded-lg text-center"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Sign In
                </button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <button className="btn-brand w-full px-5 py-2.5 text-sm rounded-xl font-semibold">
                  Get Started Free
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  getAdminStats,
  getAdminOrganizations,
  getAdminProjects,
  getAdminUsers,
  adminDeleteOrganization,
  adminDeleteProject,
} from '@/lib/api';
import type { AdminStats, AdminOrganization, AdminProject, AdminUser } from '@/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'organizations' | 'projects' | 'users'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [organizations, setOrganizations] = useState<AdminOrganization[]>([]);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Search queries
  const [orgSearch, setOrgSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    type: 'organization' | 'project';
    id: string;
    name: string;
  }>({ open: false, type: 'organization', id: '', name: '' });
  const [deleting, setDeleting] = useState(false);

  // Check admin authorization
  useEffect(() => {
    if (!isLoading && user) {
      const isAdmin = user.is_superadmin || user.role === 'admin' || user.email === 'leadforge@gmail.com';
      if (!isAdmin) {
        toast('Access denied. Administrator privileges required.', 'error');
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, orgsData, projectsData, usersData] = await Promise.all([
        getAdminStats(),
        getAdminOrganizations(),
        getAdminProjects(),
        getAdminUsers(),
      ]);
      setStats(statsData);
      setOrganizations(orgsData);
      setProjects(projectsData);
      setUsers(usersData);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to load admin metrics', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && (user.is_superadmin || user.role === 'admin' || user.email === 'leadforge@gmail.com')) {
      loadAdminData();
    }
  }, [user, loadAdminData]);

  // Handle Admin Delete
  async function confirmDelete() {
    if (!deleteModal.id) return;
    setDeleting(true);
    try {
      if (deleteModal.type === 'organization') {
        await adminDeleteOrganization(deleteModal.id);
        setOrganizations((prev) => prev.filter((o) => o.id !== deleteModal.id));
        // Also remove projects associated with this org
        setProjects((prev) => prev.filter((p) => p.organization_id !== deleteModal.id));
        toast(`Organization "${deleteModal.name}" deleted`, 'success');
      } else {
        await adminDeleteProject(deleteModal.id);
        setProjects((prev) => prev.filter((p) => p.id !== deleteModal.id));
        toast(`Project "${deleteModal.name}" deleted`, 'success');
      }
      setDeleteModal({ open: false, type: 'organization', id: '', name: '' });
      // Refresh stats
      const newStats = await getAdminStats();
      setStats(newStats);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to delete resource', 'error');
    } finally {
      setDeleting(false);
    }
  }

  // Filtered lists
  const filteredOrgs = organizations.filter(
    (o) =>
      o.name.toLowerCase().includes(orgSearch.toLowerCase()) ||
      o.slug.toLowerCase().includes(orgSearch.toLowerCase()) ||
      (o.owner_email && o.owner_email.toLowerCase().includes(orgSearch.toLowerCase()))
  );

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      (p.organization_name && p.organization_name.toLowerCase().includes(projectSearch.toLowerCase())) ||
      (p.owner_email && p.owner_email.toLowerCase().includes(projectSearch.toLowerCase())) ||
      p.website_url.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.first_name && u.first_name.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.last_name && u.last_name.toLowerCase().includes(userSearch.toLowerCase()))
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="skeleton h-10 w-72 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-28 rounded-xl" />
            ))}
          </div>
          <div className="skeleton h-96 rounded-2xl mt-8" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-up">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                Superadmin Mode
              </span>
              <span className="text-xs text-zinc-400">System-wide Control Plane</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
              Global <span className="gradient-text">Admin Dashboard</span>
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Monitor, audit, and manage all organizations, projects, leads, and users across LeadForge.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={loadAdminData} size="sm">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Refresh
            </Button>
            <Link href="/dashboard">
              <Button variant="secondary" size="sm">
                Go to Personal Dashboard →
              </Button>
            </Link>
          </div>
        </div>

        {/* Global Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            {
              label: 'Organizations',
              value: stats?.total_organizations ?? organizations.length,
              icon: (
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75" />
                </svg>
              ),
            },
            {
              label: 'Projects',
              value: stats?.total_projects ?? projects.length,
              icon: (
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.3-4.245.464-6.378.464-3.134 0-6.291-.164-9.378-.464C2.487 20.536 1.7 19.593 1.7 18.5v-4.25" />
                </svg>
              ),
            },
            {
              label: 'Users',
              value: stats?.total_users ?? users.length,
              icon: (
                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              ),
            },
            {
              label: 'Captured Leads',
              value: stats?.total_leads ?? 0,
              icon: (
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              ),
            },
            {
              label: 'Conversations',
              value: stats?.total_conversations ?? 0,
              icon: (
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 013 21V12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              ),
            },
            {
              label: 'Messages',
              value: stats?.total_messages ?? 0,
              icon: (
                <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v7.018z" />
                </svg>
              ),
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl flex flex-col justify-between"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-400 font-medium">{item.label}</span>
                {item.icon}
              </div>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Admin Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          {[
            { id: 'overview', label: 'All Organizations & Projects' },
            { id: 'organizations', label: `Organizations (${organizations.length})` },
            { id: 'projects', label: `Projects (${projects.length})` },
            { id: 'users', label: `Users (${users.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-lg shadow-purple-900/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
              }`}
              style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview (Both Orgs and Projects side by side or full list) */}
        {(activeTab === 'overview' || activeTab === 'organizations') && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                  All Platform Organizations
                </h2>
                <p className="text-xs text-zinc-400">Total {organizations.length} organizations created by all users</p>
              </div>
              <div className="w-full sm:w-72">
                <Input
                  placeholder="Search org, slug, owner..."
                  value={orgSearch}
                  onChange={(e) => setOrgSearch(e.target.value)}
                />
              </div>
            </div>

            {filteredOrgs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-10 text-zinc-400">
                  No organizations found matching search query.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredOrgs.map((org) => (
                  <Card key={org.id} hover className="flex flex-col justify-between">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-lg text-white">{org.name}</CardTitle>
                          <span className="text-xs text-purple-400 font-mono">@{org.slug}</span>
                        </div>
                        <Badge variant={org.is_active ? 'success' : 'default'}>
                          {org.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2 mt-2 text-zinc-400 text-xs">
                        {org.description || 'No description provided'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1.5 text-xs text-zinc-400">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500">Owner:</span>
                          <span className="text-zinc-200 font-medium truncate max-w-[180px]">{org.owner_email || 'None'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500">Projects Count:</span>
                          <span className="text-purple-300 font-bold">{org.project_count}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500">Created:</span>
                          <span>{new Date(org.created_at).toLocaleDateString()}</span>
                        </div>
                        {org.website_url && (
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-500">Website:</span>
                            <a href={org.website_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline truncate max-w-[180px]">
                              {org.website_url}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteModal({ open: true, type: 'organization', id: org.id, name: org.name })}
                        >
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          Delete Org
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Projects */}
        {(activeTab === 'overview' || activeTab === 'projects') && (
          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                  All Platform Projects
                </h2>
                <p className="text-xs text-zinc-400">Total {projects.length} AI widget projects created across all accounts</p>
              </div>
              <div className="w-full sm:w-72">
                <Input
                  placeholder="Search project, org, owner..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                />
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              <Card>
                <CardContent className="text-center py-10 text-zinc-400">
                  No projects found matching search query.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.map((p) => (
                  <Card key={p.id} hover className="flex flex-col justify-between">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-lg text-white">{p.name}</CardTitle>
                          <span className="text-xs text-indigo-400 font-medium">Org: {p.organization_name || 'N/A'}</span>
                        </div>
                        <Badge variant={p.status === 'active' ? 'success' : 'default'}>
                          {p.status}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2 mt-1 text-zinc-400 text-xs">
                        {p.description || 'No description'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1.5 text-xs text-zinc-400">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500">Owner:</span>
                          <span className="text-zinc-200 font-medium truncate max-w-[180px]">{p.owner_email || 'None'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500">Website:</span>
                          <a href={p.website_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline truncate max-w-[180px]">
                            {p.website_url}
                          </a>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500">Captured Leads:</span>
                          <span className="text-emerald-300 font-semibold">{p.lead_count}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500">Conversations:</span>
                          <span className="text-amber-300 font-semibold">{p.conversation_count}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500">API Key:</span>
                          <span className="font-mono text-zinc-400">{p.api_key.slice(0, 8)}...</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <Link href={`/dashboard/widget?project=${p.id}`}>
                          <Button size="sm" variant="secondary">
                            Preview
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteModal({ open: true, type: 'project', id: p.id, name: p.name })}
                        >
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          Delete Project
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Users */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                  Registered Users
                </h2>
                <p className="text-xs text-zinc-400">Total {users.length} accounts on the platform</p>
              </div>
              <div className="w-full sm:w-72">
                <Input
                  placeholder="Search by email, name..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-300">
                  <thead className="text-xs uppercase bg-zinc-900/80 text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="px-5 py-3.5">User</th>
                      <th className="px-5 py-3.5">Email</th>
                      <th className="px-5 py-3.5">Role</th>
                      <th className="px-5 py-3.5">Plan</th>
                      <th className="px-5 py-3.5">Registered</th>
                      <th className="px-5 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-white">
                          {u.first_name || u.last_name ? `${u.first_name || ''} ${u.last_name || ''}` : 'LeadForge User'}
                        </td>
                        <td className="px-5 py-3.5 text-zinc-300 font-mono text-xs">{u.email}</td>
                        <td className="px-5 py-3.5">
                          {u.is_superadmin || u.email === 'leadforge@gmail.com' ? (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/40">
                              Admin
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-zinc-800 text-zinc-300">
                              User
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 uppercase text-xs font-bold text-purple-300">{u.plan}</td>
                        <td className="px-5 py-3.5 text-xs text-zinc-400">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td className="px-5 py-3.5">
                          <Badge variant={u.is_active ? 'success' : 'default'} size="sm">
                            {u.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl space-y-4 animate-scale-up">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                  Admin Delete Confirmation
                </h3>
                <p className="text-sm text-zinc-400 mt-2">
                  Are you sure you want to permanently delete this {deleteModal.type}: <br />
                  <strong className="text-red-300 font-semibold">{deleteModal.name}</strong>?
                </p>
                <p className="text-xs text-zinc-500 mt-2">
                  This administrative action cannot be undone and will delete all related sub-resources.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="danger"
                  className="w-full"
                  loading={deleting}
                  onClick={confirmDelete}
                >
                  Yes, Delete {deleteModal.type}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  disabled={deleting}
                  onClick={() => setDeleteModal({ open: false, type: 'organization', id: '', name: '' })}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

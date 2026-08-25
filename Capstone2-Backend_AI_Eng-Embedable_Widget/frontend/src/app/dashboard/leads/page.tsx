'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TableSkeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toast';
import { getLeads, getLeadStats, updateLeadStatus } from '@/lib/api';
import type { Lead, LeadStats, LeadStatusValue } from '@/types';

const statusColors: Record<LeadStatusValue, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  new: 'info',
  contacted: 'warning',
  qualified: 'success',
  converted: 'success',
  lost: 'danger',
};

function LeadsContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project') || '';
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  const loadData = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const [leadsData, statsData] = await Promise.all([
        getLeads(projectId, { status: filter || undefined }),
        getLeadStats(projectId),
      ]);
      setLeads(leadsData);
      setStats(statsData);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to load leads', 'error');
    } finally {
      setLoading(false);
    }
  }, [projectId, filter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleStatusChange(id: string, status: LeadStatusValue) {
    try {
      const updated = await updateLeadStatus(id, status);
      setLeads(leads.map((l) => l.id === id ? updated : l));
      toast('Lead status updated', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to update status', 'error');
    }
  }

  if (!projectId) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-white mb-4">Select a Project</h2>
          <p className="text-zinc-400 mb-6">Choose a project from the dashboard to view leads.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Leads</h1>
          <p className="text-zinc-400">Manage and qualify your captured leads</p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-zinc-400">Total Leads</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-zinc-400">Qualified</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#a78bfa' }}>{stats.qualified}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-zinc-400">Conversion Rate</p>
                <p className="text-2xl font-bold text-sky-400 mt-1">{stats.conversion_rate.toFixed(1)}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-zinc-400">Avg Score</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">{stats.average_score.toFixed(0)}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Input
            placeholder="Filter by status..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-xs"
          />
          <div className="flex gap-2">
            {['', 'new', 'contacted', 'qualified', 'converted', 'lost'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === s ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={8} />
        ) : leads.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-zinc-400">No leads found for this project.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="pb-3 pt-4 px-4 text-zinc-400 font-medium">Name</th>
                    <th className="pb-3 pt-4 px-4 text-zinc-400 font-medium">Email</th>
                    <th className="pb-3 pt-4 px-4 text-zinc-400 font-medium">Company</th>
                    <th className="pb-3 pt-4 px-4 text-zinc-400 font-medium">Score</th>
                    <th className="pb-3 pt-4 px-4 text-zinc-400 font-medium">Status</th>
                    <th className="pb-3 pt-4 px-4 text-zinc-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-4 text-white font-medium">{lead.name || 'Unknown'}</td>
                      <td className="py-3 px-4 text-zinc-400">{lead.email || '-'}</td>
                      <td className="py-3 px-4 text-zinc-400">{lead.company || '-'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white rounded-full"
                              style={{ width: `${lead.intent_score}%` }}
                            />
                          </div>
                          <span className="text-xs text-zinc-400">{lead.intent_score}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusColors[lead.status]}>{lead.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatusValue)}
                          className="h-8 px-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<DashboardLayout><TableSkeleton rows={8} /></DashboardLayout>}>
      <LeadsContent />
    </Suspense>
  );
}


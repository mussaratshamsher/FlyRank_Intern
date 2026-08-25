'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/toast';
import { createOrganization, listOrganizations } from '@/lib/api';
import type { Organization } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function OrganizationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', website_url: '' });

  const loadOrgs = useCallback(async () => {
    try {
      const data = await listOrganizations();
      setOrgs(data);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to load organizations', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrgs();
  }, [loadOrgs]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const org = await createOrganization({
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        website_url: formData.website_url || undefined,
      });
      setOrgs([org, ...orgs]);
      setFormData({ name: '', slug: '', description: '', website_url: '' });
      setShowForm(false);
      toast('Organization created', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to create organization', 'error');
    } finally {
      setCreating(false);
    }
  }

  const isFreePlan = !user?.plan || user.plan === 'free';
  const hasReachedLimit = isFreePlan && orgs.length >= 1;

  const handleNewOrganizationClick = () => {
    if (hasReachedLimit) {
      router.push('/pricing');
    } else {
      setShowForm(!showForm);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Organizations</h1>
            <p className="text-zinc-400">Manage your organizations and teams</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handleNewOrganizationClick}>
              {showForm && !hasReachedLimit ? 'Cancel' : 'New Organization'}
            </Button>
          </div>
        </div>

        {isFreePlan && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-500 font-medium text-center">
              On free tier you are allowed to create a single organization and single project. Purchase a plan to create more.
            </p>
          </div>
        )}

        {showForm && !hasReachedLimit && (
          <Card>
            <form onSubmit={handleCreate} className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Create Organization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Organization Name"
                  placeholder="Acme Inc"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Slug"
                  placeholder="acme-inc"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  helperText="Lowercase, hyphens only"
                  required
                />
              </div>
              <Input
                label="Website URL"
                placeholder="https://acme.com"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              />
              <Input
                label="Description"
                placeholder="Brief description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div className="flex gap-3">
                <Button type="submit" loading={creating}>Create</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}><div className="h-32 bg-zinc-800/50 rounded-lg animate-pulse" /></Card>
            ))}
          </div>
        ) : orgs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-zinc-400">No organizations yet. Create your first one above.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orgs.map((org) => (
              <Card key={org.id} hover>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{org.name}</CardTitle>
                      <CardDescription>{org.description || 'No description'}</CardDescription>
                    </div>
                    <Badge variant={org.is_active ? 'success' : 'default'}>
                      {org.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.662 1.662m0 0L15 12m0 0l-1.622-1.622m0 0a4.5 4.5 0 00-1.662 1.662m0 0L11 12m0 0l1.622-1.622m0 0a4.5 4.5 0 001.662-1.662m0 0L15 12m0 0l-1.622-1.622" />
                      </svg>
                      <span className="truncate">{org.website_url || 'No website'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      <span>Created {new Date(org.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


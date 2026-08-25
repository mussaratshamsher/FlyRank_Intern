'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/toast';
import { listOrganizations, createProject, listProjects, deleteProject, regenerateApiKey } from '@/lib/api';
import type { Organization, Project, ProjectStatusValue } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const statusColors: Record<ProjectStatusValue, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  draft: 'default',
  active: 'success',
  paused: 'warning',
  archived: 'danger',
};

export default function ProjectsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', website_url: '', description: '', ai_instructions: '', welcome_message: '', business_type: '' });

  const loadOrgs = useCallback(async () => {
    try {
      const data = await listOrganizations();
      setOrgs(data);
      if (data.length > 0) setSelectedOrg(data[0].id);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to load organizations', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProjects = useCallback(async (orgId: string) => {
    try {
      const data = await listProjects(orgId);
      setProjects(data);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to load projects', 'error');
    }
  }, []);

  useEffect(() => {
    loadOrgs();
  }, [loadOrgs]);

  useEffect(() => {
    if (selectedOrg) {
      loadProjects(selectedOrg);
    }
  }, [selectedOrg, loadProjects]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrg) return;
    setCreating(true);
    try {
      const project = await createProject(selectedOrg, {
        name: formData.name,
        website_url: formData.website_url,
        description: formData.description || undefined,
        business_type: formData.business_type || undefined,
        ai_instructions: formData.ai_instructions || undefined,
        welcome_message: formData.welcome_message || undefined,
      });
      setProjects([project, ...projects]);
      setFormData({ name: '', website_url: '', description: '', ai_instructions: '', welcome_message: '', business_type: '' });
      setShowForm(false);
      toast('Project created', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to create project', 'error');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure? This will delete the project.')) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
      toast('Project deleted', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to delete project', 'error');
    }
  }

  async function handleRegenerateKey(id: string) {
    try {
      const updated = await regenerateApiKey(id);
      setProjects(projects.map((p) => p.id === id ? updated : p));
      toast('API key regenerated', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to regenerate API key', 'error');
    }
  }

  const isFreePlan = !user?.plan || user.plan === 'free';
  const hasReachedLimit = isFreePlan && projects.length >= 1;

  const handleNewProjectClick = () => {
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
            <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
            <p className="text-zinc-400">Manage your AI widget projects</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handleNewProjectClick}>
              {showForm && !hasReachedLimit ? 'Cancel' : 'New Project'}
            </Button>
          </div>
        </div>

        {isFreePlan && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-2">
            <p className="text-sm text-yellow-500 font-medium text-center">
              On free tier you are allowed to create a single organization and single project. Purchase a plan to create more.
            </p>
          </div>
        )}

        {orgs.length > 0 && (
          <div className="flex items-center gap-3">
            <label className="text-sm text-zinc-400">Organization:</label>
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              {orgs.map((org) => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>
        )}

        {showForm && selectedOrg && !hasReachedLimit && (
          <Card>
            <form onSubmit={handleCreate} className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Create Project</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Project Name"
                  placeholder="My Widget"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Website URL"
                  placeholder="https://example.com"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Business Type"
                placeholder="SaaS, E-commerce, etc."
                value={formData.business_type}
                onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
              />
              <Textarea
                label="Description"
                placeholder="What is this project about?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Textarea
                label="AI Instructions"
                placeholder="Custom instructions for the AI..."
                value={formData.ai_instructions}
                onChange={(e) => setFormData({ ...formData, ai_instructions: e.target.value })}
              />
              <Input
                label="Welcome Message"
                placeholder="Hello! How can I help you today?"
                value={formData.welcome_message}
                onChange={(e) => setFormData({ ...formData, welcome_message: e.target.value })}
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
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-zinc-400">No projects yet. Create your first project above.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} hover>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>{project.description || 'No description'}</CardDescription>
                    </div>
                    <Badge variant={statusColors[project.status]}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.662 1.662m0 0L15 12m0 0l-1.622-1.622m0 0a4.5 4.5 0 00-1.662 1.662m0 0L11 12m0 0l1.622-1.622m0 0a4.5 4.5 0 001.662-1.662m0 0L15 12m0 0l-1.622-1.622" />
                      </svg>
                      <span className="truncate">{project.website_url}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.747M15.75 5.25v10.5m0 0l-3-3m3 3l3-3" />
                      </svg>
                      <span className="font-mono text-xs">{project.api_key.slice(0, 8)}...{project.api_key.slice(-4)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Link href={`/dashboard/widget?project=${project.id}`}>
                        <Button size="sm" variant="secondary">Preview</Button>
                      </Link>
                      <Link href={`/dashboard/leads?project=${project.id}`}>
                        <Button size="sm" variant="ghost">Leads</Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/+$/, '');
                          const embedCode = '<' + `script src="${baseUrl}/api/widget/script.js?api_key=${project.api_key}" async></` + 'script>';
                          navigator.clipboard.writeText(embedCode);
                          toast('Embed snippet copied to clipboard!', 'success');
                        }}
                      >
                        Copy Embed Script
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleRegenerateKey(project.id)}>Regen Key</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(project.id)}>Delete</Button>
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

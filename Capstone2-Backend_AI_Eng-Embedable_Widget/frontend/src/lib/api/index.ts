import { apiPost, apiGet, apiPatch, apiDelete } from './client';
import type { User, TokenResponse, Organization, Project, Conversation, Message, Lead, LeadStats } from '@/types';

export async function register(data: { email: string; password: string; first_name?: string; last_name?: string }): Promise<TokenResponse> {
  return apiPost<TokenResponse>('/api/auth/register', data);
}

export async function login(data: { email: string; password: string }): Promise<TokenResponse> {
  return apiPost<TokenResponse>('/api/auth/login', data);
}

export async function getMe(): Promise<User> {
  return apiGet<User>('/api/auth/me');
}

export async function logout(): Promise<{ message: string; user_id: string }> {
  return apiPost<{ message: string; user_id: string }>('/api/auth/logout');
}

export async function createOrganization(data: { name: string; slug: string; description?: string; website_url?: string; logo_url?: string }): Promise<Organization> {
  return apiPost<Organization>('/api/organizations', data);
}

export async function listOrganizations(): Promise<Organization[]> {
  return apiGet<Organization[]>('/api/organizations');
}

export async function getOrganization(id: string): Promise<Organization> {
  return apiGet<Organization>(`/api/organizations/${id}`);
}

export async function updateOrganization(id: string, data: Partial<{ name: string; description: string; website_url: string; logo_url: string }>): Promise<Organization> {
  return apiPatch<Organization>(`/api/organizations/${id}`, data);
}

export async function deleteOrganization(id: string): Promise<void> {
  return apiDelete(`/api/organizations/${id}`);
}

export async function createProject(organizationId: string, data: { name: string; website_url: string; description?: string; business_type?: string; ai_instructions?: string; welcome_message?: string }): Promise<Project> {
  return apiPost<Project>(`/api/projects?organization_id=${organizationId}`, data);
}

export async function listProjects(organizationId: string): Promise<Project[]> {
  return apiGet<Project[]>(`/api/projects?organization_id=${organizationId}`);
}

export async function getProject(id: string): Promise<Project> {
  return apiGet<Project>(`/api/projects/${id}`);
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  return apiPatch<Project>(`/api/projects/${id}`, data);
}

export async function deleteProject(id: string): Promise<void> {
  return apiDelete(`/api/projects/${id}`);
}

export async function regenerateApiKey(id: string): Promise<Project> {
  return apiPost<Project>(`/api/projects/${id}/regenerate-api-key`);
}

export async function getLeads(projectId: string, params?: { status?: string; qualified_only?: boolean; limit?: number; offset?: number }): Promise<Lead[]> {
  return apiGet<Lead[]>(`/api/leads?project_id=${projectId}`, params);
}

export async function getLead(id: string): Promise<Lead> {
  return apiGet<Lead>(`/api/leads/${id}`);
}

export async function updateLead(id: string, data: Partial<Lead>): Promise<Lead> {
  return apiPatch<Lead>(`/api/leads/${id}`, data);
}

export async function updateLeadStatus(id: string, status: string): Promise<Lead> {
  return apiPost<Lead>(`/api/leads/${id}/status`, { status });
}

export async function getLeadStats(projectId: string): Promise<LeadStats> {
  return apiGet<LeadStats>(`/api/leads/stats/project/${projectId}`);
}

export async function getConversations(projectId: string, params?: { limit?: number; offset?: number }): Promise<Conversation[]> {
  return apiGet<Conversation[]>(`/api/conversations?project_id=${projectId}`, params);
}

export async function getConversation(id: string): Promise<Conversation> {
  return apiGet<Conversation>(`/api/conversations/${id}`);
}

export async function getConversationMessages(conversationId: string, limit = 50): Promise<Message[]> {
  return apiGet<Message[]>(`/api/conversations/${conversationId}/messages`, { limit });
}

export async function createWidgetSession(data: { project_api_key: string; visitor_identifier: string }): Promise<{ visitor_id: string; conversation_id: string; created_at: string }> {
  return apiPost<{ visitor_id: string; conversation_id: string; created_at: string }>('/api/widget/session', data);
}

export async function getWidgetMessages(conversationId: string, apiKey: string, limit = 20): Promise<Message[]> {
  return apiGet<Message[]>(`/api/widget/conversations/${conversationId}/messages`, { project_api_key: apiKey, limit });
}

export async function sendWidgetMessage(conversationId: string, apiKey: string, content: string): Promise<Message> {
  return apiPost<Message>(`/api/widget/conversations/${conversationId}/messages?project_api_key=${apiKey}`, { content });
}

// Admin API
export async function getAdminStats(): Promise<import('@/types').AdminStats> {
  return apiGet<import('@/types').AdminStats>('/api/admin/stats');
}

export async function getAdminOrganizations(): Promise<import('@/types').AdminOrganization[]> {
  return apiGet<import('@/types').AdminOrganization[]>('/api/admin/organizations');
}

export async function getAdminProjects(): Promise<import('@/types').AdminProject[]> {
  return apiGet<import('@/types').AdminProject[]>('/api/admin/projects');
}

export async function getAdminUsers(): Promise<import('@/types').AdminUser[]> {
  return apiGet<import('@/types').AdminUser[]>('/api/admin/users');
}

export async function adminDeleteOrganization(id: string): Promise<void> {
  return apiDelete(`/api/admin/organizations/${id}`);
}

export async function adminDeleteProject(id: string): Promise<void> {
  return apiDelete(`/api/admin/projects/${id}`);
}

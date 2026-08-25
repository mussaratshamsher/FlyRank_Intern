export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_active: boolean;
  is_superadmin?: boolean;
  role?: string;
  plan?: string;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

export interface AdminStats {
  total_users: number;
  total_organizations: number;
  total_projects: number;
  total_leads: number;
  total_conversations: number;
  total_messages: number;
}

export interface AdminOrganization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website_url: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  owner_email: string | null;
  owner_name: string | null;
  project_count: number;
}

export interface AdminProject {
  id: string;
  organization_id: string;
  organization_name: string | null;
  name: string;
  website_url: string;
  description: string | null;
  business_type: string | null;
  status: string;
  api_key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  lead_count: number;
  conversation_count: number;
  owner_email: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_active: boolean;
  is_superadmin: boolean;
  plan: string;
  created_at: string;
  last_login: string | null;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website_url: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  member_count?: number;
}

export interface OrganizationCreate {
  name: string;
  slug: string;
  description?: string;
  website_url?: string;
  logo_url?: string;
}

export interface ProjectStatus {
  DRAFT: 'draft';
  ACTIVE: 'active';
  PAUSED: 'paused';
  ARCHIVED: 'archived';
}

export type ProjectStatusValue = 'draft' | 'active' | 'paused' | 'archived';

export interface Project {
  id: string;
  organization_id: string;
  name: string;
  website_url: string;
  description: string | null;
  business_type: string | null;
  ai_instructions: string | null;
  welcome_message: string | null;
  status: ProjectStatusValue;
  api_key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  conversation_count?: number;
  lead_count?: number;
}

export interface ProjectCreate {
  name: string;
  website_url: string;
  description?: string;
  business_type?: string;
  ai_instructions?: string;
  welcome_message?: string;
}

export interface ProjectUpdate {
  name?: string;
  website_url?: string;
  description?: string;
  business_type?: string;
  ai_instructions?: string;
  welcome_message?: string;
  status?: ProjectStatusValue;
}

export interface ConversationStatus {
  ACTIVE: 'active';
  CLOSED: 'closed';
  ARCHIVED: 'archived';
}

export type ConversationStatusValue = 'active' | 'closed' | 'archived';

export interface Conversation {
  id: string;
  project_id: string;
  visitor_id: string;
  status: ConversationStatusValue;
  created_at: string;
  updated_at: string;
  message_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface LeadStatus {
  NEW: 'new';
  CONTACTED: 'contacted';
  QUALIFIED: 'qualified';
  CONVERTED: 'converted';
  LOST: 'lost';
}

export type LeadStatusValue = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export interface Lead {
  id: string;
  project_id: string;
  visitor_id: string;
  conversation_id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: LeadStatusValue;
  project_type: string | null;
  budget: string | null;
  timeline: string | null;
  intent_score: number;
  is_qualified: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  last_contacted_at: string | null;
}

export interface LeadStats {
  total: number;
  qualified: number;
  conversion_rate: number;
  by_status: Record<string, number>;
  average_score: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: string | null;
  };
}

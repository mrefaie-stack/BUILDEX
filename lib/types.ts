// =============================================================
// Shared domain types
// =============================================================

export type SelectedPath = 'dominate' | 'loss' | null;

export type LevelKey =
  | 'gate'
  | 'calculator'
  | 'level-1'
  | 'level-2'
  | 'level-3'
  | 'level-4'
  | 'level-5'
  | 'booking'
  | 'confirmation';

export interface Weapon {
  id: string;
  name: string;
  weaponTitle: string;
  shortLine: string;
  description: string;
  features: string[];
  duration: string;
  priceRange: string;
  expectedResult: string;
  icon: string;
  accent?: 'blue' | 'gold' | 'red' | 'cyan' | 'green' | 'orange';
}

export interface BattleResult {
  label: string;
  value: string;
  direction?: 'up' | 'down' | 'neutral';
}

export interface Battle {
  id: string;
  code: string;
  title: string;
  client: string;
  city: string;
  service: string;
  duration: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  results: BattleResult[];
  pin: { x: number; y: number };
  before?: { label: string; metric: string };
  after?: { label: string; metric: string };
}

export interface Package {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  oldPrice?: number;
  currency: string;
  cycle: string;
  popular?: boolean;
  features: string[];
  ctaLabel: string;
}

export interface BuilderService {
  id: string;
  label: string;
  monthly: number;
  description?: string;
}

export interface SocialProofMessage {
  id: string;
  text: string;
  city?: string;
}

export interface City {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface LeadPayload {
  visitor_id?: string | null;
  name?: string | null;
  phone: string;
  city?: string | null;
  company_type?: string | null;
  selected_package?: string | null;
  selected_services?: unknown;
  calculator_result?: number | null;
  source?: string | null;
  message?: string | null;
}

export interface VisitorEventPayload {
  visitor_id: string;
  event_name: string;
  page?: string | null;
  metadata?: Record<string, unknown> | null;
}

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'interested'
  | 'follow_up'
  | 'converted'
  | 'rejected';

export interface LeadRecord {
  id: string;
  visitor_id: string | null;
  name: string | null;
  phone: string;
  city: string | null;
  company_type: string | null;
  selected_package: string | null;
  selected_services: unknown;
  calculator_result: number | null;
  source: string | null;
  message: string | null;
  status: LeadStatus;
  created_at: string;
}

export interface VisitorEventRecord {
  id: string;
  visitor_id: string;
  event_name: string;
  page: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

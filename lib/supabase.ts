import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate environment variables and create client safely
// During build time, if env vars are missing, return a mock client to prevent build failures
const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

// Only create client if env vars are valid
// This prevents build failures when env vars are missing
export const supabase = isValidUrl(supabaseUrl) && supabaseAnonKey.length > 0
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type Article = {
  id: string;
  source_id: string;
  category_id: string;
  title: string;
  original_content: string | null;
  ai_summary: string | null;
  verification_status: 'confirmed' | 'developing' | 'unverified';
  source_url: string;
  published_at: string;
  approved: boolean;
  is_breaking: boolean;
  image_url: string | null;
  video_url: string | null;
  severity: 'critical' | 'high' | 'medium' | 'low';
  created_at: string;
  updated_at: string;
  source?: Source;
  category?: Category;
};

export type Source = {
  id: string;
  name: string;
  url: string;
  rss_feed_url: string | null;
  logo_url: string | null;
  active: boolean;
  last_fetched_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  created_at: string;
};

export type MapEvent = {
  id: string;
  article_id: string;
  latitude: number;
  longitude: number;
  event_type: 'strike' | 'military_movement' | 'conflict_location' | 'diplomatic';
  location_name: string;
  created_at: string;
  article?: Article;
};

export type EscalationEvent = {
  id: string;
  event_type: 'missile_launch' | 'airstrike' | 'drone_strike' | 'ground_operation' | 'naval_activity' | 'diplomatic' | 'ceasefire' | 'other';
  severity: number;
  location: string;
  description: string;
  verified: boolean;
  article_id: string | null;
  created_at: string;
};

export type EscalationLevel = {
  id: string;
  region: string;
  level: 'low' | 'military_activity' | 'major_strikes' | 'regional_war';
  level_score: number;
  last_updated: string;
  updated_at: string;
};

export type Alert = {
  id: string;
  title: string;
  message: string;
  alert_type: 'missile' | 'airstrike' | 'diplomatic' | 'ceasefire' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  sent: boolean;
  article_id: string | null;
  created_at: string;
};

export type DailyBriefing = {
  id: string;
  briefing_date: string;
  summary: string;
  key_events: any[];
  military_movements: string | null;
  diplomatic_updates: string | null;
  potential_developments: string | null;
  confirmed_count: number;
  developing_count: number;
  created_at: string;
};

export type RiskAssessment = {
  id: string;
  country: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_score: number;
  factors: string[];
  last_updated: string;
  updated_at: string;
};

export type CivilianSafety = {
  id: string;
  region: string;
  alert_type: 'shelter' | 'evacuation' | 'emergency' | 'safe_zone';
  title: string;
  description: string;
  coordinates: any;
  contact_numbers: any;
  active: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
};

export type OsintPost = {
  id: string;
  source_type: 'twitter' | 'telegram' | 'official' | 'analyst';
  author: string;
  author_verified: boolean;
  content: string;
  media_url: string | null;
  post_url: string;
  reliability_score: number;
  published_at: string;
  created_at: string;
};

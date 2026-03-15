import { supabase } from './supabase';
import { apiCache } from './api-cache';
import type { Article, Category, Source, MapEvent, EscalationEvent, Alert, DailyBriefing, RiskAssessment, CivilianSafety, OsintPost } from './supabase';

const CACHE_TIMES = {
  ARTICLES: 2 * 60 * 1000,
  CATEGORIES: 10 * 60 * 1000,
  SOURCES: 10 * 60 * 1000,
  MAP_EVENTS: 3 * 60 * 1000,
  ESCALATION: 1 * 60 * 1000,
  ALERTS: 30 * 1000,
  BRIEFING: 30 * 60 * 1000,
  RISK: 5 * 60 * 1000,
  SAFETY: 2 * 60 * 1000,
  OSINT: 1 * 60 * 1000,
};

export async function getArticlesWithCache(options: {
  limit?: number;
  category?: string;
  approved?: boolean;
} = {}) {
  const cacheKey = `articles_${JSON.stringify(options)}`;
  const cached = apiCache.get<Article[]>(cacheKey);

  if (cached) return { data: cached, error: null, fromCache: true };

  if (!supabase) return { data: [], error: null, fromCache: false };

  let query = supabase
    .from('articles')
    .select('*, source:sources(*), category:categories(*)')
    .order('published_at', { ascending: false });

  if (options.limit) query = query.limit(options.limit);
  if (options.category) query = query.eq('category_id', options.category);
  if (options.approved !== undefined) query = query.eq('approved', options.approved);

  const { data, error } = await query;

  if (data && !error) {
    apiCache.set(cacheKey, data, CACHE_TIMES.ARTICLES);
  }

  return { data: data || [], error, fromCache: false };
}

export async function getCategoriesWithCache() {
  const cacheKey = 'categories_all';
  const cached = apiCache.get<Category[]>(cacheKey);

  if (cached) return { data: cached, error: null };

  if (!supabase) return { data: [], error: null };

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (data && !error) {
    apiCache.set(cacheKey, data, CACHE_TIMES.CATEGORIES);
  }

  return { data: data || [], error };
}

export async function getMapEventsWithCache(limit = 100) {
  const cacheKey = `map_events_${limit}`;
  const cached = apiCache.get<MapEvent[]>(cacheKey);

  if (cached) return { data: cached, error: null };

  if (!supabase) return { data: [], error: null };

  const { data, error } = await supabase
    .from('map_events')
    .select('*, article:articles(*)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (data && !error) {
    apiCache.set(cacheKey, data, CACHE_TIMES.MAP_EVENTS);
  }

  return { data: data || [], error };
}

export async function getEscalationEventsWithCache(limit = 50) {
  const cacheKey = `escalation_events_${limit}`;
  const cached = apiCache.get<EscalationEvent[]>(cacheKey);

  if (cached) return { data: cached, error: null };

  if (!supabase) return { data: [], error: null };

  const { data, error } = await supabase
    .from('escalation_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (data && !error) {
    apiCache.set(cacheKey, data, CACHE_TIMES.ESCALATION);
  }

  return { data: data || [], error };
}

export async function getActiveAlertsWithCache() {
  const cacheKey = 'alerts_active';
  const cached = apiCache.get<Alert[]>(cacheKey);

  if (cached) return { data: cached, error: null };

  if (!supabase) return { data: [], error: null };

  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('sent', false)
    .order('created_at', { ascending: false })
    .limit(10);

  if (data && !error) {
    apiCache.set(cacheKey, data, CACHE_TIMES.ALERTS);
  }

  return { data: data || [], error };
}

export async function getLatestBriefingWithCache() {
  const cacheKey = 'briefing_latest';
  const cached = apiCache.get<DailyBriefing>(cacheKey);

  if (cached) return { data: cached, error: null };

  if (!supabase) return { data: null, error: null };

  const { data, error } = await supabase
    .from('daily_briefings')
    .select('*')
    .order('briefing_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (data && !error) {
    apiCache.set(cacheKey, data, CACHE_TIMES.BRIEFING);
  }

  return { data, error };
}

export async function getRiskAssessmentsWithCache() {
  const cacheKey = 'risk_assessments_all';
  const cached = apiCache.get<RiskAssessment[]>(cacheKey);

  if (cached) return { data: cached, error: null };

  if (!supabase) return { data: [], error: null };

  const { data, error } = await supabase
    .from('risk_assessments')
    .select('*')
    .order('risk_score', { ascending: false });

  if (data && !error) {
    apiCache.set(cacheKey, data, CACHE_TIMES.RISK);
  }

  return { data: data || [], error };
}

export async function getSafetyAlertsWithCache() {
  const cacheKey = 'safety_alerts_active';
  const cached = apiCache.get<CivilianSafety[]>(cacheKey);

  if (cached) return { data: cached, error: null };

  if (!supabase) return { data: [], error: null };

  const { data, error } = await supabase
    .from('civilian_safety')
    .select('*')
    .eq('active', true)
    .order('priority', { ascending: false });

  if (data && !error) {
    apiCache.set(cacheKey, data, CACHE_TIMES.SAFETY);
  }

  return { data: data || [], error };
}

export async function getOsintPostsWithCache(limit = 20) {
  const cacheKey = `osint_posts_${limit}`;
  const cached = apiCache.get<OsintPost[]>(cacheKey);

  if (cached) return { data: cached, error: null };

  if (!supabase) return { data: [], error: null };

  const { data, error } = await supabase
    .from('osint_posts')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (data && !error) {
    apiCache.set(cacheKey, data, CACHE_TIMES.OSINT);
  }

  return { data: data || [], error };
}

export function clearAllCache() {
  apiCache.clear();
}

export function clearCacheKey(key: string) {
  apiCache.delete(key);
}

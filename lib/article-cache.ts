import type { Article } from './supabase';

const CACHE_KEY = 'crisiswatch_articles';
const CACHE_TIMESTAMP_KEY = 'crisiswatch_articles_timestamp';
const CACHE_DURATION = 5 * 60 * 1000;

interface CachedArticles {
  articles: Article[];
  timestamp: number;
}

export function getCachedArticles(): Article[] | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

    if (!cached || !timestamp) return null;

    const cacheAge = Date.now() - parseInt(timestamp, 10);
    if (cacheAge > CACHE_DURATION) {
      clearArticleCache();
      return null;
    }

    return JSON.parse(cached) as Article[];
  } catch (error) {
    console.error('Error reading article cache:', error);
    return null;
  }
}

export function setCachedArticles(articles: Article[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(articles));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error setting article cache:', error);
  }
}

export function clearArticleCache(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  } catch (error) {
    console.error('Error clearing article cache:', error);
  }
}

export function getCacheAge(): number | null {
  if (typeof window === 'undefined') return null;

  try {
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestamp) return null;

    return Date.now() - parseInt(timestamp, 10);
  } catch (error) {
    return null;
  }
}

export function isCacheValid(): boolean {
  const age = getCacheAge();
  if (age === null) return false;
  return age < CACHE_DURATION;
}

export async function getArticlesWithLocalCache(
  fetchFn: () => Promise<{ data: Article[] | null; error: any }>
): Promise<{ data: Article[]; fromCache: boolean; error: any }> {
  const cached = getCachedArticles();

  if (cached && isCacheValid()) {
    fetchFn().then(({ data }) => {
      if (data) {
        setCachedArticles(data);
      }
    });

    return { data: cached, fromCache: true, error: null };
  }

  const { data, error } = await fetchFn();

  if (data && !error) {
    setCachedArticles(data);
    return { data, fromCache: false, error: null };
  }

  if (cached) {
    return { data: cached, fromCache: true, error };
  }

  return { data: [], fromCache: false, error };
}

export function getNewArticles(
  currentArticles: Article[],
  lastFetchedId?: string
): Article[] {
  if (!lastFetchedId) return currentArticles;

  const lastIndex = currentArticles.findIndex(
    (article) => article.id === lastFetchedId
  );

  if (lastIndex === -1) return currentArticles;

  return currentArticles.slice(0, lastIndex);
}

export function mergeArticles(
  cached: Article[],
  fresh: Article[]
): Article[] {
  const articleMap = new Map<string, Article>();

  cached.forEach((article) => articleMap.set(article.id, article));
  fresh.forEach((article) => articleMap.set(article.id, article));

  return Array.from(articleMap.values()).sort(
    (a, b) =>
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
}

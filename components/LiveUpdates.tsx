'use client';

import { useEffect, useState } from 'react';
import { supabase, type Article } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, CircleAlert as AlertCircle, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  getCachedArticles,
  setCachedArticles,
  getCacheAge,
  mergeArticles
} from '@/lib/article-cache';

interface Source {
  name: string;
  logo_url: string | null;
}

interface ArticleWithSource extends Article {
  sources?: Source | Source[] | null;
}

export function LiveUpdates() {
  const [articles, setArticles] = useState<ArticleWithSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fromCache, setFromCache] = useState(false);
  const [lastArticleId, setLastArticleId] = useState<string | null>(null);

  const fetchArticles = async (force = false) => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const cached = getCachedArticles();

    if (cached && cached.length > 0 && !force) {
      setArticles(cached as ArticleWithSource[]);
      setFromCache(true);
      setLoading(false);
      setLastArticleId(cached[0]?.id || null);

      fetchNewArticles();
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          ai_summary,
          source_url,
          published_at,
          verification_status,
          created_at,
          category_id,
          source_id,
          approved,
          sources (
            name,
            logo_url
          )
        `)
        .eq('approved', true)
        .in('verification_status', ['confirmed', 'developing'])
        .order('published_at', { ascending: false })
        .limit(20);

      if (fetchError) throw fetchError;

      const fetchedArticles = (data as any) || [];
      setArticles(fetchedArticles);
      setCachedArticles(fetchedArticles);
      setLastArticleId(fetchedArticles[0]?.id || null);
      setError(null);
      setFromCache(false);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load updates');

      if (cached && cached.length > 0) {
        setArticles(cached as ArticleWithSource[]);
        setFromCache(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchNewArticles = async () => {
    if (!supabase || !lastArticleId) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          ai_summary,
          source_url,
          published_at,
          verification_status,
          created_at,
          category_id,
          source_id,
          approved,
          sources (
            name,
            logo_url
          )
        `)
        .eq('approved', true)
        .in('verification_status', ['confirmed', 'developing'])
        .gt('published_at', articles[0]?.published_at || new Date().toISOString())
        .order('published_at', { ascending: false })
        .limit(10);

      if (fetchError) throw fetchError;

      const newArticles = (data as any) || [];

      if (newArticles.length > 0) {
        const merged = mergeArticles(articles, newArticles);
        setArticles(merged);
        setCachedArticles(merged);
        setLastArticleId(merged[0]?.id || null);
      }
    } catch (err) {
      console.error('Error fetching new articles:', err);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchArticles(true);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    fetchArticles();
  }, []);

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-600 hover:bg-green-700 text-white">Confirmed</Badge>;
      case 'developing':
        return <Badge className="bg-amber-600 hover:bg-amber-700 text-white">Developing</Badge>;
      case 'unverified':
        return <Badge className="bg-neutral-600 hover:bg-neutral-700 text-white">Unverified</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-blue-400" />
          Live Updates
        </h2>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-neutral-900 border-neutral-800 p-6 animate-pulse">
              <div className="h-4 bg-neutral-800 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-neutral-800 rounded w-full mb-2"></div>
              <div className="h-3 bg-neutral-800 rounded w-5/6"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-blue-400" />
          Live Updates
        </h2>
        <Card className="bg-red-950/30 border-red-800 p-6">
          <p className="text-red-400">{error}</p>
        </Card>
      </div>
    );
  }

  const getCacheStatus = () => {
    const age = getCacheAge();
    if (!age || !fromCache) return null;

    const minutes = Math.floor(age / 60000);
    const seconds = Math.floor((age % 60000) / 1000);

    return `Cached ${minutes}m ${seconds}s ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <div className="relative">
            <AlertCircle className="w-6 h-6 text-blue-400" />
            {!fromCache && <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>}
          </div>
          Live Updates
        </h2>
        <div className="flex items-center gap-4">
          {fromCache && (
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Clock className="w-3 h-3" />
              <span>{getCacheStatus()}</span>
            </div>
          )}
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            size="sm"
            variant="outline"
            className="gap-2 bg-neutral-900 border-neutral-700 hover:bg-neutral-800 hover:border-neutral-600"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {articles.length === 0 ? (
        <Card className="bg-neutral-900 border-neutral-800 p-8 text-center">
          <p className="text-neutral-400">No updates available yet. Check back soon.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="bg-neutral-900 border-neutral-800 p-6 hover:border-neutral-700 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {article.sources && (
                      <span className="text-sm font-medium text-blue-400">
                        {Array.isArray(article.sources) ? article.sources[0]?.name : article.sources.name}
                      </span>
                    )}
                    <span className="text-neutral-600">•</span>
                    <span className="text-sm text-neutral-500">
                      {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 leading-tight">
                    {article.title}
                  </h3>
                  {article.ai_summary && (
                    <p className="text-neutral-300 text-sm leading-relaxed">
                      {article.ai_summary}
                    </p>
                  )}
                </div>
                {getVerificationBadge(article.verification_status)}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                  Read original article
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

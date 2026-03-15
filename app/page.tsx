'use client';

import { useState, useEffect } from 'react';
import { supabase, Article } from '@/lib/supabase';
import { LegalDisclaimerModal } from '@/components/LegalDisclaimerModal';
import { Header } from '@/components/Header';
import { Clock, Play } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const fetchArticles = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*, source:sources(*), category:categories(*)')
        .eq('approved', true)
        .order('published_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showDisclaimer && supabase) {
      fetchArticles();

      const subscription = supabase
        .channel('articles_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, fetchArticles)
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } else if (!showDisclaimer && !supabase) {
      setLoading(false);
    }
  }, [showDisclaimer]);

  if (showDisclaimer) {
    return <LegalDisclaimerModal onAccept={() => setShowDisclaimer(false)} />;
  }

  const featuredArticles = articles.filter(a => a.is_breaking || a.severity === 'critical').slice(0, 3);
  const topStories = articles.slice(0, 1);
  const secondaryStories = articles.slice(1, 5);
  const regularArticles = articles.slice(5);

  const getCategoryColor = (slug: string) => {
    switch (slug) {
      case 'breaking-news': return '#c41e3a';
      case 'military-activity': return '#8b0000';
      case 'diplomatic-updates': return '#1a5490';
      case 'civilian-safety': return '#d97706';
      default: return '#6b7280';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {featuredArticles.length > 0 && (
        <div className="bg-red-700 py-2 px-4">
          <div className="max-w-[1200px] mx-auto flex items-center gap-3">
            <span className="bg-white text-red-700 px-3 py-1 text-sm font-bold">BREAKING</span>
            <div className="flex-1 overflow-hidden">
              <p className="text-white text-sm font-medium truncate">
                {featuredArticles[0]?.title}
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-[1200px] mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading news...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {topStories[0] && (
                <div className="lg:col-span-2">
                  <Link href={topStories[0].source_url} target="_blank" rel="noopener noreferrer">
                    <article className="group cursor-pointer">
                      {topStories[0].image_url && (
                        <div className="relative aspect-[16/9] mb-4 overflow-hidden bg-gray-200">
                          <img
                            src={topStories[0].image_url}
                            alt={topStories[0].title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {topStories[0].severity === 'critical' && (
                            <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-xs font-bold">
                              URGENT
                            </div>
                          )}
                        </div>
                      )}
                      <div className="mb-2">
                        {topStories[0].category && (
                          <span
                            className="text-xs font-bold uppercase tracking-wide"
                            style={{ color: getCategoryColor(topStories[0].category.slug) }}
                          >
                            {topStories[0].category.name}
                          </span>
                        )}
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-red-700 transition-colors">
                        {topStories[0].title}
                      </h2>
                      {topStories[0].ai_summary && (
                        <p className="text-gray-700 text-base leading-relaxed mb-3 line-clamp-3">
                          {topStories[0].ai_summary}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDistanceToNow(new Date(topStories[0].published_at), { addSuffix: true })}
                        </span>
                        {topStories[0].source && (
                          <span className="font-medium text-gray-700">{topStories[0].source.name}</span>
                        )}
                      </div>
                    </article>
                  </Link>
                </div>
              )}

              <div className="space-y-6">
                {secondaryStories.map((article) => (
                  <Link key={article.id} href={article.source_url} target="_blank" rel="noopener noreferrer">
                    <article className="group cursor-pointer border-b border-gray-200 pb-6 last:border-0">
                      <div className="mb-2">
                        {article.category && (
                          <span
                            className="text-xs font-bold uppercase tracking-wide"
                            style={{ color: getCategoryColor(article.category.slug) }}
                          >
                            {article.category.name}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-red-700 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t-4 border-red-700 pt-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Updates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {regularArticles.slice(0, 8).map((article) => (
                  <Link key={article.id} href={article.source_url} target="_blank" rel="noopener noreferrer">
                    <article className="group cursor-pointer">
                      {article.image_url && (
                        <div className="relative aspect-[16/9] mb-3 overflow-hidden bg-gray-200">
                          <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="mb-2">
                        {article.category && (
                          <span
                            className="text-xs font-bold uppercase tracking-wide"
                            style={{ color: getCategoryColor(article.category.slug) }}
                          >
                            {article.category.name}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight group-hover:text-red-700 transition-colors line-clamp-3">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <div className="border-t-4 border-gray-800 pt-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">More Stories</h2>
                  <div className="space-y-6">
                    {regularArticles.slice(8, 15).map((article) => (
                      <Link key={article.id} href={article.source_url} target="_blank" rel="noopener noreferrer">
                        <article className="group cursor-pointer flex gap-4 border-b border-gray-200 pb-6">
                          {article.image_url && (
                            <div className="flex-shrink-0 w-32 h-24 overflow-hidden bg-gray-200">
                              <img
                                src={article.image_url}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="mb-2">
                              {article.category && (
                                <span
                                  className="text-xs font-bold uppercase tracking-wide"
                                  style={{ color: getCategoryColor(article.category.slug) }}
                                >
                                  {article.category.name}
                                </span>
                              )}
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight group-hover:text-red-700 transition-colors">
                              {article.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="border-t-4 border-gray-800 pt-4 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Video Reports</h2>
                  <div className="space-y-6">
                    {regularArticles.slice(0, 4).map((article) => (
                      <Link key={article.id} href={article.source_url} target="_blank" rel="noopener noreferrer">
                        <article className="group cursor-pointer">
                          {article.image_url && (
                            <div className="relative aspect-video mb-3 overflow-hidden bg-gray-200">
                              <img
                                src={article.image_url}
                                alt={article.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-50 transition-all">
                                <Play className="w-12 h-12 text-white" fill="white" />
                              </div>
                            </div>
                          )}
                          <h4 className="text-sm font-bold text-gray-900 leading-tight group-hover:text-red-700 transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-100 p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
                  <div className="space-y-3">
                    <Link href="/markets" className="block text-sm text-gray-700 hover:text-red-700 font-medium">
                      Market Analysis
                    </Link>
                    <Link href="/map" className="block text-sm text-gray-700 hover:text-red-700 font-medium">
                      Conflict Map
                    </Link>
                    <Link href="/timeline" className="block text-sm text-gray-700 hover:text-red-700 font-medium">
                      Event Timeline
                    </Link>
                    <Link href="/intelligence" className="block text-sm text-gray-700 hover:text-red-700 font-medium">
                      Intelligence Reports
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Conflict Watch. Real-time intelligence and analysis.
          </p>
        </div>
      </footer>
    </div>
  );
}

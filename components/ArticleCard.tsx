'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/lib/supabase';
import { VerificationBadge } from './VerificationBadge';
import { ExternalLink, Clock, Languages } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getOrCreateTranslation, Translation } from '@/lib/translation';

interface ArticleCardProps {
  article: Article;
  isBreaking?: boolean;
}

export function ArticleCard({ article, isBreaking }: ArticleCardProps) {
  const [displayArticle, setDisplayArticle] = useState(article);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    setCurrentLanguage(storedLanguage);

    if (storedLanguage !== 'en') {
      loadTranslation(storedLanguage);
    }

    const handleLanguageChange = (event: CustomEvent<string>) => {
      const newLanguage = event.detail;
      setCurrentLanguage(newLanguage);
      if (newLanguage === 'en') {
        setDisplayArticle(article);
      } else {
        loadTranslation(newLanguage);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, [article]);

  const loadTranslation = async (languageCode: string) => {
    setIsTranslating(true);
    try {
      const translation = await getOrCreateTranslation(article.id, languageCode);
      if (translation) {
        setDisplayArticle({
          ...article,
          title: translation.title,
          ai_summary: translation.summary || article.ai_summary,
        });
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(article.published_at), {
    addSuffix: true,
  });

  return (
    <a
      href={`/article/${article.id}`}
      className="block bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden hover:border-neutral-700 transition-all relative group"
    >
      {isTranslating && (
        <div className="absolute top-2 right-2 flex items-center gap-2 text-xs text-neutral-400 bg-neutral-900/80 px-2 py-1 rounded z-10">
          <Languages className="w-3 h-3 animate-pulse" />
          <span>Translating...</span>
        </div>
      )}

      {article.image_url && (
        <div className="relative w-full h-56 bg-neutral-800">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          {isBreaking && (
            <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-red-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold border border-red-500/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              BREAKING NEWS
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        {!article.image_url && isBreaking && (
          <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-red-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            BREAKING NEWS
          </div>
        )}

        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-lg font-semibold text-white leading-tight flex-1 group-hover:text-blue-400 transition-colors">
            {displayArticle.title}
          </h3>
          <VerificationBadge status={article.verification_status} />
        </div>

        {displayArticle.ai_summary && (
          <p className="text-neutral-300 text-sm leading-relaxed mb-4">
            {displayArticle.ai_summary}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-4">
            {article.category && (
              <span className="px-2 py-0.5 bg-neutral-800 rounded text-neutral-400">
                {article.category.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </a>
  );
}

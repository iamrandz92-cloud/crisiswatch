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
    <article className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-5 hover:border-neutral-700 transition-all relative">
      {isTranslating && (
        <div className="absolute top-2 right-2 flex items-center gap-2 text-xs text-neutral-400">
          <Languages className="w-3 h-3 animate-pulse" />
          <span>Translating...</span>
        </div>
      )}

      {isBreaking && (
        <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-red-500/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          BREAKING NEWS
        </div>
      )}

      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-lg font-semibold text-white leading-tight flex-1">
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
          {article.source && (
            <span className="font-medium text-neutral-400">
              {article.source.name}
            </span>
          )}
          {article.category && (
            <span className="px-2 py-0.5 bg-neutral-800 rounded text-neutral-400">
              {article.category.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeAgo}</span>
          </div>
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Source
          </a>
        </div>
      </div>
    </article>
  );
}

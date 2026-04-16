'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/lib/supabase';
import { VerificationBadge } from './VerificationBadge';
import { ExternalLink, Clock, ArrowLeft, Share2, Check } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { getOrCreateTranslation } from '@/lib/translation';
import Link from 'next/link';
import { Button } from './ui/button';

interface ArticleDetailViewProps {
  article: Article;
}

export function ArticleDetailView({ article }: ArticleDetailViewProps) {
  const [displayArticle, setDisplayArticle] = useState(article);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [copied, setCopied] = useState(false);

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

  const formattedDate = format(new Date(article.published_at), 'MMMM d, yyyy \'at\' h:mm a');

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `${displayArticle.title} - CrisisWatch`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareText,
          text: displayArticle.ai_summary || '',
          url: shareUrl,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <article className="bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden">
          {article.image_url && (
            <div className="relative w-full h-96 bg-neutral-800">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {article.category && (
                    <span className="px-3 py-1 bg-neutral-800 rounded-full text-sm text-neutral-300">
                      {article.category.name}
                    </span>
                  )}
                  <VerificationBadge status={article.verification_status} />
                </div>
                <h1 className="text-3xl font-bold text-white leading-tight mb-4">
                  {displayArticle.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-neutral-400 mb-6 pb-6 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{timeAgo}</span>
              </div>
              <span className="text-neutral-500">{formattedDate}</span>
            </div>

            {displayArticle.ai_summary && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">AI Summary</h2>
                <p className="text-neutral-300 text-base leading-relaxed">
                  {displayArticle.ai_summary}
                </p>
              </div>
            )}

            {article.video_url && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Video</h2>
                <div className="aspect-video bg-neutral-800 rounded-lg overflow-hidden">
                  <iframe
                    src={article.video_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 pt-6 border-t border-neutral-800">
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      Share
                    </>
                  )}
                </Button>

                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Read Full Article
                </a>
              </div>

              {article.source && (
                <p className="text-xs text-neutral-500">
                  Originally reported by {article.source.name}
                </p>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { supabase, OsintPost } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { ExternalLink, CircleCheck as CheckCircle2, Radio } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function OSINTFeed() {
  const [posts, setPosts] = useState<OsintPost[]>([]);

  useEffect(() => {
    if (!supabase) return;

    const fetchPosts = async () => {
      if (!supabase) return;

      const { data } = await supabase
        .from('osint_posts')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(10);

      if (data) {
        setPosts(data);
      }
    };

    fetchPosts();

    const subscription = supabase
      .channel('osint_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'osint_posts',
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'twitter':
        return '𝕏';
      case 'telegram':
        return '✈️';
      case 'official':
        return '📋';
      case 'analyst':
        return '📊';
      default:
        return '📡';
    }
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <div className="p-5 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">OSINT Feed</h3>
        </div>
        <p className="text-sm text-neutral-400 mt-1">
          Verified intelligence from trusted sources
        </p>
      </div>

      <div className="divide-y divide-neutral-800 max-h-[600px] overflow-y-auto">
        {posts.map((post) => (
          <div key={post.id} className="p-4 hover:bg-neutral-800/50 transition-colors">
            <div className="flex items-start gap-3 mb-2">
              <div className="text-2xl">{getSourceIcon(post.source_type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white">{post.author}</span>
                  {post.author_verified && (
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  )}
                  <span className="text-xs text-neutral-500 uppercase">
                    {post.source_type}
                  </span>
                </div>

                <p className="text-sm text-neutral-300 leading-relaxed mb-2">
                  {post.content}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-500">
                      {formatDistanceToNow(new Date(post.published_at), {
                        addSuffix: true,
                      })}
                    </span>
                    <span className={`font-medium ${getReliabilityColor(post.reliability_score)}`}>
                      {post.reliability_score}% reliable
                    </span>
                  </div>
                  <a
                    href={post.post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Source
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="p-8 text-center text-neutral-500">
            No OSINT posts available yet
          </div>
        )}
      </div>
    </Card>
  );
}

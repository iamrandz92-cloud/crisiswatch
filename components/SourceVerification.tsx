'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, ExternalLink } from 'lucide-react';

interface SourceVerification {
  id: string;
  source_name: string;
  source_type: string;
  source_url: string | null;
  verification_status: string;
  credibility_score: number;
  verification_method: string;
  verified_by: string;
  verified_at: string;
  notes: string;
}

export function SourceVerification() {
  const [sources, setSources] = useState<SourceVerification[]>([]);
  const [stats, setStats] = useState({ verified: 0, disputed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  const fetchSources = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('source_verification')
        .select('*')
        .in('verification_status', ['verified', 'disputed', 'debunked'])
        .order('verified_at', { ascending: false })
        .limit(12);

      if (!error && data) {
        setSources(data);

        const counts = data.reduce(
          (acc, source) => {
            if (source.verification_status === 'verified') acc.verified++;
            else if (source.verification_status === 'disputed') acc.disputed++;
            return acc;
          },
          { verified: 0, disputed: 0, pending: 0 }
        );

        setStats(counts);
      }
    } catch (err) {
      console.error('Error fetching source verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    fetchSources();
    const interval = setInterval(fetchSources, 120000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'disputed': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'debunked': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertCircle className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'disputed': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'debunked': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    }
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 9) return 'text-green-400';
    if (score >= 7) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <div className="p-5 border-b border-neutral-800">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Multi-Source Verification</h3>
        </div>
        <p className="text-sm text-neutral-400">Cross-referencing and fact-checking from multiple sources</p>
      </div>

      <div className="p-5 border-b border-neutral-800">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{stats.verified}</div>
            <div className="text-xs text-neutral-400">Verified</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.disputed}</div>
            <div className="text-xs text-neutral-400">Disputed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{sources.length}</div>
            <div className="text-xs text-neutral-400">Total Sources</div>
          </div>
        </div>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-neutral-800/30 rounded animate-pulse" />
            ))}
          </div>
        ) : sources.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-8">No source verifications available</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {sources.map((source) => (
              <div key={source.id} className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-3 hover:border-neutral-600 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getStatusIcon(source.verification_status)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{source.source_name}</span>
                      <Badge className={getStatusColor(source.verification_status)}>
                        {source.verification_status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {source.source_type}
                      </Badge>
                    </div>

                    <p className="text-xs text-neutral-400 mb-2">{source.notes}</p>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className={getCredibilityColor(source.credibility_score)}>
                          Credibility: {source.credibility_score}/10
                        </span>
                        <span className="text-neutral-500">
                          By: {source.verified_by}
                        </span>
                      </div>
                      {source.source_url && (
                        <a
                          href={source.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Source
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

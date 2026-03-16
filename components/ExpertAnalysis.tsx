'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, TrendingUp, Clock } from 'lucide-react';

interface ExpertAnalysis {
  id: string;
  expert_name: string;
  expert_title: string;
  expert_organization: string;
  analysis_type: string;
  title: string;
  content: string;
  key_points: string[];
  published_at: string;
}

export function ExpertAnalysis() {
  const [analyses, setAnalyses] = useState<ExpertAnalysis[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalyses = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('expert_analysis')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(6);

      if (selectedType) {
        query = query.eq('analysis_type', selectedType);
      }

      const { data, error } = await query;

      if (!error && data) {
        setAnalyses(data);
      }
    } catch (err) {
      console.error('Error fetching expert analyses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    fetchAnalyses();
  }, [selectedType]);

  const getAnalysisColor = (type: string) => {
    switch (type) {
      case 'military': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'diplomatic': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'economic': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'strategic': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'humanitarian': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    }
  };

  const analysisTypes = [
    { value: null, label: 'All Analysis' },
    { value: 'military', label: 'Military' },
    { value: 'diplomatic', label: 'Diplomatic' },
    { value: 'economic', label: 'Economic' },
    { value: 'strategic', label: 'Strategic' },
    { value: 'humanitarian', label: 'Humanitarian' },
  ];

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <div className="p-5 border-b border-neutral-800">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Expert Analysis</h3>
        </div>
        <p className="text-sm text-neutral-400">Professional insights from military and geopolitical experts</p>
      </div>

      <div className="p-5 border-b border-neutral-800">
        <div className="flex flex-wrap gap-2">
          {analysisTypes.map((type) => (
            <button
              key={type.value || 'all'}
              onClick={() => setSelectedType(type.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedType === type.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 bg-neutral-800/30 rounded animate-pulse" />
            ))}
          </div>
        ) : analyses.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-8">No expert analyses available</p>
        ) : (
          <div className="space-y-4 max-h-[800px] overflow-y-auto">
            {analyses.map((analysis) => (
              <div key={analysis.id} className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-5 hover:border-neutral-600 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <GraduationCap className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-white mb-2">{analysis.title}</h4>

                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getAnalysisColor(analysis.analysis_type)}>
                        {analysis.analysis_type}
                      </Badge>
                      <span className="text-xs text-neutral-400">•</span>
                      <span className="text-xs text-neutral-400">{analysis.expert_name}</span>
                    </div>

                    <div className="text-xs text-neutral-500 mb-3">
                      <div className="font-medium">{analysis.expert_title}</div>
                      <div>{analysis.expert_organization}</div>
                    </div>

                    <p className="text-sm text-neutral-300 leading-relaxed mb-3 line-clamp-3">
                      {analysis.content}
                    </p>

                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-3 h-3 text-blue-400" />
                        <span className="text-xs font-semibold text-neutral-400">Key Takeaways:</span>
                      </div>
                      <div className="space-y-1.5">
                        {analysis.key_points.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                            <span className="text-blue-400 mt-0.5">▸</span>
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-neutral-700 text-xs text-neutral-500">
                      <Clock className="w-3 h-3" />
                      <span>Published {new Date(analysis.published_at).toLocaleString()}</span>
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

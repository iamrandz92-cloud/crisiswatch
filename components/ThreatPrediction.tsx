'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Clock, MapPin, Zap } from 'lucide-react';

interface ThreatPrediction {
  id: string;
  threat_type: string;
  target_region: string;
  probability: number;
  severity: number;
  timeframe: string;
  prediction_factors: string[];
  ai_model_version: string;
  confidence_score: number;
  status: string;
  predicted_at: string;
  expires_at: string;
}

export function ThreatPrediction() {
  const [predictions, setPredictions] = useState<ThreatPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPredictions = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('threat_predictions')
        .select('*')
        .eq('status', 'active')
        .gte('expires_at', new Date().toISOString())
        .order('probability', { ascending: false })
        .limit(6);

      if (!error && data) {
        setPredictions(data);
      }
    } catch (err) {
      console.error('Error fetching threat predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    fetchPredictions();
    const interval = setInterval(fetchPredictions, 180000);
    return () => clearInterval(interval);
  }, []);

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'bg-red-500';
    if (probability >= 60) return 'bg-orange-500';
    if (probability >= 40) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return 'text-red-400 bg-red-500/10 border-red-500/30';
    if (severity >= 6) return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    if (severity >= 4) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
  };

  const getTimeframeIcon = (timeframe: string) => {
    if (timeframe === 'immediate') return '🚨';
    if (timeframe === '24h') return '⏰';
    if (timeframe === '48h') return '📅';
    if (timeframe === 'week') return '📆';
    return '🗓️';
  };

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <div className="p-5 border-b border-neutral-800">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">AI Threat Predictions</h3>
        </div>
        <p className="text-sm text-neutral-400">Machine learning-powered conflict escalation forecasting</p>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-neutral-800/30 rounded animate-pulse" />
            ))}
          </div>
        ) : predictions.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-8">No active threat predictions</p>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {predictions.map((prediction) => (
              <div key={prediction.id} className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 hover:border-neutral-600 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm font-semibold text-white">{prediction.target_region}</span>
                      <Badge className={getSeverityColor(prediction.severity)}>
                        Severity {prediction.severity}/10
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="outline" className="text-xs capitalize">
                        {prediction.threat_type.replace('_', ' ')}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-neutral-400">
                        <span className="text-lg">{getTimeframeIcon(prediction.timeframe)}</span>
                        <span className="capitalize">{prediction.timeframe}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: prediction.probability >= 80 ? '#ef4444' : prediction.probability >= 60 ? '#f97316' : prediction.probability >= 40 ? '#eab308' : '#3b82f6' }}>
                      {prediction.probability}%
                    </div>
                    <div className="text-xs text-neutral-500">Probability</div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-3 h-3 text-neutral-500" />
                    <span className="text-xs font-medium text-neutral-400">Contributing Factors:</span>
                  </div>
                  <div className="space-y-1">
                    {prediction.prediction_factors.map((factor, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-700">
                  <div className="w-full bg-neutral-700 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${getProbabilityColor(prediction.probability)}`}
                      style={{ width: `${prediction.probability}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-purple-400">
                        <Zap className="w-3 h-3" />
                        Confidence: {(prediction.confidence_score * 100).toFixed(0)}%
                      </span>
                      <span className="text-neutral-500">Model: {prediction.ai_model_version}</span>
                    </div>
                    <span className="flex items-center gap-1 text-neutral-600">
                      <Clock className="w-3 h-3" />
                      Expires: {new Date(prediction.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-5 border-t border-neutral-800">
        <div className="flex items-start gap-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <Brain className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-neutral-300">
            <span className="font-semibold text-purple-400">AI-Powered Analysis:</span> Predictions are generated using
            machine learning models trained on historical conflict data, current events, military movements, and geopolitical indicators.
          </div>
        </div>
      </div>
    </Card>
  );
}

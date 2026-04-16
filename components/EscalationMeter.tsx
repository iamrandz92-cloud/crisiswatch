'use client';

import { useEffect, useState } from 'react';
import { supabase, EscalationLevel } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function EscalationMeter() {
  const [escalation, setEscalation] = useState<EscalationLevel | null>(null);
  const [previousScore, setPreviousScore] = useState<number>(0);

  useEffect(() => {
    if (!supabase) return;

    const fetchEscalation = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('escalation_levels')
        .select('*')
        .eq('region', 'Global')
        .maybeSingle();

      if (error) {
        console.error('Error fetching escalation level:', error);
        return;
      }

      if (data) {
        console.log('Fetched escalation data:', data);
        setPreviousScore(escalation?.level_score || data.level_score);
        setEscalation(data);
      }
    };

    fetchEscalation();

    // Also fetch every 30 seconds to ensure fresh data
    const interval = setInterval(fetchEscalation, 30000);

    const subscription = supabase
      .channel('escalation_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'escalation_levels',
        },
        () => {
          fetchEscalation();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [escalation]);

  if (!escalation) {
    return (
      <Card className="bg-neutral-900 border-neutral-800">
        <div className="p-5">
          <div className="text-neutral-400">Loading escalation level...</div>
        </div>
      </Card>
    );
  }

  const getLevelConfig = (level: string) => {
    switch (level) {
      case 'low':
        return {
          label: 'Low Tension',
          color: 'bg-emerald-500',
          borderColor: 'border-emerald-500',
          textColor: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10',
          emoji: '🟢',
        };
      case 'military_activity':
        return {
          label: 'Military Activity',
          color: 'bg-yellow-500',
          borderColor: 'border-yellow-500',
          textColor: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          emoji: '🟡',
        };
      case 'major_strikes':
        return {
          label: 'Major Strikes',
          color: 'bg-orange-500',
          borderColor: 'border-orange-500',
          textColor: 'text-orange-400',
          bgColor: 'bg-orange-500/10',
          emoji: '🟠',
        };
      case 'regional_war':
        return {
          label: 'Regional War Risk',
          color: 'bg-red-500',
          borderColor: 'border-red-500',
          textColor: 'text-red-400',
          bgColor: 'bg-red-500/10',
          emoji: '🔴',
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-neutral-500',
          borderColor: 'border-neutral-500',
          textColor: 'text-neutral-400',
          bgColor: 'bg-neutral-500/10',
          emoji: '⚪',
        };
    }
  };

  const config = getLevelConfig(escalation.level);
  const trend = escalation.level_score > previousScore ? 'up' : escalation.level_score < previousScore ? 'down' : 'stable';

  return (
    <Card className={`${config.bgColor} border-2 ${config.borderColor} overflow-hidden`}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
            Escalation Level
          </h3>
          {trend === 'up' && <TrendingUp className="w-5 h-5 text-red-400" />}
          {trend === 'down' && <TrendingDown className="w-5 h-5 text-emerald-400" />}
          {trend === 'stable' && <Minus className="w-5 h-5 text-neutral-400" />}
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl">{config.emoji}</div>
          <div className="flex-1">
            <div className={`text-2xl font-bold ${config.textColor} mb-1`}>
              {config.label}
            </div>
            <div className="text-sm text-neutral-500">
              Threat Level: {escalation.level_score}/100
            </div>
          </div>
        </div>

        <div className="relative h-3 bg-neutral-900 rounded-full overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full ${config.color} transition-all duration-1000 ease-out`}
            style={{ width: `${escalation.level_score}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-neutral-800">
          <div className="text-xs text-neutral-500">
            Last updated: {new Date(escalation.last_updated).toLocaleString()}
          </div>
        </div>
      </div>
    </Card>
  );
}

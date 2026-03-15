'use client';

import { useEffect, useState } from 'react';
import { supabase, RiskAssessment } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { TriangleAlert as AlertTriangle } from 'lucide-react';

export function RiskMap() {
  const [risks, setRisks] = useState<RiskAssessment[]>([]);

  useEffect(() => {
    if (!supabase) return;

    const fetchRisks = async () => {
      if (!supabase) return;

      const { data } = await supabase
        .from('risk_assessments')
        .select('*')
        .order('risk_score', { ascending: false });

      if (data) {
        setRisks(data);
      }
    };

    fetchRisks();

    const subscription = supabase
      .channel('risk_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'risk_assessments',
        },
        () => {
          fetchRisks();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getRiskConfig = (level: string) => {
    switch (level) {
      case 'critical':
        return {
          color: 'bg-red-500',
          textColor: 'text-red-400',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/50',
        };
      case 'high':
        return {
          color: 'bg-orange-500',
          textColor: 'text-orange-400',
          bgColor: 'bg-orange-500/20',
          borderColor: 'border-orange-500/50',
        };
      case 'medium':
        return {
          color: 'bg-yellow-500',
          textColor: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/50',
        };
      case 'low':
        return {
          color: 'bg-emerald-500',
          textColor: 'text-emerald-400',
          bgColor: 'bg-emerald-500/20',
          borderColor: 'border-emerald-500/50',
        };
      default:
        return {
          color: 'bg-neutral-500',
          textColor: 'text-neutral-400',
          bgColor: 'bg-neutral-500/20',
          borderColor: 'border-neutral-500/50',
        };
    }
  };

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <div className="p-5 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">War Risk Map</h3>
        </div>
        <p className="text-sm text-neutral-400 mt-1">
          Escalation probability by region
        </p>
      </div>

      <div className="p-5">
        <div className="space-y-3">
          {risks.map((risk) => {
            const config = getRiskConfig(risk.risk_level);
            return (
              <div
                key={risk.id}
                className={`p-4 rounded-lg border ${config.borderColor} ${config.bgColor}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${config.color} animate-pulse`}></div>
                    <span className="font-medium text-white">{risk.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold uppercase ${config.textColor}`}>
                      {risk.risk_level}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {risk.risk_score}
                    </span>
                  </div>
                </div>

                <div className="relative h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full ${config.color}`}
                    style={{ width: `${risk.risk_score}%` }}
                  ></div>
                </div>

                {risk.factors && risk.factors.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {risk.factors.slice(0, 2).map((factor, index) => (
                      <div key={index} className="text-xs text-neutral-400 flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-neutral-600 rounded-full"></span>
                        {factor}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-5 border-t border-neutral-800">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-neutral-400">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-neutral-400">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-neutral-400">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-neutral-400">Critical</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

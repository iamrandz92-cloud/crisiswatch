'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, TriangleAlert as AlertTriangle, Building } from 'lucide-react';

interface CasualtyReport {
  id: string;
  location: string;
  casualties_military: number;
  casualties_civilian: number;
  casualties_unknown: number;
  injuries_reported: number;
  infrastructure_damage: string;
  damage_description: string;
  verified: boolean;
  verified_by: string;
  reported_at: string;
}

export function CasualtyTracker() {
  const [reports, setReports] = useState<CasualtyReport[]>([]);
  const [totals, setTotals] = useState({
    military: 0,
    civilian: 0,
    unknown: 0,
    injuries: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('casualty_reports')
        .select('*')
        .eq('verified', true)
        .order('reported_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setReports(data);

        const sums = data.reduce(
          (acc, report) => ({
            military: acc.military + (report.casualties_military || 0),
            civilian: acc.civilian + (report.casualties_civilian || 0),
            unknown: acc.unknown + (report.casualties_unknown || 0),
            injuries: acc.injuries + (report.injuries_reported || 0),
          }),
          { military: 0, civilian: 0, unknown: 0, injuries: 0 }
        );

        setTotals(sums);
      }
    } catch (err) {
      console.error('Error fetching casualty reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    fetchReports();
    const interval = setInterval(fetchReports, 60000);
    return () => clearInterval(interval);
  }, []);

  const getDamageColor = (damage: string) => {
    switch (damage) {
      case 'destroyed': return 'text-red-400 bg-red-500/10';
      case 'severe': return 'text-orange-400 bg-orange-500/10';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/10';
      case 'minor': return 'text-blue-400 bg-blue-500/10';
      default: return 'text-neutral-400 bg-neutral-500/10';
    }
  };

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <div className="p-5 border-b border-neutral-800">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-semibold text-white">Casualty & Damage Tracker</h3>
        </div>
        <p className="text-sm text-neutral-400">Verified reports from conflict zones</p>
      </div>

      <div className="p-5 border-b border-neutral-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-red-400" />
              <span className="text-xs text-neutral-400">Military</span>
            </div>
            <div className="text-2xl font-bold text-red-400">{totals.military}</div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-neutral-400">Civilian</span>
            </div>
            <div className="text-2xl font-bold text-orange-400">{totals.civilian}</div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-neutral-400">Unknown</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{totals.unknown}</div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-neutral-400">Injuries</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">{totals.injuries}</div>
          </div>
        </div>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-neutral-800/30 rounded animate-pulse" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-8">No verified casualty reports</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {reports.map((report) => (
              <div key={report.id} className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 hover:border-neutral-600 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Building className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm font-semibold text-white">{report.location}</span>
                    </div>
                    <p className="text-xs text-neutral-400">{report.damage_description}</p>
                  </div>
                  <Badge className={getDamageColor(report.infrastructure_damage)}>
                    {report.infrastructure_damage}
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-neutral-700">
                  <div className="text-center">
                    <div className="text-xs text-neutral-500 mb-1">Military</div>
                    <div className="text-sm font-bold text-red-400">{report.casualties_military}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-neutral-500 mb-1">Civilian</div>
                    <div className="text-sm font-bold text-orange-400">{report.casualties_civilian}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-neutral-500 mb-1">Unknown</div>
                    <div className="text-sm font-bold text-yellow-400">{report.casualties_unknown}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-neutral-500 mb-1">Injuries</div>
                    <div className="text-sm font-bold text-blue-400">{report.injuries_reported}</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-neutral-700 flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Verified by: {report.verified_by}</span>
                  <span className="text-neutral-600">{new Date(report.reported_at).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

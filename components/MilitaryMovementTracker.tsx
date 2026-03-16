'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Ship, Target, Navigation, Rocket, MapPin } from 'lucide-react';

interface MilitaryMovement {
  id: string;
  movement_type: string;
  force: string;
  unit_size: string;
  from_location: string | null;
  to_location: string;
  status: string;
  confidence_level: number;
  source_type: string;
  notes: string;
  detected_at: string;
}

export function MilitaryMovementTracker() {
  const [movements, setMovements] = useState<MilitaryMovement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovements = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('military_movements')
        .select('*')
        .gte('confidence_level', 7)
        .order('detected_at', { ascending: false })
        .limit(15);

      if (!error && data) {
        setMovements(data);
      }
    } catch (err) {
      console.error('Error fetching military movements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    fetchMovements();
    const interval = setInterval(fetchMovements, 120000);
    return () => clearInterval(interval);
  }, []);

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'air': return <Plane className="w-4 h-4 text-blue-400" />;
      case 'naval': return <Ship className="w-4 h-4 text-cyan-400" />;
      case 'missile': return <Rocket className="w-4 h-4 text-red-400" />;
      case 'armor': return <Target className="w-4 h-4 text-orange-400" />;
      case 'artillery': return <Target className="w-4 h-4 text-yellow-400" />;
      default: return <Navigation className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_progress': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'planned': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'detected': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    }
  };

  const getConfidenceColor = (level: number) => {
    if (level >= 9) return 'text-green-400';
    if (level >= 7) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <div className="p-5 border-b border-neutral-800">
        <div className="flex items-center gap-2 mb-1">
          <Navigation className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Military Movement Tracker</h3>
        </div>
        <p className="text-sm text-neutral-400">Real-time tracking of military deployments and movements</p>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-neutral-800/30 rounded animate-pulse" />
            ))}
          </div>
        ) : movements.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-8">No military movements detected</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {movements.map((movement) => (
              <div key={movement.id} className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 hover:border-neutral-600 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getMovementIcon(movement.movement_type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-white">{movement.force}</span>
                      <Badge className={getStatusColor(movement.status)}>
                        {movement.status.replace('_', ' ')}
                      </Badge>
                      {movement.unit_size && movement.unit_size !== 'unknown' && (
                        <Badge variant="outline" className="text-xs">
                          {movement.unit_size}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1 mb-2">
                      {movement.from_location && (
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <MapPin className="w-3 h-3" />
                          <span>From: {movement.from_location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <Navigation className="w-3 h-3" />
                        <span>To: {movement.to_location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 mb-3">{movement.notes}</p>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-neutral-500">
                          Source: <span className="text-neutral-400">{movement.source_type}</span>
                        </span>
                        <span className={getConfidenceColor(movement.confidence_level)}>
                          Confidence: {movement.confidence_level}/10
                        </span>
                      </div>
                      <span className="text-neutral-600">
                        {new Date(movement.detected_at).toLocaleString()}
                      </span>
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

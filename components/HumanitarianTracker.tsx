'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Droplet, Pill, Chrome as Home, Fuel, Zap, MapPin } from 'lucide-react';

interface HumanitarianResource {
  id: string;
  resource_type: string;
  location: string;
  quantity: string;
  status: string;
  provider: string;
  last_updated: string;
  notes: string;
}

export function HumanitarianTracker() {
  const [resources, setResources] = useState<HumanitarianResource[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('humanitarian_resources')
        .select('*')
        .order('last_updated', { ascending: false })
        .limit(12);

      if (!error && data) {
        setResources(data);
      }
    } catch (err) {
      console.error('Error fetching humanitarian resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    fetchResources();
    const interval = setInterval(fetchResources, 120000);
    return () => clearInterval(interval);
  }, []);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'water': return <Droplet className="w-4 h-4 text-blue-400" />;
      case 'medical': return <Pill className="w-4 h-4 text-red-400" />;
      case 'food': return <Heart className="w-4 h-4 text-orange-400" />;
      case 'shelter': return <Home className="w-4 h-4 text-yellow-400" />;
      case 'fuel': return <Fuel className="w-4 h-4 text-purple-400" />;
      case 'power': return <Zap className="w-4 h-4 text-cyan-400" />;
      default: return <Heart className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'depleted': return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
      case 'incoming': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'blocked': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    }
  };

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case 'critical': return 'border-red-500/50';
      case 'depleted': return 'border-neutral-500/50';
      case 'blocked': return 'border-orange-500/50';
      default: return 'border-neutral-700';
    }
  };

  const resourceStats = resources.reduce(
    (acc, resource) => {
      if (resource.status === 'available') acc.available++;
      else if (resource.status === 'critical') acc.critical++;
      else if (resource.status === 'depleted') acc.depleted++;
      return acc;
    },
    { available: 0, critical: 0, depleted: 0 }
  );

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <div className="p-5 border-b border-neutral-800">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-semibold text-white">Humanitarian Resource Tracker</h3>
        </div>
        <p className="text-sm text-neutral-400">Aid distribution and resource availability monitoring</p>
      </div>

      <div className="p-5 border-b border-neutral-800">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{resourceStats.available}</div>
            <div className="text-xs text-neutral-400">Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">{resourceStats.critical}</div>
            <div className="text-xs text-neutral-400">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-neutral-400 mb-1">{resourceStats.depleted}</div>
            <div className="text-xs text-neutral-400">Depleted</div>
          </div>
        </div>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-neutral-800/30 rounded animate-pulse" />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-8">No humanitarian resource data available</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className={`bg-neutral-800/50 border ${getStatusBorderColor(resource.status)} rounded-lg p-3 hover:border-neutral-600 transition-colors`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getResourceIcon(resource.resource_type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusColor(resource.status)}>
                        {resource.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {resource.resource_type}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      <span className="text-sm font-semibold text-white">{resource.location}</span>
                    </div>

                    <div className="text-xs text-neutral-300 mb-2">
                      <span className="text-neutral-400">Quantity:</span> {resource.quantity}
                    </div>

                    {resource.notes && (
                      <p className="text-xs text-neutral-400 mb-2">{resource.notes}</p>
                    )}

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-700">
                      <span className="text-neutral-500">
                        Provider: <span className="text-neutral-400">{resource.provider}</span>
                      </span>
                      <span className="text-neutral-600">
                        Updated: {new Date(resource.last_updated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-5 border-t border-neutral-800">
        <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <Heart className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-neutral-300">
            <span className="font-semibold text-blue-400">Aid Coordination:</span> Resource data is updated regularly
            from humanitarian organizations including WHO, UNICEF, WFP, and Red Cross/Crescent societies.
          </div>
        </div>
      </div>
    </Card>
  );
}

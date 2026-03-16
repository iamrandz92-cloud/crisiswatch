'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Crosshair, Navigation, MessageSquare, Map, Satellite, Mountain } from 'lucide-react';
import type { MapType } from './MapComponent';
import { useTranslation } from '@/hooks/use-translation';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-neutral-950">
      <div className="text-center">
        <div className="text-4xl mb-2">🗺️</div>
        <p className="text-neutral-500 text-sm">Loading map...</p>
      </div>
    </div>
  )
});

interface EscalationEvent {
  id: string;
  event_type: string;
  severity: number;
  location: string;
  description: string;
  verified: boolean;
  created_at: string;
  latitude?: number;
  longitude?: number;
}

export function ConflictMap() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<EscalationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapType, setMapType] = useState<MapType>('normal');

  const fetchEvents = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('escalation_events')
        .select('*')
        .eq('verified', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setEvents(data);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    fetchEvents();

    const interval = setInterval(fetchEvents, 60000);

    const subscription = supabase
      .channel('escalation_events_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'escalation_events',
        },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
    };
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'missile_launch':
      case 'airstrike':
      case 'drone_strike':
        return <Crosshair className="w-4 h-4 text-red-400" />;
      case 'ground_operation':
      case 'naval_activity':
        return <Navigation className="w-4 h-4 text-orange-400" />;
      case 'diplomatic':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      default:
        return <MapPin className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return 'bg-red-500';
    if (severity >= 6) return 'bg-orange-500';
    if (severity >= 4) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <Card className="bg-neutral-900/50 border-neutral-800 overflow-hidden">
      <div className="p-5 border-b border-neutral-800">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-white">{t('conflictMap')}</h3>
            <p className="text-sm text-neutral-400 mt-1">
              {t('mapDescription')}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMapType('normal')}
              className={`p-2 rounded-lg transition-all ${
                mapType === 'normal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
              title="Normal Map"
            >
              <Map className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`p-2 rounded-lg transition-all ${
                mapType === 'satellite'
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
              title="Satellite View"
            >
              <Satellite className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMapType('3d')}
              className={`p-2 rounded-lg transition-all ${
                mapType === '3d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
              title="3D Terrain"
            >
              <Mountain className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative bg-neutral-950 h-96 overflow-hidden">
        <MapComponent events={events.filter(e => e.latitude && e.longitude)} mapType={mapType} />
      </div>

      <div className="p-5 border-t border-neutral-800">
        <h4 className="text-sm font-medium text-white mb-3 flex items-center justify-between">
          <span>{t('recentEvents')}</span>
          {events.length > 0 && (
            <Badge variant="outline" className="text-xs">{events.length}</Badge>
          )}
        </h4>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-neutral-800/30 rounded animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-4">{t('noEvents')}</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 rounded bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
              >
                <div className="mt-1">{getEventIcon(event.event_type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${getSeverityColor(event.severity)}`} />
                    <span className="text-sm font-medium text-white">
                      {event.location}
                    </span>
                    <Badge variant="outline" className="text-xs ml-auto">
                      {event.event_type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {event.description}
                  </p>
                  <p className="text-xs text-neutral-600 mt-1">
                    {t('severity')}: {event.severity}/10
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-neutral-800">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-neutral-400">{t('critical')} (8-10)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-neutral-400">{t('high')} (6-7)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-neutral-400">{t('medium')} (4-5)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-neutral-400">{t('low')} (1-3)</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

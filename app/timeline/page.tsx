'use client';

import { useState, useEffect } from 'react';
import { supabase, EscalationEvent } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { VerificationBadge } from '@/components/VerificationBadge';
import { AdBanner } from '@/components/AdBanner';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Zap, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export default function TimelinePage() {
  const [events, setEvents] = useState<EscalationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  const fetchEvents = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let query = supabase
        .from('escalation_events')
        .select('*')
        .eq('verified', true)
        .order('created_at', { ascending: false })
        .limit(100);

      if (filter) {
        query = query.eq('event_type', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supabase) {
      fetchEvents();
    } else {
      setLoading(false);
    }
  }, [filter]);

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return 'bg-red-500';
    if (severity >= 6) return 'bg-orange-500';
    if (severity >= 4) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'missile_launch':
        return '🚀';
      case 'airstrike':
        return '💥';
      case 'drone_strike':
        return '🛸';
      case 'ground_operation':
        return '⚔️';
      case 'naval_activity':
        return '⚓';
      case 'diplomatic':
        return '🤝';
      case 'ceasefire':
        return '🕊️';
      default:
        return '📍';
    }
  };

  const eventTypes = [
    { value: 'missile_launch', label: 'Missile Launch' },
    { value: 'airstrike', label: 'Airstrike' },
    { value: 'drone_strike', label: 'Drone Strike' },
    { value: 'ground_operation', label: 'Ground Operation' },
    { value: 'naval_activity', label: 'Naval Activity' },
    { value: 'diplomatic', label: 'Diplomatic' },
    { value: 'ceasefire', label: 'Ceasefire' },
  ];

  const groupEventsByDate = (events: EscalationEvent[]) => {
    const grouped: { [key: string]: EscalationEvent[] } = {};

    events.forEach((event) => {
      const date = format(new Date(event.created_at), 'MMMM d, yyyy');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });

    return grouped;
  };

  const groupedEvents = groupEventsByDate(events);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-950">
      <Header />

      <AdBanner position="top" className="mx-4 mt-4" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">War Timeline</h1>
              <p className="text-neutral-400">
                Complete chronological record of verified conflict events
              </p>
            </div>
            <Button
              onClick={fetchEvents}
              variant="outline"
              size="sm"
              className="bg-neutral-900 border-neutral-700 hover:bg-neutral-800"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter(null)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              All Events
            </button>
            {eventTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilter(type.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === type.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {Object.keys(groupedEvents).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedEvents).map(([date, dateEvents]) => (
                  <div key={date}>
                    <div className="sticky top-20 bg-neutral-950/90 backdrop-blur-sm border border-neutral-800 rounded-lg px-4 py-2 mb-4 z-10">
                      <div className="flex items-center gap-2 text-white font-semibold">
                        <Clock className="w-4 h-4 text-blue-400" />
                        {date}
                      </div>
                    </div>

                    <div className="relative pl-8 space-y-4">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-neutral-800"></div>

                      {dateEvents.map((event, index) => (
                        <div key={event.id} className="relative">
                          <div
                            className={`absolute -left-[1.9rem] top-3 w-6 h-6 rounded-full ${getSeverityColor(
                              event.severity
                            )} border-4 border-neutral-950 flex items-center justify-center text-xs z-10`}
                          >
                            {event.severity}
                          </div>

                          <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-5 hover:border-neutral-700 transition-all">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex items-center gap-3">
                                <div className="text-3xl">{getEventIcon(event.event_type)}</div>
                                <div>
                                  <div className="text-sm text-neutral-500 mb-1">
                                    {format(new Date(event.created_at), 'h:mm a')}
                                  </div>
                                  <h3 className="text-lg font-semibold text-white capitalize">
                                    {event.event_type.replace('_', ' ')}
                                  </h3>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div
                                  className={`px-2 py-1 rounded text-xs font-bold ${getSeverityColor(
                                    event.severity
                                  )}/20 ${getSeverityColor(event.severity).replace('bg-', 'text-')}`}
                                >
                                  Severity {event.severity}/10
                                </div>
                              </div>
                            </div>

                            <p className="text-neutral-300 mb-3">{event.description}</p>

                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1.5 text-neutral-400">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                              </div>
                              {event.verified && (
                                <div className="flex items-center gap-1.5 text-emerald-400">
                                  <Zap className="w-4 h-4" />
                                  Verified
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-neutral-900/50 border border-neutral-800 rounded-lg">
                <p className="text-neutral-400">
                  {loading ? 'Loading timeline...' : 'No events found'}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-white mb-4">
                Severity Scale
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <div>
                    <div className="text-sm font-medium text-white">Critical (8-10)</div>
                    <p className="text-xs text-neutral-500">Major military action</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <div>
                    <div className="text-sm font-medium text-white">High (6-7)</div>
                    <p className="text-xs text-neutral-500">Significant incident</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <div>
                    <div className="text-sm font-medium text-white">Medium (4-5)</div>
                    <p className="text-xs text-neutral-500">Notable activity</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <div>
                    <div className="text-sm font-medium text-white">Low (1-3)</div>
                    <p className="text-xs text-neutral-500">Minor event</p>
                  </div>
                </div>
              </div>
            </div>

            <AdBanner position="sidebar" />

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-white mb-3">
                Event Types
              </h3>
              <div className="space-y-2 text-sm">
                {eventTypes.map((type) => (
                  <div key={type.value} className="flex items-center gap-2 text-neutral-400">
                    <span className="text-lg">{getEventIcon(type.value)}</span>
                    {type.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <AdBanner position="footer" className="mx-4 mb-4 mt-8" />

      <footer className="bg-black border-t border-neutral-800 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-neutral-500 text-sm">
          <p>© 2024 Conflict Watch. Real-time news aggregation platform.</p>
        </div>
      </footer>
    </div>
  );
}

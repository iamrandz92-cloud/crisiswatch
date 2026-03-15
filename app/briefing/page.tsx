'use client';

import { useState, useEffect } from 'react';
import { supabase, DailyBriefing } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { AdBanner } from '@/components/AdBanner';
import { Card } from '@/components/ui/card';
import { Calendar, FileText, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, TrendingUp, Users, Shield } from 'lucide-react';
import { format } from 'date-fns';

export default function BriefingPage() {
  const [briefings, setBriefings] = useState<DailyBriefing[]>([]);
  const [selectedBriefing, setSelectedBriefing] = useState<DailyBriefing | null>(null);

  useEffect(() => {
    const fetchBriefings = async () => {
      if (!supabase) return;

      const { data } = await supabase
        .from('daily_briefings')
        .select('*')
        .order('briefing_date', { ascending: false })
        .limit(30);

      if (data && data.length > 0) {
        setBriefings(data);
        setSelectedBriefing(data[0]);
      }
    };

    fetchBriefings();
  }, []);

  if (!selectedBriefing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-950">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center py-12 bg-neutral-900/50 border border-neutral-800 rounded-lg">
            <FileText className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
            <p className="text-neutral-400">No briefings available yet</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-950">
      <Header />

      <AdBanner position="top" className="mx-4 mt-4" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Daily War Briefing</h1>
              <p className="text-neutral-400">
                Comprehensive daily summaries of conflict developments
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-gradient-to-br from-blue-600/20 to-transparent border-blue-500/30">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">
                      {format(new Date(selectedBriefing.briefing_date), 'MMMM d, yyyy')}
                    </h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-neutral-400">Confirmed</div>
                      <div className="text-xl font-bold text-emerald-400">
                        {selectedBriefing.confirmed_count}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-neutral-400">Developing</div>
                      <div className="text-xl font-bold text-amber-400">
                        {selectedBriefing.developing_count}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-neutral-300 leading-relaxed">
                    {selectedBriefing.summary}
                  </p>
                </div>
              </div>
            </Card>

            {selectedBriefing.key_events && selectedBriefing.key_events.length > 0 && (
              <Card className="bg-neutral-900/50 border-neutral-800">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-orange-400" />
                    <h3 className="text-xl font-bold text-white">Key Events</h3>
                  </div>

                  <div className="space-y-3">
                    {selectedBriefing.key_events.map((event: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700"
                      >
                        <div className="w-8 h-8 bg-orange-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-orange-400">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-neutral-300">{event.description || event}</p>
                          {event.time && (
                            <p className="text-xs text-neutral-500 mt-1">{event.time}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {selectedBriefing.military_movements && (
              <Card className="bg-neutral-900/50 border-neutral-800">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-red-400" />
                    <h3 className="text-xl font-bold text-white">Military Movements</h3>
                  </div>
                  <p className="text-neutral-300 leading-relaxed whitespace-pre-line">
                    {selectedBriefing.military_movements}
                  </p>
                </div>
              </Card>
            )}

            {selectedBriefing.diplomatic_updates && (
              <Card className="bg-neutral-900/50 border-neutral-800">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">Diplomatic Updates</h3>
                  </div>
                  <p className="text-neutral-300 leading-relaxed whitespace-pre-line">
                    {selectedBriefing.diplomatic_updates}
                  </p>
                </div>
              </Card>
            )}

            {selectedBriefing.potential_developments && (
              <Card className="bg-neutral-900/50 border-neutral-800">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-xl font-bold text-white">Potential Developments</h3>
                  </div>
                  <p className="text-neutral-300 leading-relaxed whitespace-pre-line">
                    {selectedBriefing.potential_developments}
                  </p>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card className="bg-neutral-900/50 border-neutral-800">
              <div className="p-4 border-b border-neutral-800">
                <h3 className="text-lg font-semibold text-white">Recent Briefings</h3>
              </div>
              <div className="divide-y divide-neutral-800 max-h-[600px] overflow-y-auto">
                {briefings.map((briefing) => (
                  <button
                    key={briefing.id}
                    onClick={() => setSelectedBriefing(briefing)}
                    className={`w-full p-4 text-left transition-colors ${
                      selectedBriefing.id === briefing.id
                        ? 'bg-blue-600/20 border-l-4 border-blue-500'
                        : 'hover:bg-neutral-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-white">
                        {format(new Date(briefing.briefing_date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        {briefing.confirmed_count}
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        <AlertCircle className="w-3 h-3" />
                        {briefing.developing_count}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <AdBanner position="sidebar" />

            <Card className="bg-neutral-900/50 border-neutral-800 p-5">
              <h3 className="text-lg font-semibold text-white mb-3">
                About Briefings
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Daily briefings are compiled from verified news sources and OSINT
                reports. Each briefing provides a comprehensive overview of the
                day's most significant developments.
              </p>
            </Card>
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

'use client';

import { useState, useEffect } from 'react';
import { supabase, CivilianSafety } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { AdBanner } from '@/components/AdBanner';
import { Card } from '@/components/ui/card';
import { Shield, TriangleAlert as AlertTriangle, Phone, MapPin, Navigation, OctagonAlert as AlertOctagon, Heart } from 'lucide-react';

export default function SafetyPage() {
  const [alerts, setAlerts] = useState<CivilianSafety[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!supabase) return;

      const { data } = await supabase
        .from('civilian_safety')
        .select('*')
        .eq('active', true)
        .order('priority', { ascending: false });

      if (data) {
        setAlerts(data);
      }
    };

    if (supabase) {
      fetchAlerts();

      const subscription = supabase
        .channel('safety_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'civilian_safety',
          },
          () => {
            fetchAlerts();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return {
          color: 'bg-red-500',
          textColor: 'text-red-400',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500',
          label: 'URGENT',
        };
      case 'high':
        return {
          color: 'bg-orange-500',
          textColor: 'text-orange-400',
          bgColor: 'bg-orange-500/20',
          borderColor: 'border-orange-500',
          label: 'HIGH',
        };
      case 'medium':
        return {
          color: 'bg-yellow-500',
          textColor: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500',
          label: 'MEDIUM',
        };
      case 'low':
        return {
          color: 'bg-blue-500',
          textColor: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500',
          label: 'INFO',
        };
      default:
        return {
          color: 'bg-neutral-500',
          textColor: 'text-neutral-400',
          bgColor: 'bg-neutral-500/20',
          borderColor: 'border-neutral-500',
          label: 'NOTICE',
        };
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'shelter':
        return Shield;
      case 'evacuation':
        return Navigation;
      case 'emergency':
        return AlertOctagon;
      case 'safe_zone':
        return Heart;
      default:
        return AlertTriangle;
    }
  };

  const groupAlertsByRegion = (alerts: CivilianSafety[]) => {
    const grouped: { [key: string]: CivilianSafety[] } = {};

    alerts.forEach((alert) => {
      if (!grouped[alert.region]) {
        grouped[alert.region] = [];
      }
      grouped[alert.region].push(alert);
    });

    return grouped;
  };

  const groupedAlerts = groupAlertsByRegion(alerts);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-950">
      <Header />

      <AdBanner position="top" className="mx-4 mt-4" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-emerald-600/20 rounded-lg border border-emerald-500/30">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Civilian Safety Information
              </h1>
              <p className="text-neutral-400">
                Emergency contacts, shelter locations, and safety alerts
              </p>
            </div>
          </div>

          <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-300">
                <p className="font-semibold mb-1">Important Information</p>
                <p>
                  This page provides critical safety information for civilians in
                  conflict areas. Always follow official government guidance and
                  local authorities. In case of emergency, contact your local
                  emergency services immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-emerald-600/20 border-emerald-500/30 p-6">
            <Shield className="w-10 h-10 text-emerald-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Emergency Services
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-neutral-300">
                <span>Israel:</span>
                <a href="tel:100" className="text-emerald-400 font-bold">
                  100
                </a>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span>Medical:</span>
                <a href="tel:101" className="text-emerald-400 font-bold">
                  101
                </a>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span>Fire:</span>
                <a href="tel:102" className="text-emerald-400 font-bold">
                  102
                </a>
              </div>
            </div>
          </Card>

          <Card className="bg-orange-600/20 border-orange-500/30 p-6">
            <AlertOctagon className="w-10 h-10 text-orange-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Air Raid Alerts
            </h3>
            <p className="text-sm text-neutral-300 mb-3">
              If you hear sirens, immediately seek shelter in a protected space.
            </p>
            <div className="text-xs text-neutral-400">
              <p>Time to shelter:</p>
              <p className="text-orange-400 font-bold">15-90 seconds</p>
            </div>
          </Card>

          <Card className="bg-blue-600/20 border-blue-500/30 p-6">
            <Phone className="w-10 h-10 text-blue-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Helplines
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-neutral-300">
                <span>Red Cross:</span>
                <span className="text-blue-400 font-bold">+972-3-5271333</span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span>Mental Health:</span>
                <span className="text-blue-400 font-bold">1201</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {Object.entries(groupedAlerts).map(([region, regionAlerts]) => (
              <div key={region}>
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <h2 className="text-lg font-semibold text-white">{region}</h2>
                  </div>
                </div>

                <div className="space-y-4">
                  {regionAlerts.map((alert) => {
                    const config = getPriorityConfig(alert.priority);
                    const Icon = getAlertIcon(alert.alert_type);

                    return (
                      <Card
                        key={alert.id}
                        className={`${config.bgColor} border-2 ${config.borderColor} p-5`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 ${config.color} rounded-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-white">
                                {alert.title}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded text-xs font-bold ${config.textColor}`}
                              >
                                {config.label}
                              </span>
                            </div>

                            <p className="text-neutral-300 mb-4">
                              {alert.description}
                            </p>

                            {alert.contact_numbers && (
                              <div className="mb-3">
                                <div className="text-sm font-medium text-neutral-400 mb-2">
                                  Emergency Contacts:
                                </div>
                                <div className="flex flex-wrap gap-3">
                                  {Object.entries(alert.contact_numbers).map(
                                    ([key, value]) => (
                                      <a
                                        key={key}
                                        href={`tel:${value}`}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 rounded-lg text-sm text-emerald-400 hover:bg-neutral-800 transition-colors"
                                      >
                                        <Phone className="w-3.5 h-3.5" />
                                        {String(value)}
                                      </a>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="text-xs text-neutral-500 capitalize">
                              Type: {alert.alert_type.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}

            {alerts.length === 0 && (
              <div className="text-center py-12 bg-neutral-900/50 border border-neutral-800 rounded-lg">
                <Shield className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="text-neutral-400">No active safety alerts at this time</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <AdBanner position="sidebar" />

            <Card className="bg-neutral-900/50 border-neutral-800 p-5">
              <h3 className="text-lg font-semibold text-white mb-4">
                Safety Guidelines
              </h3>
              <div className="space-y-3 text-sm text-neutral-400">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Always have an emergency kit ready with water, food, and medical supplies</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Know the location of the nearest shelter</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Keep your mobile phone charged</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Follow official government alerts</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Stay away from windows during alerts</p>
                </div>
              </div>
            </Card>

            <Card className="bg-neutral-900/50 border-neutral-800 p-5">
              <h3 className="text-lg font-semibold text-white mb-3">
                Alert Types
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-neutral-400">Shelter Locations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-orange-400" />
                  <span className="text-neutral-400">Evacuation Routes</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-400" />
                  <span className="text-neutral-400">Emergency Alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-blue-400" />
                  <span className="text-neutral-400">Safe Zones</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <AdBanner position="footer" className="mx-4 mb-4 mt-8" />

      <footer className="bg-black border-t border-neutral-800 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-neutral-500 text-sm">
          <p>© 2024 Conflict Watch. Real-time news aggregation platform.</p>
          <p className="mt-2">
            Always follow official government guidance during emergencies
          </p>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, TriangleAlert as AlertTriangle, Radio, MessageSquare } from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  message: string;
  alert_type: string;
  priority: string;
  sent: boolean;
  created_at: string;
}

export function EmergencyAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('sent', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (!error && data) {
        setAlerts(data);
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    fetchAlerts();

    const subscription = supabase
      .channel('alerts_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alerts',
        },
        () => {
          fetchAlerts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'missile': return '🚀';
      case 'airstrike': return '✈️';
      case 'diplomatic': return '🤝';
      case 'ceasefire': return '🕊️';
      default: return '📢';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getAlertBorderColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500/50';
      case 'high': return 'border-orange-500/50';
      case 'medium': return 'border-yellow-500/50';
      default: return 'border-blue-500/50';
    }
  };

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <div className="p-5 border-b border-neutral-800">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-5 h-5 text-red-400 animate-pulse" />
          <h3 className="text-lg font-semibold text-white">Emergency Alert System</h3>
        </div>
        <p className="text-sm text-neutral-400">Real-time critical notifications and breaking developments</p>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-neutral-800/30 rounded animate-pulse" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8">
            <Radio className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <p className="text-sm text-neutral-500">No active alerts</p>
            <p className="text-xs text-neutral-600 mt-1">System monitoring for critical events</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-neutral-800/50 border-2 ${getAlertBorderColor(alert.priority)} rounded-lg p-4 hover:border-opacity-70 transition-all`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl mt-0.5">{getAlertIcon(alert.alert_type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getPriorityColor(alert.priority)}>
                        {alert.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {alert.alert_type.replace('_', ' ')}
                      </Badge>
                    </div>

                    <h4 className="text-sm font-semibold text-white mb-2">{alert.title}</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed">{alert.message}</p>

                    <div className="mt-3 pt-3 border-t border-neutral-700 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Radio className="w-3 h-3" />
                        Broadcast
                      </span>
                      <span className="text-neutral-500">
                        {new Date(alert.created_at).toLocaleString()}
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
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-neutral-300">
            <span className="font-semibold text-red-400">Live Monitoring:</span> Emergency alerts are broadcast immediately
            as critical events occur. Enable notifications to receive instant updates.
          </div>
        </div>
      </div>
    </Card>
  );
}

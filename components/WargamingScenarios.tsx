'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, TrendingUp, TriangleAlert as AlertTriangle, Target } from 'lucide-react';

interface WargameScenario {
  id: string;
  scenario_name: string;
  description: string;
  scenario_type: string;
  starting_conditions: Record<string, any>;
  possible_actions: Array<{ id: string; action: string; probability: number }>;
  outcomes: Array<{ action_id: string; outcome: string; escalation_level: number; [key: string]: any }>;
  active: boolean;
  created_at: string;
}

export function WargamingScenarios() {
  const [scenarios, setScenarios] = useState<WargameScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<WargameScenario | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchScenarios = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('wargame_scenarios')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setScenarios(data);
        if (!selectedScenario && data.length > 0) {
          setSelectedScenario(data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching wargame scenarios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    fetchScenarios();
  }, []);

  const getScenarioColor = (type: string) => {
    switch (type) {
      case 'escalation': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'de-escalation': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'diplomatic': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'military': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'humanitarian': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    }
  };

  const getEscalationColor = (level: number) => {
    if (level >= 9) return 'text-red-400';
    if (level >= 7) return 'text-orange-400';
    if (level >= 5) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'bg-red-500';
    if (probability >= 50) return 'bg-orange-500';
    if (probability >= 30) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <div className="p-5 border-b border-neutral-800">
        <div className="flex items-center gap-2 mb-1">
          <Gamepad2 className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Interactive Wargaming Scenarios</h3>
        </div>
        <p className="text-sm text-neutral-400">Explore potential conflict scenarios and outcomes</p>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="h-96 bg-neutral-800/30 rounded animate-pulse" />
        ) : scenarios.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-8">No active scenarios available</p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario)}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    selectedScenario?.id === scenario.id
                      ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/50'
                      : 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-600'
                  }`}
                >
                  <Badge className={getScenarioColor(scenario.scenario_type)}>
                    {scenario.scenario_type}
                  </Badge>
                  <h4 className="text-sm font-semibold text-white mt-2">{scenario.scenario_name}</h4>
                </button>
              ))}
            </div>

            {selectedScenario && (
              <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-5">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-white">{selectedScenario.scenario_name}</h3>
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                    {selectedScenario.description}
                  </p>

                  <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-semibold text-white">Starting Conditions</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {Object.entries(selectedScenario.starting_conditions).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-2">
                          <span className="text-blue-400">•</span>
                          <span className="text-neutral-400">
                            <span className="capitalize text-neutral-300">{key.replace(/_/g, ' ')}:</span>{' '}
                            {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-semibold text-white">Possible Actions</span>
                  </div>
                  <div className="space-y-2">
                    {selectedScenario.possible_actions.map((action) => (
                      <div key={action.id} className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white font-medium">{action.action}</span>
                          <span className="text-xs font-bold" style={{ color: action.probability >= 70 ? '#ef4444' : action.probability >= 50 ? '#f97316' : action.probability >= 30 ? '#eab308' : '#3b82f6' }}>
                            {action.probability}%
                          </span>
                        </div>
                        <div className="w-full bg-neutral-700 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${getProbabilityColor(action.probability)}`}
                            style={{ width: `${action.probability}%` }}
                          />
                        </div>

                        {selectedScenario.outcomes
                          .filter((outcome) => outcome.action_id === action.id)
                          .map((outcome, idx) => (
                            <div key={idx} className="mt-2 pt-2 border-t border-neutral-700">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-neutral-400">→ {outcome.outcome}</span>
                                <span className={`font-semibold ${getEscalationColor(outcome.escalation_level)}`}>
                                  Escalation: {outcome.escalation_level}/10
                                </span>
                              </div>
                              {outcome.civilian_impact && (
                                <div className="text-xs text-neutral-500 mt-1">
                                  Civilian Impact: {outcome.civilian_impact}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Gamepad2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-neutral-300">
                      <span className="font-semibold text-green-400">Scenario Simulation:</span> These wargaming scenarios
                      use probability analysis and historical data to model potential conflict outcomes. Each action's
                      likelihood is based on expert assessments and current intelligence.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

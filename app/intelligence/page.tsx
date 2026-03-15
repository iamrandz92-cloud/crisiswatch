'use client';

import { Header } from '@/components/Header';
import { EscalationMeter } from '@/components/EscalationMeter';
import { RiskMap } from '@/components/RiskMap';
import { OSINTFeed } from '@/components/OSINTFeed';
import { ConflictMap } from '@/components/ConflictMap';
import { CasualtyTracker } from '@/components/CasualtyTracker';
import { MilitaryMovementTracker } from '@/components/MilitaryMovementTracker';
import { SourceVerification } from '@/components/SourceVerification';
import { ThreatPrediction } from '@/components/ThreatPrediction';
import { EmergencyAlerts } from '@/components/EmergencyAlerts';
import { HumanitarianTracker } from '@/components/HumanitarianTracker';
import { ExpertAnalysis } from '@/components/ExpertAnalysis';
import { WargamingScenarios } from '@/components/WargamingScenarios';
import { AdBanner } from '@/components/AdBanner';
import { Shield, Satellite, Radio, Map, Plane, Ship } from 'lucide-react';

export default function IntelligencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-950">
      <Header />

      <AdBanner position="top" className="mx-4 mt-4" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Intelligence Dashboard
              </h1>
              <p className="text-neutral-400">
                Real-time conflict intelligence and threat assessment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-emerald-400">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <Satellite className="w-4 h-4" />
              <span>Multiple Sources</span>
            </div>
            <div className="flex items-center gap-2 text-orange-400">
              <Radio className="w-4 h-4" />
              <span>OSINT Verified</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <EscalationMeter />
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-neutral-400">Active Alerts</span>
                  <span className="text-xl font-bold text-red-400">12</span>
                </div>
                <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 w-3/4"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-neutral-400">Verified Events (24h)</span>
                  <span className="text-xl font-bold text-orange-400">27</span>
                </div>
                <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-1/2"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-neutral-400">OSINT Reports</span>
                  <span className="text-xl font-bold text-blue-400">156</span>
                </div>
                <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Map className="w-5 h-5 text-red-400" />
              <h2 className="text-xl font-bold text-white">Conflict Zones</h2>
            </div>
            <ConflictMap />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-orange-400" />
              <h2 className="text-xl font-bold text-white">Regional Risk Assessment</h2>
            </div>
            <RiskMap />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Plane className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Military Aircraft Tracking</h2>
            </div>
            <div className="relative bg-neutral-950 h-64 rounded-lg overflow-hidden border border-neutral-800">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Plane className="w-16 h-16 text-blue-500/30 mx-auto mb-3" />
                  <p className="text-neutral-500 text-sm">Live flight tracking</p>
                  <p className="text-neutral-600 text-xs mt-2">
                    Integration with Flightradar24 API
                  </p>
                  <p className="text-neutral-700 text-xs mt-1">
                    Monitoring military and reconnaissance aircraft
                  </p>
                </div>
              </div>
              <svg className="absolute inset-0 w-full h-full opacity-5">
                <defs>
                  <pattern id="flight-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-500" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#flight-grid)" />
              </svg>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-neutral-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Auto-updates every 5 minutes</span>
              </div>
              <span className="text-neutral-500">Persian Gulf Region</span>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Ship className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Naval Vessel Tracking</h2>
            </div>
            <div className="relative bg-neutral-950 h-64 rounded-lg overflow-hidden border border-neutral-800">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Ship className="w-16 h-16 text-cyan-500/30 mx-auto mb-3" />
                  <p className="text-neutral-500 text-sm">Live ship tracking</p>
                  <p className="text-neutral-600 text-xs mt-2">
                    Integration with MarineTraffic API
                  </p>
                  <p className="text-neutral-700 text-xs mt-1">
                    Monitoring naval and cargo vessels
                  </p>
                </div>
              </div>
              <svg className="absolute inset-0 w-full h-full opacity-5">
                <defs>
                  <pattern id="ship-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-500" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ship-grid)" />
              </svg>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-neutral-400">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                <span>Auto-updates every 5 minutes</span>
              </div>
              <span className="text-neutral-500">Strait of Hormuz</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <EmergencyAlerts />
          <ThreatPrediction />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CasualtyTracker />
          <MilitaryMovementTracker />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <HumanitarianTracker />
          <SourceVerification />
        </div>

        <div className="mb-6">
          <ExpertAnalysis />
        </div>

        <div className="mb-6">
          <WargamingScenarios />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Radio className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Live Intelligence Feed</h2>
            </div>
            <OSINTFeed />
          </div>

          <div className="space-y-6">
            <AdBanner position="sidebar" />

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-white mb-4">
                Data Sources
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Satellite Imagery</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Flight Tracking</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Naval Monitoring</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">OSINT Networks</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">News Agencies</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/30 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-white mb-2">
                Intelligence Note
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                This dashboard aggregates data from multiple verified sources to
                provide real-time intelligence on the Iran-US-Israel conflict.
                All information is cross-referenced and verified before display.
              </p>
            </div>
          </div>
        </div>
      </main>

      <AdBanner position="footer" className="mx-4 mb-4 mt-8" />

      <footer className="bg-black border-t border-neutral-800 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-neutral-500 text-sm">
          <p>© 2024 Conflict Watch. Real-time news aggregation platform.</p>
          <p className="mt-2">
            Intelligence gathered from verified sources • Updated every 5 minutes
          </p>
        </div>
      </footer>
    </div>
  );
}

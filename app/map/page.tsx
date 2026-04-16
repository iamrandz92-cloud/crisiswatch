'use client';

import { Header } from '@/components/Header';
import { ConflictMap } from '@/components/ConflictMap';
import { AdBanner } from '@/components/AdBanner';

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-950">
      <Header />

      <AdBanner position="top" className="mx-4 mt-4" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Interactive Conflict Map</h1>
          <p className="text-neutral-400">
            Visualize reported events across the Middle East region
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ConflictMap />
          </div>

          <div className="space-y-4">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-white mb-4">
                Map Legend
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1"></div>
                  <div>
                    <div className="text-white font-medium text-sm">Strike</div>
                    <p className="text-xs text-neutral-500">
                      Reported military strikes and attacks
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mt-1"></div>
                  <div>
                    <div className="text-white font-medium text-sm">Military Movement</div>
                    <p className="text-xs text-neutral-500">
                      Troop movements and deployments
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1"></div>
                  <div>
                    <div className="text-white font-medium text-sm">Conflict Location</div>
                    <p className="text-xs text-neutral-500">
                      Key areas of ongoing conflict
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                  <div>
                    <div className="text-white font-medium text-sm">Diplomatic</div>
                    <p className="text-xs text-neutral-500">
                      Diplomatic meetings and activities
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <AdBanner position="sidebar" />

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-white mb-3">
                About the Map
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                This interactive map displays geolocated events from verified news
                sources. Locations are determined based on article content and are
                updated in real-time as new information becomes available.
              </p>
              <p className="text-sm text-neutral-500 mt-3">
                Note: A full interactive map with pan and zoom capabilities requires
                integration with a mapping library such as Mapbox or Leaflet.
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
            All news sourced from verified international news agencies.
          </p>
        </div>
      </footer>
    </div>
  );
}

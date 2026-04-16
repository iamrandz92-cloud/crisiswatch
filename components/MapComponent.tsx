'use client';

import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Badge } from '@/components/ui/badge';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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

export type MapType = 'normal' | 'satellite' | '3d';

interface MapComponentProps {
  events: EscalationEvent[];
  mapType?: MapType;
}

const getSeverityColor = (severity: number) => {
  if (severity >= 8) return '#ef4444';
  if (severity >= 6) return '#f97316';
  if (severity >= 4) return '#eab308';
  return '#3b82f6';
};

const MapComponent = ({ events, mapType = 'normal' }: MapComponentProps) => {
  const defaultCenter: [number, number] = [32.0, 35.0];
  const defaultZoom = 5;

  const getTileLayerConfig = () => {
    switch (mapType) {
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
        };
      case '3d':
        return {
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
        };
      case 'normal':
      default:
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        };
    }
  };

  if (events.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-neutral-950">
        <div className="text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="text-neutral-500 text-sm">
            No events with coordinates available
          </p>
          <p className="text-neutral-600 text-xs mt-2">
            Events will appear on the map once coordinates are added
          </p>
        </div>
      </div>
    );
  }

  const tileConfig = getTileLayerConfig();

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution={tileConfig.attribution}
        url={tileConfig.url}
      />

      {events.map((event) => {
        if (!event.latitude || !event.longitude) return null;

        return (
          <CircleMarker
            key={event.id}
            center={[event.latitude, event.longitude]}
            radius={8 + (event.severity / 2)}
            pathOptions={{
              color: getSeverityColor(event.severity),
              fillColor: getSeverityColor(event.severity),
              fillOpacity: 0.6,
              weight: 2,
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getSeverityColor(event.severity) }}
                  />
                  <span className="font-semibold text-sm">{event.location}</span>
                </div>
                <Badge variant="outline" className="text-xs mb-2">
                  {event.event_type.replace('_', ' ')}
                </Badge>
                <p className="text-xs text-neutral-700 mb-2">
                  {event.description}
                </p>
                <div className="text-xs text-neutral-500">
                  Severity: {event.severity}/10
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {new Date(event.created_at).toLocaleString()}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;

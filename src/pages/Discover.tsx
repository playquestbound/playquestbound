import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Globe, Map, Lock, CheckCircle, ChevronRight, Sparkles } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Unlockable {
  id: string;
  name: string;
  location: string;
  distance: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  claimed: boolean;
  lat: number;
  lng: number;
  thumbnail: string;
}

interface Collection {
  id: string;
  name: string;
  region: string;
  progress: number;
  total: number;
  flag: string;
}

const mockUnlockables: Unlockable[] = [
  { id: '1', name: 'Ancient Compass', location: 'Central Park', distance: 0.8, rarity: 'rare', claimed: false, lat: 40.785091, lng: -73.968285, thumbnail: '🧭' },
  { id: '2', name: 'Explorer\'s Badge', location: 'Times Square', distance: 2.3, rarity: 'common', claimed: true, lat: 40.758896, lng: -73.985130, thumbnail: '🎖️' },
  { id: '3', name: 'Golden Lantern', location: 'Brooklyn Bridge', distance: 5.1, rarity: 'epic', claimed: false, lat: 40.706086, lng: -73.996864, thumbnail: '🏮' },
  { id: '4', name: 'Mystic Scroll', location: 'Empire State', distance: 3.2, rarity: 'legendary', claimed: false, lat: 40.748817, lng: -73.985428, thumbnail: '📜' },
  { id: '5', name: 'Traveler\'s Coin', location: 'Statue of Liberty', distance: 12.5, rarity: 'uncommon', claimed: false, lat: 40.689247, lng: -74.044502, thumbnail: '🪙' },
];

const mockCollections: Collection[] = [
  { id: '1', name: 'NYC Landmarks', region: 'New York', progress: 2, total: 5, flag: '🗽' },
  { id: '2', name: 'European Castles', region: 'Europe', progress: 0, total: 8, flag: '🏰' },
  { id: '3', name: 'Asian Temples', region: 'Asia', progress: 1, total: 6, flag: '⛩️' },
  { id: '4', name: 'Desert Oases', region: 'Africa', progress: 0, total: 4, flag: '🏜️' },
];

const rarityColors = {
  common: 'bg-muted text-muted-foreground',
  uncommon: 'bg-green-900/50 text-green-400 border-green-700',
  rare: 'bg-blue-900/50 text-blue-400 border-blue-700',
  epic: 'bg-purple-900/50 text-purple-400 border-purple-700',
  legendary: 'bg-gold/20 text-gold border-gold',
};

export default function Discover() {
  const [viewMode, setViewMode] = useState<'nearby' | 'world'>('nearby');
  const [mapboxToken, setMapboxToken] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setUserLocation({ lat: 40.7128, lng: -74.006 });
        }
      );
    } else {
      setUserLocation({ lat: 40.7128, lng: -74.006 });
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !userLocation) return;

    let mapInstance: any = null;

    const initMap = async () => {
      try {
        const mapboxgl = (await import('mapbox-gl')).default;
        await import('mapbox-gl/dist/mapbox-gl.css');
        
        mapboxgl.accessToken = mapboxToken;

        mapInstance = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [userLocation.lng, userLocation.lat],
          zoom: 12,
        });

        mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');

        new mapboxgl.Marker({ color: '#c9a227' })
          .setLngLat([userLocation.lng, userLocation.lat])
          .addTo(mapInstance);

        mockUnlockables.forEach((item) => {
          const el = document.createElement('div');
          el.className = item.claimed ? 'unlockable-marker claimed' : 'unlockable-marker';
          el.innerHTML = item.claimed ? '✓' : '📍';
          el.style.cssText = `
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            background: ${item.claimed ? 'rgba(100, 100, 100, 0.8)' : 'rgba(201, 162, 39, 0.9)'};
            border-radius: 50%;
            border: 2px solid ${item.claimed ? '#666' : '#c9a227'};
            cursor: pointer;
            ${!item.claimed ? 'animation: pulse 2s infinite;' : ''}
          `;

          new mapboxgl.Marker(el)
            .setLngLat([item.lng, item.lat])
            .setPopup(new mapboxgl.Popup().setHTML(`<strong>${item.name}</strong><br/>${item.location}`))
            .addTo(mapInstance);
        });

        map.current = mapInstance;
        setMapReady(true);
      } catch (error) {
        console.error('Map initialization failed:', error);
      }
    };

    initMap();

    return () => {
      mapInstance?.remove();
    };
  }, [mapboxToken, userLocation]);

  const centerOnUser = () => {
    if (map.current && userLocation) {
      map.current.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 14 });
    }
  };

  const nearbyUnlockables = mockUnlockables.filter((u) => u.distance <= 50).sort((a, b) => a.distance - b.distance);
  const hasNearbyItems = nearbyUnlockables.length > 0;
  const nearestItem = mockUnlockables.sort((a, b) => a.distance - b.distance)[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d0d] via-[#2a2a2a] to-[#1a1a1a] pb-24">
      <header className="px-4 pt-6 pb-4">
        <h1 className="font-display text-2xl text-gold">Discover</h1>
        <p className="text-muted-foreground text-sm">Find exclusive items in the real world</p>
      </header>

      <div className="px-4 mb-4">
        <div className="flex bg-card/50 rounded-lg p-1 border border-border/30">
          <button
            onClick={() => setViewMode('nearby')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all text-sm font-medium',
              viewMode === 'nearby' ? 'bg-gold/20 text-gold' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Map className="w-4 h-4" />
            Nearby
          </button>
          <button
            onClick={() => setViewMode('world')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all text-sm font-medium',
              viewMode === 'world' ? 'bg-gold/20 text-gold' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Globe className="w-4 h-4" />
            World Map
          </button>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="relative h-[280px] rounded-xl overflow-hidden border border-border/30 bg-card/30">
          {!mapboxToken ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <MapPin className="w-12 h-12 text-gold/50 mb-4" />
              <p className="text-muted-foreground mb-4 text-sm">Enter your Mapbox public token to view the map</p>
              <Input
                type="text"
                placeholder="pk.eyJ1..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="max-w-xs bg-background/50 border-border/50"
              />
              <a
                href="https://mapbox.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/70 text-xs mt-2 underline"
              >
                Get your free token at mapbox.com
              </a>
            </div>
          ) : (
            <>
              <div ref={mapContainer} className="absolute inset-0" />
              <Button
                onClick={centerOnUser}
                size="sm"
                className="absolute bottom-3 right-3 bg-card/90 hover:bg-card border border-border/50 text-foreground"
              >
                <Navigation className="w-4 h-4 mr-1" />
                Center
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="px-4 mb-6">
        <h2 className="font-display text-lg text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold" />
          Nearby Unlockables
        </h2>

        {hasNearbyItems ? (
          <div className="space-y-3">
            {nearbyUnlockables.map((item) => (
              <Card
                key={item.id}
                className={cn(
                  'p-3 border-border/30 transition-all',
                  item.claimed ? 'bg-card/30 opacity-60' : 'bg-card/50 hover:bg-card/70',
                  !item.claimed && 'animate-pulse-subtle'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center text-2xl',
                      item.claimed ? 'bg-muted/30' : 'bg-gold/10 shadow-[0_0_15px_rgba(201,162,39,0.3)]'
                    )}
                  >
                    {item.thumbnail}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn('font-medium truncate', item.claimed && 'line-through text-muted-foreground')}>
                        {item.name}
                      </span>
                      {item.claimed && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge className={cn('text-xs mb-1', rarityColors[item.rarity])}>{item.rarity}</Badge>
                    <p className="text-xs text-muted-foreground">{item.distance} km</p>
                  </div>
                  {!item.claimed && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center bg-card/30 border-border/30">
            <Lock className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
            <h3 className="font-medium text-foreground mb-1">No discoveries nearby</h3>
            <p className="text-sm text-muted-foreground mb-4">Travel to new places to find exclusive items</p>
            {nearestItem && (
              <div className="bg-gold/10 rounded-lg p-3 inline-block">
                <p className="text-xs text-gold">Nearest unlockable:</p>
                <p className="font-medium text-foreground">
                  {nearestItem.name} - {nearestItem.distance} km away
                </p>
              </div>
            )}
          </Card>
        )}
      </div>

      <div className="px-4 mb-6">
        <h2 className="font-display text-lg text-foreground mb-3">Collections</h2>
        <ScrollArea className="w-full">
          <div className="flex gap-3 pb-2">
            {mockCollections.map((collection) => (
              <Card
                key={collection.id}
                className="flex-shrink-0 w-40 p-3 bg-card/40 border-border/30 hover:bg-card/60 transition-all cursor-pointer"
              >
                <div className="text-3xl mb-2">{collection.flag}</div>
                <h3 className="font-medium text-sm text-foreground truncate">{collection.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{collection.region}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full"
                      style={{ width: `${(collection.progress / collection.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gold">
                    {collection.progress}/{collection.total}
                  </span>
                </div>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201, 162, 39, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(201, 162, 39, 0); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
        @keyframes pulse-subtle {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201, 162, 39, 0.1); }
          50% { box-shadow: 0 0 15px 0 rgba(201, 162, 39, 0.2); }
        }
      `}</style>

      <BottomNav />
    </div>
  );
}

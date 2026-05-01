import React, { useMemo, useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { venues } from '../data/venues';
import { rankVenues, calculateVibeMatch } from '../utils/matching';
import { getCurrentLocation, calculateDistance } from '../utils/geolocation';
import { VenueCard } from '../components/VenueCard';
import { MapPin, SlidersHorizontal, Building2, Loader } from 'lucide-react';
import type { MatchedVenue } from '../utils/matching';
import type { Coordinates } from '../utils/geolocation';

export const Dashboard: React.FC = () => {
  const { state, setUserCoords } = useAppContext();
  const [radius, setRadius] = useState(5);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Request GPS on mount if we don't have coordinates yet
  useEffect(() => {
    if (!state.userCoords) {
      setLocating(true);
      getCurrentLocation()
        .then((coords) => {
          setUserCoords(coords);
          setLocating(false);
        })
        .catch(() => {
          // Fallback to Sofia center
          setUserCoords({ lat: 42.6977, lng: 23.3219 });
          setLocationError('Could not get your location. Showing distances from Sofia center.');
          setLocating(false);
        });
    }
  }, []);

  // Rank all venues by distance + vibe match
  const rankedVenues = useMemo(() => {
    if (!state.userCoords) return [];
    return rankVenues(venues, state.userCoords, state.userKeywords, radius);
  }, [state.userCoords, state.userKeywords, radius]);

  // Venues outside the radius (still show them, just separately)
  const otherVenues: MatchedVenue[] = useMemo(() => {
    if (!state.userCoords) return [];
    const rankedIds = new Set(rankedVenues.map(v => v.id));
    return venues
      .filter(v => !rankedIds.has(v.id))
      .map(v => {
        const distance = calculateDistance(state.userCoords!, { lat: v.lat, lng: v.lng });
        const matchPercentage = calculateVibeMatch(state.userKeywords, v.keywords);
        return {
          ...v,
          distance,
          matchPercentage,
          hybridScore: 0,
        };
      })
      .sort((a, b) => a.distance - b.distance);
  }, [rankedVenues, state.userCoords, state.userKeywords]);

  if (locating) {
    return (
      <div className="text-center p-8" style={{ paddingTop: '20vh' }}>
        <Loader className="animate-spin mx-auto mb-4" size={40} color="var(--primary-color)" />
        <h2 className="text-lg">Getting your location...</h2>
        <p className="text-muted text-sm mt-2">We need your GPS to calculate distances to facilities.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl" style={{ margin: 0 }}>
            <span className="text-gradient">Hello, {state.userName || 'Athlete'}</span>
          </h1>
          <p className="text-sm text-muted flex items-center gap-1 mt-1">
            <MapPin size={12} /> {locationError ? 'Sofia, Bulgaria (default)' : 'Your location'} — {radius}km radius
          </p>
        </div>
      </div>

      {locationError && (
        <div className="card mb-4" style={{ padding: '10px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.85rem', color: '#f87171' }}>
          ⚠️ {locationError}
        </div>
      )}

      {/* Radius Selector */}
      <div className="card mb-6" style={{ padding: '16px 20px', background: 'rgba(30, 41, 59, 0.5)' }}>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs text-muted font-bold uppercase tracking-wider flex items-center gap-2">
            <SlidersHorizontal size={14} /> Search Radius
          </label>
          <span style={{
            background: 'var(--primary-color)',
            color: '#fff',
            padding: '2px 10px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
          }}>
            {radius} km
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: 'var(--primary-color)',
            cursor: 'pointer',
          }}
        />
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>1 km</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
            {rankedVenues.length} venue{rankedVenues.length !== 1 ? 's' : ''} within range
          </span>
          <span>10 km</span>
        </div>
      </div>

      {state.userKeywords.length > 0 && (
        <div className="mb-6">
          <label className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block">
            Your Core Vibe
          </label>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            {state.userKeywords.map((kw) => (
              <span key={kw} className="badge" style={{ background: 'var(--primary-color)', color: '#fff', borderColor: 'transparent' }}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Nearby venues (within radius) */}
      {rankedVenues.length > 0 && (
        <>
          <h2 className="text-sm text-muted font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
            <MapPin size={14} /> Nearby Venues ({rankedVenues.length})
          </h2>
          <div className="grid-cards mb-8">
            {rankedVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </>
      )}

      {/* Other registered venues (outside radius) */}
      {otherVenues.length > 0 && (
        <>
          <h2 className="text-sm text-muted font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
            <Building2 size={14} /> Other Facilities ({otherVenues.length})
          </h2>
          <div className="grid-cards">
            {otherVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </>
      )}

      {/* Empty state when no venues exist at all */}
      {venues.length === 0 && (
        <div className="card text-center p-8 mt-4">
          <Building2 size={40} color="var(--text-muted)" className="mx-auto mb-3" style={{ opacity: 0.5 }} />
          <h3 className="text-lg">No facilities registered yet</h3>
          <p className="text-muted text-sm mt-2">
            Venues are added by facility owners who sign up on VibeFit. Check back soon!
          </p>
        </div>
      )}
    </>
  );
};

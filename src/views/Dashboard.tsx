import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { venues } from '../data/venues';
import { rankVenues } from '../utils/matching';
import { VenueCard } from '../components/VenueCard';
import { MapPin, SlidersHorizontal } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const [radius, setRadius] = useState(10);

  const rankedVenues = useMemo(() => {
    if (!state.userCoords) return [];
    return rankVenues(venues, state.userCoords, state.userKeywords, radius);
  }, [state.userCoords, state.userKeywords, radius]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl" style={{ margin: 0 }}>
            <span className="text-gradient">Hello, {state.userName || 'Athlete'}</span>
          </h1>
          <p className="text-sm text-muted flex items-center gap-1 mt-1">
            <MapPin size={12} /> Sofia, Bulgaria ({radius}km radius)
          </p>
        </div>
      </div>

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
          max="25"
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
            {rankedVenues.length} venue{rankedVenues.length !== 1 ? 's' : ''} found
          </span>
          <span>25 km</span>
        </div>
      </div>

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

      <div className="grid-cards">
        {rankedVenues.length > 0 ? (
          rankedVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))
        ) : (
          <div className="card text-center p-8 mt-4" style={{ gridColumn: '1 / -1' }}>
            <h3 className="text-lg">No venues found nearby</h3>
            <p className="text-muted text-sm mt-2">Try expanding your search radius or retaking the vibe quiz.</p>
          </div>
        )}
      </div>
    </>
  );
};

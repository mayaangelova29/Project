import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { venues } from '../data/venues';
import { rankVenues } from '../utils/matching';
import { VenueCard } from '../components/VenueCard';
import { MapPin } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { state } = useAppContext();

  const rankedVenues = useMemo(() => {
    if (!state.userCoords) return [];
    return rankVenues(venues, state.userCoords, state.userKeywords);
  }, [state.userCoords, state.userKeywords]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl" style={{ margin: 0 }}>
            <span className="text-gradient">Hello, {state.userName || 'Athlete'}</span>
          </h1>
          <p className="text-sm text-muted flex items-center gap-1 mt-1">
            <MapPin size={12} /> Sofia, Bulgaria (10km radius)
          </p>
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
            <p className="text-muted text-sm mt-2">Try expanding your search or retaking the vibe quiz.</p>
          </div>
        )}
      </div>
    </>
  );
};

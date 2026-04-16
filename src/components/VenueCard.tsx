import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { MatchedVenue } from '../utils/matching';
import { MapPin, Star, CheckCircle } from 'lucide-react';

interface Props {
  venue: MatchedVenue;
}

export const VenueCard: React.FC<Props> = ({ venue }) => {
  const navigate = useNavigate();

  // Color mapping based on score
  let matchColor = 'var(--accent-color)'; // default blue
  if (venue.matchPercentage >= 80) matchColor = 'var(--success-color)';
  if (venue.matchPercentage < 50) matchColor = 'var(--text-muted)';

  return (
    <div 
      className="card mb-4" 
      style={{ padding: '0', overflow: 'hidden', cursor: 'pointer' }}
      onClick={() => navigate(`/app/venue/${venue.id}`)}
    >
      <div style={{ position: 'relative', height: '140px' }}>
        <img 
          src={venue.imageUrl} 
          alt={venue.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to top, rgba(15,23,42,1) 0%, rgba(15,23,42,0) 100%)'
        }}></div>
        
        {/* Match Badge */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)',
          padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold',
          color: matchColor, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px',
          border: `1px solid ${matchColor}40`
        }}>
          {Math.round(venue.matchPercentage)}% Match
        </div>
        
        {/* Free Session Badge */}
        {venue.freeSession && (
          <div style={{
            position: 'absolute', top: '12px', left: '12px',
            background: 'var(--primary-color)', color: 'white',
            padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600',
            boxShadow: 'var(--shadow-sm)'
          }}>
            1st Class Free
          </div>
        )}
      </div>

      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem' }}>{venue.name}</h3>
        
        <div className="flex justify-between items-center text-sm text-muted mb-3">
          <span className="flex items-center gap-1">
            <MapPin size={14} /> {venue.distance.toFixed(1)} km away
          </span>
          <span className="flex items-center gap-1">
            <Star size={14} color="#f59e0b" fill="#f59e0b" /> 
            {venue.rating} ({venue.reviewCount})
          </span>
        </div>

        <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
          {venue.keywords.slice(0, 3).map((kw, i) => (
            <span key={i} className="badge" style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', borderColor: 'rgba(255,255,255,0.1)' }}>
              {kw}
            </span>
          ))}
          {venue.acceptsMultisport && (
             <span className="badge success" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
               <CheckCircle size={10} /> Multisport
             </span>
          )}
        </div>
      </div>
    </div>
  );
};

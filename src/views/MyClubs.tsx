import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { venues } from '../data/venues';
import { Users, Trophy, MapPin, Star, ChevronRight } from 'lucide-react';

export const MyClubs: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();

  const joinedVenues = useMemo(() => {
    return venues.filter((v) => state.joinedClubs.includes(v.id));
  }, [state.joinedClubs]);

  // Count check-ins per club
  const checkInCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const ci of state.checkIns) {
      counts[ci.venueId] = (counts[ci.venueId] || 0) + 1;
    }
    return counts;
  }, [state.checkIns]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="mb-8">
        <h1 className="text-2xl mb-1">
          <span className="text-gradient">My Clubs</span>
        </h1>
        <p className="text-sm text-muted">
          Your memberships &amp; club competitions
        </p>
      </div>

      {joinedVenues.length === 0 ? (
        <div className="card text-center p-8" style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px dashed rgba(99, 102, 241, 0.3)' }}>
          <Users size={48} color="var(--primary-color)" className="mx-auto mb-4" style={{ opacity: 0.6 }} />
          <h3 className="text-lg mb-2">No clubs yet</h3>
          <p className="text-muted text-sm mb-6">
            Explore venues on the Discover page and join the ones you love to unlock club leaderboards and compete with other members!
          </p>
          <button className="btn" onClick={() => navigate('/app')}>
            Explore Venues
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {joinedVenues.map((venue) => {
            const myCheckIns = checkInCounts[venue.id] || 0;
            return (
              <div
                key={venue.id}
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => navigate(`/app/club/${venue.id}/leaderboard`)}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div className="flex" style={{ alignItems: 'stretch' }}>
                  {/* Club Image */}
                  <div style={{ width: '120px', minHeight: '120px', flexShrink: 0 }}>
                    <img
                      src={venue.imageUrl}
                      alt={venue.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Club Info */}
                  <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{venue.name}</h3>
                        <p className="text-xs text-muted flex items-center gap-1" style={{ margin: '0 0 12px 0' }}>
                          <MapPin size={12} /> {venue.address}
                        </p>
                      </div>
                      <ChevronRight size={20} color="var(--text-muted)" />
                    </div>

                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Star size={14} color="#f59e0b" fill="#f59e0b" />
                        <span>{venue.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--primary-color)' }}>
                        <Trophy size={14} />
                        <span>{myCheckIns} check-in{myCheckIns !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="badge" style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success-color)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        Member
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

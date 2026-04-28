import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Star, Navigation, Phone, CheckCircle, ExternalLink, Users, Trophy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { venues } from '../data/venues';
import { calculateVibeMatch } from '../utils/matching';
import { fetchGooglePlacePhoto } from '../utils/googlePlaces';

export const VenueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, addCheckIn, joinClub, leaveClub } = useAppContext();
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkedInMessage, setCheckedInMessage] = useState<string | null>(null);

  const venue = useMemo(() => venues.find((v) => v.id === id), [id]);
  const [photoUrl, setPhotoUrl] = useState<string>('');

  // Setup initial photo url
  useEffect(() => {
    if (venue) setPhotoUrl(venue.imageUrl);
  }, [venue]);

  // Try fetching API photo
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (apiKey && venue) {
      fetchGooglePlacePhoto(venue.name, venue.address, apiKey).then(url => {
        if (url) setPhotoUrl(url);
      });
    }
  }, [venue]);

  const hasCheckedInToday = useMemo(() => {
    if (!venue) return false;
    const today = new Date().toDateString();
    return state.checkIns.some(c => c.venueId === venue.id && new Date(c.timestamp).toDateString() === today);
  }, [state.checkIns, venue]);

  if (!venue) {
    return <div className="p-8 text-center">Venue not found</div>;
  }

  const matchPercentage = calculateVibeMatch(state.userKeywords, venue.keywords);

  const handleCheckIn = () => {
    if (hasCheckedInToday) return;
    setCheckingIn(true);
    setTimeout(() => {
      addCheckIn(venue.id);
      setCheckingIn(false);
      setCheckedInMessage("+100 Points! Check-in successful.");
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Hero Image */}
      <div style={{ position: 'relative', height: '280px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '24px' }}>
        <button 
          onClick={() => navigate('/app')}
          style={{ 
            position: 'absolute', top: '16px', left: '16px', zIndex: 10,
            background: 'rgba(15,23,42,0.6)', border: 'none', color: '#fff',
            borderRadius: '50%', width: '40px', height: '40px',
            display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
            backdropFilter: 'blur(4px)'
          }}
        >
          <ChevronLeft size={24} />
        </button>
        <img 
          src={photoUrl || venue.imageUrl} 
          alt={venue.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, var(--bg-color) 0%, transparent 100%)'
        }}></div>
      </div>

      <div style={{ padding: '0 8px', position: 'relative', zIndex: 5 }}>
        
        {/* Title & Score */}
        <div className="flex justify-between items-start mb-2">
          <h1 style={{ fontSize: '1.8rem', lineHeight: '1.2', maxWidth: '75%' }}>{venue.name}</h1>
          <div style={{ 
            background: 'var(--success-color)', color: '#fff', fontWeight: 'bold',
            padding: '4px 12px', borderRadius: '16px', fontSize: '0.9rem',
            boxShadow: '0 4px 10px rgba(16, 185, 129, 0.4)'
          }}>
            {Math.round(matchPercentage)}% Fit
          </div>
        </div>
        
        <p className="text-muted flex items-center gap-1 text-sm mb-6">
          <MapPin size={16} /> {venue.address}
        </p>

        {/* Actions Row */}
        <div className="flex gap-4 mb-8">
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.mapQuery || (venue.name + ', Sofia'))}`} 
            target="_blank" 
            rel="noreferrer"
            className="flex-1 btn btn-secondary" 
            style={{ padding: '10px', textDecoration: 'none' }}
          >
            <Navigation size={18} /> Open in Maps
          </a>
          <a 
            href="tel:+359888123456"
            className="flex-1 btn btn-secondary" 
            style={{ padding: '10px', textDecoration: 'none' }}
          >
            <Phone size={18} /> Call
          </a>
        </div>

        {/* Map Widget */}
        <div style={{ width: '100%', height: '300px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            style={{ border: 0 }} 
            src={`https://maps.google.com/maps?q=${encodeURIComponent(venue.mapQuery || (venue.name + ', Sofia'))}&t=m&z=15&output=embed&iwloc=`} 
            allowFullScreen 
            title={`Map for ${venue.name}`}
          ></iframe>
        </div>

        {/* Why it matches */}
        <section className="card mb-6" style={{ background: 'rgba(99, 102, 241, 0.1)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
          <h3 className="mb-2 text-md flex items-center gap-2">
            <Star size={18} color="var(--accent-color)" /> Why it matches you
          </h3>
          <p className="text-sm text-main mb-3">
            This venue aligns with your preference for <strong className="text-white">
              {venue.keywords.filter(k => state.userKeywords.includes(k)).join(', ') || 'fitness and movement'}
            </strong>.
          </p>
          <div className="flex gap-2 flex-wrap">
            {venue.keywords.map((kw) => {
              const highlights = state.userKeywords.includes(kw);
              return (
                <span key={kw} className="badge" style={{ 
                  background: highlights ? 'var(--primary-color)' : 'transparent',
                  color: highlights ? '#fff' : 'var(--text-muted)'
                }}>
                  {kw}
                </span>
              )
            })}
          </div>
        </section>

        {/* Amenities */}
        <section className="mb-6">
          <h3 className="mb-3 text-md">Details</h3>
          <p className="text-sm text-muted mb-4">{venue.description}</p>
          
          <div className="flex flex-col gap-2">
            {venue.acceptsMultisport && (
              <div className="flex items-center gap-2 text-sm">
                 <CheckCircle size={16} color="var(--success-color)" /> Accepts Multisport Card
              </div>
            )}
            {venue.freeSession && (
              <div className="flex items-center gap-2 text-sm">
                 <CheckCircle size={16} color="var(--success-color)" /> Free First Trial Session available
              </div>
            )}
          </div>
        </section>

        {/* Mock Google Reviews */}
        <section className="mb-8 p-4 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md m-0">Google Reviews</h3>
            <div className="flex items-center gap-1 font-bold">
              <Star size={16} fill="#f59e0b" color="#f59e0b" /> {venue.rating} <span className="text-muted text-xs font-normal">({venue.reviewCount})</span>
            </div>
          </div>
          <p className="text-sm text-muted italic">
            "Vibe extraction: Users frequently mention words like <strong>{venue.keywords.slice(0,2).join(' and ')}</strong> here."
          </p>
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name + ' ' + venue.address)}`} 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-1 text-sm mt-3" 
            style={{ color: 'var(--accent-color)', textDecoration: 'none' }}
          >
            Read all reviews on Google <ExternalLink size={14} />
          </a>
        </section>

        {/* Club Membership */}
        {(() => {
          const isMember = state.joinedClubs.includes(venue.id);
          return (
            <section className="mb-6">
              {isMember ? (
                <div className="card" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '20px' }}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                        <Users size={22} color="var(--success-color)" />
                      </div>
                      <div>
                        <div className="font-bold" style={{ color: 'var(--success-color)' }}>Club Member ✓</div>
                        <div className="text-xs text-muted">You're part of this club</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                        onClick={() => navigate(`/app/club/${venue.id}/leaderboard`)}
                      >
                        <Trophy size={16} /> Leaderboard
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '8px 14px', fontSize: '0.85rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                        onClick={() => leaveClub(venue.id)}
                      >
                        Leave
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  className="btn w-full"
                  style={{
                    padding: '16px',
                    fontSize: '1.05rem',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
                  }}
                  onClick={() => joinClub(venue.id)}
                >
                  <Users size={20} /> Join This Club
                  <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>+200 pts</span>
                </button>
              )}
            </section>
          );
        })()}

        {/* Check-in Gamification */}
        {hasCheckedInToday ? (
           <div className="p-4 text-center rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--success-color)' }}>
             <CheckCircle className="mx-auto mb-2" size={24} />
             <p className="font-bold">Checked in today!</p>
             <p className="text-xs mt-1">You earned 100 points.</p>
           </div>
        ) : (
          <div>
            <button 
              className="btn w-full" 
              onClick={handleCheckIn}
              disabled={checkingIn}
            >
              {checkingIn ? 'Locating...' : "I'm Here — Check In"}
            </button>
            {checkedInMessage && <p className="text-center text-sm mt-2 text-success" style={{ color: 'var(--success-color)' }}>{checkedInMessage}</p>}
          </div>
        )}
      </div>


    </div>
  );
};

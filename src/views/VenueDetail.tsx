import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Star, Navigation, Phone, CheckCircle, ExternalLink } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { venues } from '../data/venues';
import { calculateVibeMatch } from '../utils/matching';

export const VenueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, addCheckIn } = useAppContext();
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkedInMessage, setCheckedInMessage] = useState<string | null>(null);

  const venue = useMemo(() => venues.find((v) => v.id === id), [id]);
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
    <div className="absolute inset-0 bg-slate-900 z-50 overflow-y-auto" style={{ background: 'var(--bg-color)', minHeight: '100vh' }}>
      {/* Hero Image */}
      <div style={{ position: 'relative', height: '280px' }}>
        <button 
          onClick={() => navigate('/')}
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
          src={venue.imageUrl} 
          alt={venue.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, var(--bg-color) 0%, transparent 100%)'
        }}></div>
      </div>

      <div style={{ padding: '0 24px 100px 24px', marginTop: '-40px', position: 'relative', zIndex: 5 }}>
        
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
          <button className="flex-1 btn btn-secondary" style={{ padding: '10px' }}>
            <Navigation size={18} /> Directions
          </button>
          <button className="flex-1 btn btn-secondary" style={{ padding: '10px' }}>
            <Phone size={18} /> Call
          </button>
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
          <a href="#" className="flex items-center gap-1 text-sm mt-3" style={{ color: 'var(--accent-color)' }}>
            Read all reviews <ExternalLink size={14} />
          </a>
        </section>

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
              {checkingIn ? 'Locating...' : 'I\'m Here — Check In'}
            </button>
            {checkedInMessage && <p className="text-center text-sm mt-2 text-success" style={{ color: 'var(--success-color)' }}>{checkedInMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

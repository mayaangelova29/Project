import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { venues } from '../data/venues';
import { MapPin, Star, Users, CheckCircle, TrendingUp, Eye } from 'lucide-react';

export const VenueDashboard: React.FC = () => {
  const { state } = useAppContext();

  const myVenue = useMemo(() => {
    if (!state.venueId) return null;
    return venues.find((v) => v.id === state.venueId) || null;
  }, [state.venueId]);

  if (!myVenue) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl mb-2">Venue not found</h2>
        <p className="text-muted">Your venue listing could not be loaded.</p>
      </div>
    );
  }

  // Simulate stats
  const totalMembers = Math.floor(Math.random() * 50) + 10;
  const totalCheckIns = myVenue.reviewCount;
  const viewsThisWeek = Math.floor(Math.random() * 200) + 50;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="mb-8">
        <h1 className="text-2xl mb-1">
          <span className="text-gradient">Venue Dashboard</span>
        </h1>
        <p className="text-sm text-muted">Manage your listing on VibeFit</p>
      </div>

      {/* Venue Preview Card */}
      <div className="card mb-6" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: '200px' }}>
          <img
            src={myVenue.imageUrl}
            alt={myVenue.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, var(--bg-color) 0%, transparent 60%)',
          }} />
        </div>
        <div style={{ padding: '20px', marginTop: '-50px', position: 'relative', zIndex: 2 }}>
          <div className="flex justify-between items-start">
            <div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '1.5rem' }}>{myVenue.name}</h2>
              <p className="text-xs text-muted flex items-center gap-1">
                <MapPin size={12} /> {myVenue.address}
              </p>
            </div>
            <div className="flex items-center gap-1" style={{ color: '#f59e0b', fontWeight: 'bold' }}>
              <Star size={16} fill="#f59e0b" /> {myVenue.rating}
            </div>
          </div>
          <p className="text-sm text-muted mt-3">{myVenue.description}</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {myVenue.keywords.map((kw) => (
              <span key={kw} className="badge" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid-cards mb-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card text-center p-4">
          <Users size={24} color="var(--primary-color)" className="mx-auto mb-2" />
          <div className="text-2xl font-bold" style={{ color: 'var(--primary-color)' }}>{totalMembers}</div>
          <div className="text-xs text-muted mt-1 uppercase tracking-wider font-bold">Members</div>
        </div>
        <div className="card text-center p-4">
          <CheckCircle size={24} color="var(--success-color)" className="mx-auto mb-2" />
          <div className="text-2xl font-bold" style={{ color: 'var(--success-color)' }}>{totalCheckIns}</div>
          <div className="text-xs text-muted mt-1 uppercase tracking-wider font-bold">Check-ins</div>
        </div>
        <div className="card text-center p-4">
          <Eye size={24} color="var(--accent-color)" className="mx-auto mb-2" />
          <div className="text-2xl font-bold" style={{ color: 'var(--accent-color)' }}>{viewsThisWeek}</div>
          <div className="text-xs text-muted mt-1 uppercase tracking-wider font-bold">Views / Week</div>
        </div>
      </div>

      {/* Features */}
      <div className="card mb-6">
        <h3 className="text-md mb-3">Listing Features</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle size={16} color={myVenue.acceptsMultisport ? 'var(--success-color)' : 'var(--text-muted)'} />
            <span style={{ color: myVenue.acceptsMultisport ? 'var(--text-main)' : 'var(--text-muted)' }}>
              Accepts Multisport Card {!myVenue.acceptsMultisport && '(disabled)'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle size={16} color={myVenue.freeSession ? 'var(--success-color)' : 'var(--text-muted)'} />
            <span style={{ color: myVenue.freeSession ? 'var(--text-main)' : 'var(--text-muted)' }}>
              Free Trial Session {!myVenue.freeSession && '(disabled)'}
            </span>
          </div>
        </div>
      </div>

      {/* Tip */}
      <div className="card" style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <div className="flex items-start gap-3">
          <TrendingUp size={20} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <h4 className="text-sm font-bold mb-1">Boost your visibility</h4>
            <p className="text-xs text-muted">
              Athletes discover your venue based on keyword matching. Make sure your keywords accurately reflect your training style and atmosphere to attract the right members!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

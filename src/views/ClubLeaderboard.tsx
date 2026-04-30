import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { venues } from '../data/venues';
import { ChevronLeft, Trophy, Medal, Star, MapPin, Users } from 'lucide-react';

export const ClubLeaderboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useAppContext();
  const [dbUsers, setDbUsers] = useState<any[]>([]);

  const venue = useMemo(() => venues.find((v) => v.id === id), [id]);

  // Fetch real users from DB
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users');
        const users = await response.json();
        setDbUsers(users);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, []);

  const myCheckIns = useMemo(() => {
    if (!venue) return 0;
    return state.checkIns.filter((c) => c.venueId === venue.id).length;
  }, [state.checkIns, venue]);

  const leaderboard = useMemo(() => {
    if (!venue) return [];

    // Real DB users who have checked in at this venue
    const realMembers = dbUsers
      .filter(u => u.role === 'athlete' && u.email !== state.email)
      .map(u => ({
        id: u.id,
        name: u.name,
        checkIns: (u.checkIns || []).filter((c: any) => c.venueId === venue.id).length,
        avatar: u.profilePhoto || `https://i.pravatar.cc/150?u=${u.id}`,
      }))
      .filter(m => m.checkIns > 0);

    // Current user
    const me = {
      id: 'me',
      name: state.userName || 'You',
      checkIns: myCheckIns,
      avatar: state.profilePhoto || 'https://i.pravatar.cc/150?u=me',
    };

    return [...realMembers, me].sort((a, b) => b.checkIns - a.checkIns);
  }, [venue, dbUsers, myCheckIns, state.userName, state.profilePhoto, state.email]);

  const myRank = leaderboard.findIndex((u) => u.id === 'me') + 1;

  if (!venue) {
    return <div className="p-8 text-center">Club not found</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <button
        onClick={() => navigate('/app/clubs')}
        style={{
          background: 'transparent', border: 'none', color: 'var(--text-muted)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
          padding: 0, marginBottom: '24px',
        }}
      >
        <ChevronLeft size={18} /> Back to My Clubs
      </button>

      {/* Club Hero */}
      <div className="card mb-6" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: '160px' }}>
          <img
            src={venue.imageUrl}
            alt={venue.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, var(--bg-color) 0%, transparent 60%)',
          }} />
        </div>
        <div style={{ padding: '16px', marginTop: '-40px', position: 'relative', zIndex: 2 }}>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '1.5rem' }}>{venue.name}</h2>
          <p className="text-xs text-muted flex items-center gap-1">
            <MapPin size={12} /> {venue.address}
          </p>
        </div>
      </div>

      {/* Your stats */}
      <div className="card mb-6" style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(236,72,153,0.1))',
        borderColor: 'var(--primary-color)',
      }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'var(--surface-color)', overflow: 'hidden',
              border: '2px solid var(--primary-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {state.profilePhoto ? (
                <img src={state.profilePhoto} alt="You" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <img src="https://i.pravatar.cc/150?u=me" alt="You" style={{ width: '100%' }} />
              )}
            </div>
            <div>
              <div className="font-bold">Your Club Rank: #{myRank}</div>
              <div className="text-sm" style={{ color: 'var(--primary-color)' }}>
                {myCheckIns} check-in{myCheckIns !== 1 ? 's' : ''} here
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted mb-1">Global Pts</div>
            <div className="font-bold flex items-center justify-end gap-1">
              <Star size={14} color="var(--accent-color)" /> {state.points}
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <h3 className="text-sm text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
        <Trophy size={16} color="#f59e0b" /> Club Rankings
      </h3>

      {leaderboard.length <= 1 ? (
        <div className="card text-center p-8" style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px dashed rgba(99, 102, 241, 0.3)' }}>
          <Users size={40} color="var(--text-muted)" className="mx-auto mb-3" style={{ opacity: 0.5 }} />
          <h3 className="text-lg mb-2">Be the first!</h3>
          <p className="text-muted text-sm">
            Check in at this venue to start climbing the leaderboard. Invite friends to compete!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {leaderboard.map((user, index) => {
            const isMe = user.id === 'me';
            return (
              <div
                key={user.id}
                className="card flex items-center p-3"
                style={{
                  border: isMe ? '1px solid var(--primary-color)' : '1px solid rgba(255,255,255,0.05)',
                  background: isMe ? 'rgba(99,102,241,0.1)' : undefined,
                }}
              >
                <div style={{ width: '30px', fontWeight: 'bold', color: index < 3 ? '#f59e0b' : 'var(--text-muted)' }}>
                  {index === 0 && <Medal size={20} color="#f59e0b" />}
                  {index === 1 && <Medal size={20} color="#94a3b8" />}
                  {index === 2 && <Medal size={20} color="#b45309" />}
                  {index > 2 && `#${index + 1}`}
                </div>

                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', margin: '0 12px' }}
                />

                <div className="flex-1 font-bold">
                  {user.name} {isMe && <span style={{ color: 'var(--primary-color)', fontWeight: 'normal', fontSize: '0.8rem' }}>(You)</span>}
                </div>

                <div className="font-mono text-sm">
                  {user.checkIns} visit{user.checkIns !== 1 ? 's' : ''}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { venues } from '../data/venues';
import { Users, Medal, Star } from 'lucide-react';

export const VenueMembers: React.FC = () => {
  const { state } = useAppContext();
  const [dbUsers, setDbUsers] = useState<any[]>([]);

  const myVenue = useMemo(() => {
    if (!state.venueId) return null;
    return venues.find((v) => v.id === state.venueId) || null;
  }, [state.venueId]);

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

  // Show only real DB users who have interacted with this venue
  const members = useMemo(() => {
    if (!myVenue) return [];

    return dbUsers
      .filter((u) => u.role === 'athlete')
      .map((u) => ({
        id: u.id,
        name: u.name,
        checkIns: (u.checkIns || []).filter((c: any) => c.venueId === myVenue.id).length,
        joinedDaysAgo: 1,
        avatar: u.profilePhoto || `https://i.pravatar.cc/150?u=${u.id}`,
      }))
      .filter((m) => m.checkIns > 0)
      .sort((a, b) => b.checkIns - a.checkIns);
  }, [myVenue, dbUsers]);

  if (!myVenue) {
    return <div className="p-8 text-center">Venue not found</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="text-center mb-8">
        <Users size={48} color="var(--primary-color)" className="mx-auto mb-4" />
        <h1 className="text-2xl mb-1">{myVenue.name}</h1>
        <p className="text-muted text-sm">{members.length} member{members.length !== 1 ? 's' : ''}</p>
      </div>

      {members.length === 0 ? (
        <div className="card text-center p-8" style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px dashed rgba(99, 102, 241, 0.3)' }}>
          <Users size={40} color="var(--text-muted)" className="mx-auto mb-3" style={{ opacity: 0.5 }} />
          <h3 className="text-lg mb-2">No members yet</h3>
          <p className="text-muted text-sm">
            Once athletes check in at your venue, they will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {members.map((member, index) => (
            <div
              key={member.id}
              className="card flex items-center p-3"
              style={{ border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div style={{ width: '30px', fontWeight: 'bold', color: index < 3 ? '#f59e0b' : 'var(--text-muted)' }}>
                {index === 0 && <Medal size={20} color="#f59e0b" />}
                {index === 1 && <Medal size={20} color="#94a3b8" />}
                {index === 2 && <Medal size={20} color="#b45309" />}
                {index > 2 && `#${index + 1}`}
              </div>

              <img
                src={member.avatar}
                alt={member.name}
                style={{ width: '40px', height: '40px', borderRadius: '50%', margin: '0 12px' }}
              />

              <div className="flex-1">
                <div className="font-bold">{member.name}</div>
              </div>

              <div className="font-mono text-sm flex items-center gap-1">
                <Star size={12} color="var(--accent-color)" />
                {member.checkIns} visit{member.checkIns !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
